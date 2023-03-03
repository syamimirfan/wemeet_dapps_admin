class Lecturer {
    constructor(staffNumber, lecturerName, identificationNumber, lecturerTelephoneNumber, lecturerEmail, lecturerImage, faculty, department, createdLecturerImage) {
        this.staffNumber = staffNumber;
        this.lecturerName = lecturerName;
        this.identificationNumber = identificationNumber;
        this.lecturerTelephoneNumber = lecturerTelephoneNumber;
        this.lecturerEmail = lecturerEmail;
        this.lecturerImage = lecturerImage;
        this.faculty = faculty;
        this.department = department;
        this.createdLecturerImage = createdLecturerImage;
    }

    register() {
        if (this.staffNumber === "" || this.lecturerName === "" || this.identificationNumber === "" || this.lecturerTelephoneNumber === "" || this.lecturerEmail === "" || this.lecturerImage === "" || this.faculty === "" || this.department === "" || this.createdLecturerImage === "") {
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
                        //if data is duplicated
                        //then we need to delete the current/duplicate data image in the pocketbase
                    await pb.collection('lecturerImage').delete(
                        this.createdLecturerImage.id, {
                            'image': null
                        }
                    );
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
}