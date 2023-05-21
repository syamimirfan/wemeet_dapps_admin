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
            fetch(new Utils().baseURL + '/student/addstudent', {
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
                    fetch(new Utils().baseURL + '/student/getimage/' + this.matricNumber, {
                        headers: {
                            'Content-Type': 'application/json'
                        },

                    }).then((res) => {
                        return res.json()
                    }).then((data) => {
                        if (data.studImageFirebase === this.studImageName) {
                            fetch(new Utils().baseURL + '/student/updateimage/' + this.matricNumber, {
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
        fetch(new Utils().baseURL + '/student/totalstudent')
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
        fetch(new Utils().baseURL + '/student/recentstudent')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let recentStudent = "";

                if (data.success && data.student && data.student.length > 0) {
                    recentStudent += `
                     <table class="table bg-white rounded shadow-sm">
                     <thead>
                         <tr>
                         <th scope="col ">Student Picture</th>
                         <th scope="col ">Matric Number</th>
                         <th scope="col ">Name</th>
                         <th scope="col ">Email</th>
                         <th scope="col ">Telephone Number</th>
                         <th scope="col ">Program</th>
                         <th scope="col ">Created Date</th>
                         <th scope="col ">Action</th>
                         </tr>
                     </thead>
                     <tbody>  
                     `;
                    data.student.map((item) => {
                                  // Parse the input string as a Date object
                const dateObject = new Date(item['createdDate']);

                // Extract the desired date and time components from the Date object
                const year = dateObject.getFullYear();
                const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
                const day = dateObject.getDate().toString().padStart(2, "0");
                const hours = dateObject.getHours().toString().padStart(2, "0");
                const minutes = dateObject.getMinutes().toString().padStart(2, "0");
                const seconds = dateObject.getSeconds().toString().padStart(2, "0");

                // Create the formatted date and time string
                const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                        recentStudent += `        
                    <tr>
                            <td><img class="picture" src="${item['studImage']}" alt=""></td>
                            <td>${item['matricNo']}</td>
                            <td>${item['studName']}</td>
                            <td>${item['studEmail']}</td>
                            <td>${item['studTelephoneNo']}</td>
                            <td>${item['program']}</td>
                            <td>${formattedDateString}</td>
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
                    recentStudent += `
                    </tbody>
                    </table>
                    `;
                } else {
                    recentStudent += `
                        <div class="no-data-student rounded">
                            <h1 class="stud-unavailable"> NO STUDENTS AVAILABLE </h1>
                        </dv>
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

        fetch(new Utils().baseURL + '/student/deletestudent/' + matricNo, {
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

    getDashboardStudent() {
        fetch(new Utils().baseURL + '/student/dashboardstudent')
        .then((res) => {
            return res.json();
        }).then((data) => {
            let dashboardStudent = "";

            if(data.success && data.student && data.student.length > 0) {
             
             dashboardStudent += `
             <table class="table bg-white rounded shadow-sm">
             <thead>
                 <tr>
                     <th scope="col ">Student Picture</th>
                     <th scope="col ">Matric Number</th>
                     <th scope="col ">Name</th>
                     <th scope="col ">Email</th>
                     <th scope="col ">Telephone Number</th>
                     <th scope="col ">Program</th>
                     <th scope="col ">Created Date</th>
                 </tr>
             </thead>
             <tbody >
             `;

             data.student.map((item) => {
                // Parse the input string as a Date object
                const dateObject = new Date(item['createdDate']);

                // Extract the desired date and time components from the Date object
                const year = dateObject.getFullYear();
                const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
                const day = dateObject.getDate().toString().padStart(2, "0");
                const hours = dateObject.getHours().toString().padStart(2, "0");
                const minutes = dateObject.getMinutes().toString().padStart(2, "0");
                const seconds = dateObject.getSeconds().toString().padStart(2, "0");

                // Create the formatted date and time string
                const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                dashboardStudent += `
                <tr>
                <td><img class="picture" src="${item['studImage']}" alt=""></td>
                <td>${item['matricNo']}</td>
                <td>${item['studName']}</td>
                <td>${item['studEmail']}</td>
                <td>${item['studTelephoneNo']}</td>
                <td>${item['program']}</td>
                <td>${formattedDateString}</td>
                </tr>
                `;
             });
              dashboardStudent += `
                 </tbody>
              </table>
              `;
            }else {
                dashboardStudent += `
                <div class="no-data-dashboard rounded">
                    <h1 class="dashboard-unavailable"> NO STUDENTS AVAILABLE </h1>
                </dv>
            `;
            }
            document.getElementById("dashboardstudent").innerHTML = dashboardStudent;
        }).catch((err) => {
            console.log(err);
        })
    }
}