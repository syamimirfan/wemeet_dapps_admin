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
                if (res['success'] && localStorage.getItem("password") !== null) {
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

    }
}