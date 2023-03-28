class Attendance {
    //get attendance for student that attend 
    getAttendAttendance() {
        fetch('http://localhost:5000/attendance/givetoken')
            .then((res) => {
                return res.json();
            }).then((data) => {
                let attendAttendance = "";

                if (data.success && data.attendance && data.attendance.length > 0) {
                    data.attendance.map((item) => {
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
                    });
                } else {
                    attendAttendance += `
                    <tr>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    <td class="attendance-unavailable">NO ATTENDANCE</td>
                    </tr>
                    `;
                }
                document.getElementById("attendance").innerHTML = attendAttendance;
            }).catch((err) => {
                console.log(err);
            })
    }
}