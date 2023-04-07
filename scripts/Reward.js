class Reward {
    //the constructor
    constructor(adminAccount, tokenAddress, privateKey, infuraHTTPURL, abi, studentMetamaskAccount, amountToken, matricNo, attendanceId) {
        this.adminAccount = adminAccount;
        this.tokenAddress = tokenAddress;
        this.privateKey = privateKey;
        this.infuraHTTPURL = infuraHTTPURL;
        this.abi = abi;
        this.studentMetamaskAccount = studentMetamaskAccount;
        this.amountToken = amountToken;
        this.matricNo = matricNo;
        this.attendanceId = attendanceId;

        //create a connection to infura
        this.web3 = new Web3(this.infuraHTTPURL);
    }

    //transfer 1 UTHM Token to student metamask account
    async giveToken() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        console.log("Account : " + account)
        window.ethereum.on('accountsChanged', function(accounts) {
            // Time to reload your interface with accounts[0]!
            console.log(accounts[0])
        });
        //get nonce
        const nonce = await this.web3.eth.getTransactionCount(this.adminAccount, "latest");
        //convert Eth to wei
        const value = this.web3.utils.toWei(this.amountToken.toString(), 'Ether');

        const tokenContract = new this.web3.eth.Contract(this.abi, this.tokenAddress);

        const data = tokenContract.methods.transfer(this.studentMetamaskAccount, value).encodeABI();

        //higher gas price
        //higher fees
        //20 gwei is okay
        const gasPrice = this.web3.utils.toHex(this.web3.utils.toWei('6', 'gwei'));

        //prepare transaction. fields - to, value, gasPrice, gasLimit, nonce
        const transaction = {
            'to': this.tokenAddress,
            'value': "0x00", //used only for eth transfer else 0
            'gasLimit': 6721975, //changed after EIP-1559 upgrade 6721975
            'gasPrice': gasPrice, //changed after EIP-1559 upgrade 20000000000 (20 gwei)
            'nonce': nonce,
            'data': data //transaction data
        }

        //create signed transaction
        const signTrx = await this.web3.eth.accounts.signTransaction(transaction, this.privateKey);

        this.web3.eth.sendSignedTransaction(signTrx.rawTransaction, function(error, hash) {
            if (error) {
                console.log('Something went wrong', error);
                error_popup.style.display = "block";
                e_close.onclick = function() {
                    error_popup.style.display = "none";
                }
            } else {
                console.log('transaction submitted ', hash);
                new Reward().transactionHash(hash);
            }
        })
    }

    //save the transaction hash to save in track order
    //admin can track the transaction by this hash
    transactionHash(hash) {
        fetch('http://localhost:5000/hash/transaction', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify({
                matricNo: matricNo,
                trackingHash: hash
            })
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.success && data.message === "Transaction Hash Saved") {
                success_popup.style.display = "block";
                s_close.onclick = function() {
                    success_popup.style.display = "none";
                    new Reward().updateStatusReward();
                    location.href = "reward.html";
                }
            } else {
                error2_popup.style.display = "block";
                e2_close.onclick = function() {
                    error2_popup.style.display = "none";
                    location.reload();
                }

            }
        }).catch((err) => {
            console.log(err);
        })
    }

    //update statusReward attendance to send 
    updateStatusReward() {
        fetch('http://localhost:5000/attendance/statusreward/' + attendanceId, {
            method: "PATCH",
            mode: "cors",
            headers: {
                'Content-type': 'application/json;'
            },
        }).then((res) => {
            return res.json();
        }).catch((err) => {
            console.log(err);
        });
    }

    //get total UTHM token in the bank
    async getTotalToken(infuraLink, addressToken, tokenContractABI, accountAdmin) {
        //create connection in getTotalToken() function only
        const web3 = new Web3(infuraLink);

        const tokenContract = new web3.eth.Contract(tokenContractABI, addressToken);

        const balanceWei = await tokenContract.methods.balanceOf(accountAdmin).call();
        const balance = web3.utils.fromWei(balanceWei, "ether");
        document.getElementById("total-token").innerHTML = balance;
    }
}