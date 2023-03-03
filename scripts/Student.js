class Student {
    constructor(matricNumber, identificationNumber, studentName, studentTelephoneNumber, studentEmail, studentImage, Faculty, Program, createdStudImage) {
        this.matricNumber = matricNumber;
        this.identificationNumber = identificationNumber;
        this.studentName = studentName;
        this.studentTelephoneNumber = studentTelephoneNumber;
        this.studentEmail = studentEmail;
        this.studentImage = studentImage;
        this.Faculty = Faculty;
        this.Program = Program;
        this.createdStudImage = createdStudImage;
    }



    register() {

        if (this.matricNumber === "" || this.identificationNumber === "" || this.studentName === "" || this.studentTelephoneNumber === "" || this.studentEmail === "" || this.studentImage === "" || this.Faculty === "" || this.Program === "" || this.createdStudImage === "") {
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
                        //if data is duplicated
                        //then we need to delete the current/duplicate data image in the pocketbase
                    await pb.collection('studImage').delete(
                        this.createdStudImage.id, {
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