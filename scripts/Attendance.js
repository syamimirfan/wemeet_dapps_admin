class Attendance {
    //get attendance for student that attend 
    getAttendAttendance() {
        fetch(new Utils().baseURL + '/attendance/givetoken')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let attendAttendance = "";

                if (data.success && data.attendance && data.attendance.length > 0) {
                    attendAttendance += `
                    <table class="table bg-white rounded shadow-sm">
                    <thead>
                        <tr>
                            <th scope="col ">Matric Number</th>
                            <th scope="col ">Name</th>
                            <th scope="col ">Email</th>
                            <th scope="col ">Telephone Number</th>
                            <th scope="col ">Token Address</th>
                            <th scope="col ">Action</th>
                        </tr>
                    </thead>   
                    <tbody> 
                    `;
                    data.attendance.map((item) => {
                        if (item["statusReward"] === "Not Send") {
                            attendAttendance += `
                            <tr>
                            <td>${item['matricNo']}</td>
                            <td>${item['studName']}</td>
                            <td>${item['studEmail']}</td>
                            <td>${item['studTelephoneNo']}</td>
                            <td>${item['tokenAddress']}</td>
                            <td>
                                <a href="givetokenstudent.html?tokenAddress=${item['tokenAddress']}&matricNo=${item['matricNo']}&attendanceId=${item['attendanceId']}" class="fs-2 give-token" ><i
                             class="fas fa-hand-holding-usd me-2"></i></a>
                            </td>
                             </tr>
                            `;
                        } else if (item['statusReward'] === "Send") {
                            attendAttendance += `
                            <tr>
                            <td>${item['matricNo']}</td>
                            <td>${item['studName']}</td>
                            <td>${item['studEmail']}</td>
                            <td>${item['studTelephoneNo']}</td>
                            <td>${item['tokenAddress']}</td>
                            <td>
                                <p class="token-sent">Token Sent!</p>
                            </td>
                             </tr>
                   
                            `;
                        }
                    });
                    attendAttendance += `
                    </tbody>
                    </table>
                    `;
                } else {
                    attendAttendance += `
                    <div class="no-data-attendance rounded">
                       <h1 class="attendance-unavailable"> NO ATTENDANCE AVAILABLE</h1>
                    </div>
                    `;
                }
                document.getElementById("attendance").innerHTML = attendAttendance;
            }).catch((err) => {
                console.log(err);
            })
    }
}