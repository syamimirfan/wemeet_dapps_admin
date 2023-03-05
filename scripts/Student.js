class Student {
    constructor(matricNumber, identificationNumber, studentName, studentTelephoneNumber, studentEmail, studentImage, studImageName, Faculty, Program) {
        this.matricNumber = matricNumber;
        this.identificationNumber = identificationNumber;
        this.studentName = studentName;
        this.studentTelephoneNumber = studentTelephoneNumber;
        this.studentEmail = studentEmail;
        this.studentImage = studentImage;
        this.studImageName = studImageName;
        this.Faculty = Faculty;
        this.Program = Program;
    }

    register() {
        if (this.matricNumber === "" || this.identificationNumber === "" || this.studentName === "" || this.studentTelephoneNumber === "" || this.studentEmail === "" || this.studentImage === "" || this.studImageName === "" || this.Faculty === "" || this.Program === "") {
            error_popup.style.display = "block";

        } else {
            fetch('http://localhost:5000/student/addstudent', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                body: JSON.stringify({
                    matricNo: this.matricNumber,
                    icNumber: this.identificationNumber,
                    studName: this.studentName,
                    studTelephoneNo: this.studentTelephoneNumber,
                    studEmail: this.studentEmail,
                    studImage: this.studentImage,
                    studImageFirebase: this.studImageName,
                    faculty: this.Faculty,
                    program: this.Program
                }),
            }).then(res => {
                return res.json();
            }).then(async(data) => {
                //CHECK DUPLICATE DATA
                if (data.success === true) {
                    success_popup.style.display = "block";
                    s_close.onclick = function() {
                        success_popup.style.display = "none";
                        location.reload();
                    }

                } else {
                    duplicate_popup.style.display = "block";
                    d_close.onclick = function() {
                        duplicate_popup.style.display = "none";
                        location.reload();
                    }
                    fetch('http://localhost:5000/student/getimage/' + this.matricNumber, {
                        headers: {
                            'Content-Type': 'application/json'
                        },

                    }).then((res) => {
                        return res.json()
                    }).then((data) => {
                        if (data.studImageFirebase === this.studImageName) {
                            fetch('http://localhost:5000/student/updateimage/' + this.matricNumber, {
                                method: "PATCH",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studImage: this.studentImage
                                })
                            }).then(res => {
                                return res.json();
                            }).then((data) => {
                                console.log(data);
                            }).catch(error => {
                                console.log(error);
                            });

                        } else {
                            let storageRef = firebase.storage().ref(this.studImageName);
                            storageRef.delete().then(() => {
                                console.log(this.studImageName + " Successfully deleted!");
                            }).catch((error) => {
                                console.log(error);
                            });
                        }
                    });

                }

            }).catch(error => {
                console.log(error);
            });
        }
    }
}