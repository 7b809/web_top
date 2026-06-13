// =====================================================
// DEBUG LOGGER
// =====================================================

function addLog(type, message) {

    const logBox = document.getElementById("debugLog");

    if (!logBox) {
        console.log(`[${type}] ${message}`);
        return;
    }

    const time = new Date().toLocaleTimeString();

    logBox.textContent +=
        `[${time}] [${type}] ${message}\n`;

    logBox.scrollTop = logBox.scrollHeight;
}

function clearLogs() {

    const logBox = document.getElementById("debugLog");

    if (logBox) {
        logBox.textContent = "";
    }
}

// =====================================================
// CONSOLE OVERRIDE
// =====================================================

const originalLog = console.log;
console.log = (...args) => {

    addLog(
        "LOG",
        args.map(x => String(x)).join(" ")
    );

    originalLog(...args);
};

const originalError = console.error;
console.error = (...args) => {

    addLog(
        "ERROR",
        args.map(x => String(x)).join(" ")
    );

    originalError(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {

    addLog(
        "WARN",
        args.map(x => String(x)).join(" ")
    );

    originalWarn(...args);
};

// =====================================================
// GLOBAL ERROR HANDLING
// =====================================================

window.onerror = function (
    message,
    source,
    line,
    col,
    error
) {

    addLog(
        "JS ERROR",
        `${message}
File: ${source}
Line: ${line}
Column: ${col}`
    );

    return false;
};

window.addEventListener(
    "unhandledrejection",
    function (event) {

        addLog(
            "PROMISE ERROR",
            String(event.reason)
        );
    }
);

// =====================================================
// OTP FUNCTION
// =====================================================

async function startOTP() {

    addLog("SYSTEM", "Start OTP button clicked");

    addLog(
        "SYSTEM",
        "Secure Context: " + window.isSecureContext
    );

    addLog(
        "SYSTEM",
        "OTPCredential Type: " +
        typeof window.OTPCredential
    );

    if (!("OTPCredential" in window)) {

        addLog(
            "ERROR",
            "Web OTP API not supported in this browser"
        );

        alert(
            "Web OTP API not supported"
        );

        return;
    }

    try {

        addLog(
            "SYSTEM",
            "Waiting for incoming OTP..."
        );

        const ac = new AbortController();

        setTimeout(() => {

            ac.abort();

            addLog(
                "SYSTEM",
                "OTP request timeout after 60 seconds"
            );

        }, 60000);

        const content =
            await navigator.credentials.get({
                otp: {
                    transport: ["sms"]
                },
                signal: ac.signal
            });

        addLog(
            "SUCCESS",
            "OTP Received: " + content.code
        );

        document.title =
            "OTP Received";

        const response = await fetch(
            "/api/otp",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    otp: content.code,
                    source: "web_otp"
                })
            }
        );

        const result =
            await response.json();

        addLog(
            "SUCCESS",
            "OTP saved successfully"
        );

        console.log(result);

        loadTable();

    } catch (e) {

        console.error(
            "OTP Error:",
            e.message || e
        );

    }
}

// =====================================================
// TABLE LOADER
// =====================================================

async function loadTable() {

    try {

        addLog(
            "SYSTEM",
            "Loading OTP table..."
        );

        const response =
            await fetch("/api/otp");

        const data =
            await response.json();

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

        document.getElementById(
            "otpTable"
        ).innerHTML = html;

        addLog(
            "SYSTEM",
            `Loaded ${data.length} records`
        );

    } catch (e) {

        console.error(
            "Table Load Error:",
            e.message || e
        );
    }
}

// =====================================================
// STARTUP INFO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        addLog(
            "SYSTEM",
            "Page Loaded"
        );

        addLog(
            "SYSTEM",
            "User Agent: " +
            navigator.userAgent
        );

        addLog(
            "SYSTEM",
            "Secure Context: " +
            window.isSecureContext
        );

        addLog(
            "SYSTEM",
            "OTPCredential Available: " +
            ("OTPCredential" in window)
        );

        loadTable();

        setInterval(
            loadTable,
            5000
        );
    }
);