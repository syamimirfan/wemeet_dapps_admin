class Admin {
    constructor(password) {
        this.password = password;
    }

    login() {
        if (this.password === "") {
            modal.classList.add('active')
        } else {

            fetch('http://localhost:5000/admin/login', {
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
                    localStorage.setItem("password", this.password);
                } else {
                    modalWrong.classList.add('active')
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    logout() {
        localStorage.removeItem("password");
        // push a new state to the browser history
        history.pushState(null, null, location.href);

        // add an event listener to the window object to prevent going back to the previous page
        window.onpopstate = function() {
            history.go(1);
        };
        location.href = "../index.html";
    }
}