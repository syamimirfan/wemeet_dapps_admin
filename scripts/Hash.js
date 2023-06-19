class Hash {
    //get tracking hash
    getTrackingHash() {
        fetch(new Utils().baseURL + '/hash/gettransaction')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let trackingHash = "";

                if (data.success && data.hash && data.hash.length > 0) {
                    trackingHash += `
                    <table class="table bg-white rounded shadow-sm">
                    <thead>
                        <tr>
                            <th scope="col ">Matric Number</th>
                            <th scope="col ">Name</th>
                            <th scope="col ">Telephone No</th>
                            <th scope="col ">Tracking Hash</th>
                            <th scope="col ">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    `;
                    data.hash.map((item) => {
                        
                        trackingHash += `    
                <tr>
                    <td>${item['matricNo']}</td>
                    <td>${item['studName']}</td>
                    <td>${item['studTelephoneNo']}</td>
                    <td><a href="https://sepolia.etherscan.io/tx/${item['trackingHash']}" target="_blank">${item['trackingHash']}</a></td>
                    <td>
                    <button class="fs-2 p-2 give-done" onclick="document.getElementById('id${item['matricNo']}').style.display='block'"> 
                    <i class="fas fa-trash"></i>
                   </button>
                    </td>
                </tr>
                <div id="id${item['matricNo']}" class="modal">
                <div class="modal-content">
                    <div class="container">
                        <h1>Delete Transaction</h1>
                        <p class="fs-5 p-delete">Are you sure you want to delete ${item['trackingHash']}'s transaction?</p>
        
                        <div class="clearfix">
                            <button type="button" onclick="document.getElementById('id${item['matricNo']}').style.display='none'" class="cancelbtn">Cancel</button>
                            <button type="button" onclick="new Hash().deleteTrackingHash(${item['hashId']}), document.getElementById('id${item['matricNo']}').style.display='none'" class="deletebtn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>  
        
                    `;
                    });
                    trackingHash += `
                      </tbody>
                    </table>
                    `;
                } else {
                    trackingHash += `
                    <div class="no-data-hash rounded">
                         <h1 class="hash-unavailable"> NO HASH AVAILABLE </h1>
                    </div>
                `;
                }
                document.getElementById("hash").innerHTML = trackingHash;
            }).catch((err) => {
                console.log(err);
            })
    }

    //delete tracking hash
    deleteTrackingHash(hashId) {
        fetch(new Utils().baseURL + '/hash/deletetransaction/' + hashId, {
            method: "DELETE",
            mode: "cors",
            body: {
                'Content-type': 'application/json;'
            }
        }).then((res) => {
            return res.json();
        }).then(() => {
            success_popup.style.display = "block";
            s_close.onclick = function() {
                success_popup.style.display = "none";
                location.reload();
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}