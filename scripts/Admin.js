class Admin {

    //the constructor
    constructor(password) {
        this.password = password;
    }

    //admin login
    login() {
        if (this.password === "") {
            modal.classList.add('active')
        } else {

            fetch(new Utils().baseURL + '/admin/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: "cors",
                body: JSON.stringify({
                    password: this.password,
                })
            }).then(res => {
                return res.json();
            }).then((res) => {
                if (res['success']) {
                    location.href = "../dashboard.html";
                    sessionStorage.setItem("password", this.password);
                    sessionStorage.setItem('logoutFlag', 'false');
                    var currentTimestamp = new Date().getTime();
                    var expirationTimestamp = currentTimestamp + (5 * 1000); // 7 days
                  
                    sessionStorage.setItem("loginTimestamp", expirationTimestamp);
                } else {
                    modalWrong.classList.add('active')
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    //admin logout
    logout() {
        sessionStorage.removeItem("password");
        // Set the logout flag
        sessionStorage.setItem("logoutFlag", 'true');
        sessionStorage.removeItem("loginTimestamp");
        location.href = "../index.html";
    }

    //delete all slot when semester begins
    deleteSlot() {
        fetch(new Utils().baseURL + '/slot/deleteslot', {
            method: "DELETE",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json;'
            }
        }).then((res) => {
            return res.json();                                         
        }).then((data) => {
            if (data.success && data.message === "All Slot Delete") {
                success_popup.style.display = "block";
                s_close.onclick = function() {
                    success_popup.style.display = "none";
                    location.reload();
                }
            } else {
                error_popup.style.display = "block";
                e_close.onclick = function() {
                    error_popup.style.display = "none";
                    location.reload();
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

