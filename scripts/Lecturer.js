class Lecturer {
    constructor(staffNumber, lecturerName, identificationNumber, lecturerTelephoneNumber, lecturerEmail, lecturerImage, lecturerImageName, faculty, department, createdLecturerImage) {
        this.staffNumber = staffNumber;
        this.lecturerName = lecturerName;
        this.identificationNumber = identificationNumber;
        this.lecturerTelephoneNumber = lecturerTelephoneNumber;
        this.lecturerEmail = lecturerEmail;
        this.lecturerImage = lecturerImage;
        this.lecturerImageName = lecturerImageName;
        this.faculty = faculty;
        this.department = department;
        this.createdLecturerImage = createdLecturerImage;
    }

    register() {
        if (this.staffNumber === "" || this.lecturerName === "" || this.identificationNumber === "" || this.lecturerTelephoneNumber === "" || this.lecturerEmail === "" || this.lecturerImage === "" || this.lecturerImageName === "" || this.faculty === "" || this.department === "" || this.createdLecturerImage === "") {
            error_popup.style.display = "block";
        } else {
            fetch('http://localhost:5000/lecturer/addlecturer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                body: JSON.stringify({
                    staffNo: this.staffNumber,
                    lecturerName: this.lecturerName,
                    icNumber: this.identificationNumber,
                    lecturerTelephoneNo: this.lecturerTelephoneNumber,
                    lecturerEmail: this.lecturerEmail,
                    lecturerImage: this.lecturerImage,
                    lecturerImageFirebase: this.lecturerImageName,
                    faculty: this.faculty,
                    department: this.department
                }),
            }).then(res => {
                return res.json();
            }).then(async(data) => {
                console.log(data);
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
                    fetch('http://localhost:5000/lecturer/getimage/' + this.staffNumber, {
                        headers: {
                            'Content-Type': 'application/json'
                        },

                    }).then((res) => {
                        return res.json()
                    }).then((data) => {
                        if (data.lecturerImageFirebase === this.lecturerImageName) {
                            fetch('http://localhost:5000/lecturer/updateimage/' + this.staffNumber, {
                                method: "PATCH",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    lecturerImage: this.lecturerImage
                                })
                            }).then(res => {
                                return res.json();
                            }).then((data) => {
                                console.log(data);
                            }).catch(error => {
                                console.log(error);
                            });

                        } else {
                            let storageRef = firebase.storage().ref(this.lecturerImageName);
                            storageRef.delete().then(() => {
                                console.log(this.lecturerImageName + " Successfully deleted!");
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