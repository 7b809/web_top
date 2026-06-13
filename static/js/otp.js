async function startOTP() {

    if (!("OTPCredential" in window)) {

        alert("Web OTP API not supported");
        return;
    }

    try {

        const content = await navigator.credentials.get({
            otp: {
                transport: ["sms"]
            }
        });

        document.title = "OTP Received";

        await fetch("/api/otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                otp: content.code
            })
        });

        loadTable();

    } catch (e) {

        console.log(e);

    }

}

async function loadTable() {

    const response = await fetch("/api/otp");

    const data = await response.json();

    let html = "";

    data.forEach(item => {

        html += `
        <tr>
            <td>${item.id}</td>
            <td>
                <span class="badge bg-success fs-6">
                    ${item.otp}
                </span>
            </td>
            <td>${item.source}</td>
            <td>${item.created_at}</td>
        </tr>
        `;
    });

    document.getElementById("otpTable").innerHTML = html;
}

loadTable();

setInterval(loadTable, 5000);