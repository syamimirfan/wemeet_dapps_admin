class Lecturer {
    //the constructor 
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

    //register lecturer
    register() {
        if (this.staffNumber === "" || this.lecturerName === "" || this.identificationNumber === "" || this.lecturerTelephoneNumber === "" || this.lecturerEmail === "" || this.lecturerImage === "" || this.lecturerImageName === "" || this.faculty === "" || this.department === "" || this.createdLecturerImage === "") {
            error_popup.style.display = "block";
        } else {
            fetch(new Utils().baseURL + '/lecturer/addlecturer', {
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
                    fetch(new Utils().baseURL + '/lecturer/getimage/' + this.staffNumber, {
                        headers: {
                            'Content-Type': 'application/json'
                        },

                    }).then((res) => {
                        return res.json()
                    }).then((data) => {
                        if (data.lecturerImageFirebase === this.lecturerImageName) {
                            fetch(new Utils().baseURL + '/lecturer/updateimage/' + this.staffNumber, {
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

    //get total lecturer
    getTotalLecturer() {
        fetch(new Utils().baseURL + '/lecturer/totallecturer')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let totalLecturer = "";

                if (data.success && data.lecturer.length > 0) {
                    totalLecturer += `
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                    <div>
                        <h3 class="fs-2">${data.lecturer[0]['COUNT(*)']}</h3>
                        <p class="fs-5">Lecturers</p>
                    </div>
                    <i class="fas fa-user-tie fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                </div>
               `;
                } else {
                    totalLecturer += `
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                    <div>
                        <h3 class="fs-2">0</h3>
                        <p class="fs-5">Lecturers</p>
                    </div>
                    <i class="fas fa-user-tie fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                </div>
               `;
                }
                document.getElementById("totallecturer").innerHTML = totalLecturer;
            }).catch((error) => {
                console.log(error);
            });
    }

    //get recent lecturer
    getRecentLecturers() {
        fetch(new Utils().baseURL + '/lecturer/recentlecturer')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let recentLecturer = "";

                if (data.success && data.lecturer && data.lecturer.length > 0) {
                    data.lecturer.map((item) => {
                        recentLecturer += `
                    <tr>
                        <td>${item['staffNo']}</td>
                        <td>${item['lecturerName']}</td>
                        <td>${item['lecturerEmail']}</td>
                        <td>${item['lecturerTelephoneNo']}</td>
                        <td>${item['faculty']}</td>
                        <td>
                        <button class="fs-2 p-2 give-done" onclick="document.getElementById('id${item['staffNo']}').style.display='block'"> 
                        <i class="fas fa-trash"></i>
                       </button>
                        </td>
                    </tr>
                    <div id="id${item['staffNo']}" class="modal">
                    <div class="modal-content">
                        <div class="container">
                            <h1>Delete Lecturer</h1>
                            <p class="fs-5 p-delete">Are you sure you want to delete ${item['lecturerName']}'s account?</p>
            
                            <div class="clearfix">
                                <button type="button" onclick="document.getElementById('id${item['staffNo']}').style.display='none'" class="cancelbtn">Cancel</button>
                                <button type="button" onclick="new Lecturer().deleteLecturer('${item['staffNo']}','${item['lecturerImageFirebase']}'), document.getElementById('id${item['staffNo']}').style.display='none'" class="deletebtn">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>  
                    `;
                    });
                } else {
                    recentLecturer += `
                    <tr>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                          <td class="lect-unavailable">NO LECTURER AVAILABLE</td>
                    </tr>
                    `;
                }

                document.getElementById("recentlecturer").innerHTML = recentLecturer;
            }).catch((err) => {
                console.log(err);
            })
    }

    //delete lecturer account
    deleteLecturer(staffNo, lecturerImageName) {

        let storageRef = firebase.storage().ref(lecturerImageName);
        storageRef.delete().then(() => {
            console.log(lecturerImageName + " Successfully deleted!");
        }).catch((error) => {
            console.log(error);
        });

        fetch(new Utils().baseURL + '/lecturer/deletelecturer/' + staffNo, {
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