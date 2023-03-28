class Student {
    //the constructor
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

    //register student
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

    //get total student
    getTotalStudent() {
        fetch('http://localhost:5000/student/totalstudent')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let totalStudent = "";

                if (data.success && data.student.length > 0) {
                    totalStudent += `
                    <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div>
                            <h3 class="fs-2">${data.student[0]['COUNT(*)']}</h3>
                            <p class="fs-5">Students</p>
                        </div>
                        <i class="fas fa-user fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                    </div>
                   `;
                } else {
                    totalStudent += `
                    <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div>
                            <h3 class="fs-2">0</h3>
                            <p class="fs-5">Students</p>
                        </div>
                        <i class="fas fa-user fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                    </div>
                   `;
                }
                document.getElementById("totalstudent").innerHTML = totalStudent;
            }).catch((error) => {
                console.log(error);
            });
    }

    //get recent student
    getRecentStudents() {
        fetch('http://localhost:5000/student/recentstudent')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let recentStudent = "";

                if (data.success && data.student && data.student.length > 0) {
                    data.student.map((item) => {
                        recentStudent += `
                    <tr>
                            <td>${item['matricNo']}</td>
                            <td>${item['studName']}</td>
                            <td>${item['studEmail']}</td>
                            <td>${item['studTelephoneNo']}</td>
                            <td>${item['program']}</td>
                            <td>
                            <button class="fs-2 p-2 give-done" onclick="document.getElementById('id${item['matricNo']}').style.display='block'"> 
                             <i class="fas fa-trash"></i>
                            </button>
                            </td>
                    </tr>
                    <div id="id${item['matricNo']}" class="modal">
                        <div class="modal-content">
                            <div class="container">
                                <h1>Delete Student</h1>
                                <p class="fs-5 p-delete">Are you sure you want to delete ${item['studName']}'s account?</p>
                
                                <div class="clearfix">
                                    <button type="button" onclick="document.getElementById('id${item['matricNo']}').style.display='none'" class="cancelbtn">Cancel</button>
                                    <button type="button" onclick="new Student().deleteStudent('${item['matricNo']}','${item['studImageFirebase']}'), document.getElementById('id${item['matricNo']}').style.display='none'" class="deletebtn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>  
                    `;
                    });
                } else {
                    recentStudent += `
              <tr>
              <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
                    <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
                    <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
                    <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
                    <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
                    <td class="stud-unavailable">NO STUDENT AVAILABLE</td>
              </tr>

                    `;
                }
                document.getElementById("recentstudent").innerHTML = recentStudent;
            }).catch((err) => {
                console.log(err);
            });
    }

    //delete student account
    deleteStudent(matricNo, studImageName) {

        let storageRef = firebase.storage().ref(studImageName);
        storageRef.delete().then(() => {
            console.log(studImageName + " Successfully deleted!");
        }).catch((error) => {
            console.log(error);
        });

        fetch('http://localhost:5000/student/deletestudent/' + matricNo, {
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
        })
    }
}