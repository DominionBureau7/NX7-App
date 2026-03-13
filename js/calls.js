// =========================
// NX7 Calls Page JS
// =========================

// Render calls from localStorage
function renderCalls() {
    const callsList = document.getElementById("callsList");
    callsList.innerHTML = ""; // Clear previous list

    const calls = JSON.parse(localStorage.getItem("nx7Calls")) || [];

    // Show message if no calls exist
    if (calls.length === 0) {
        callsList.innerHTML = "<p style='color:gray; text-align:center;'>No calls yet</p>";
        return;
    }

    // Loop through calls and create DOM elements
    calls.forEach(call => {
        const callEl = document.createElement("div");
        callEl.classList.add("callItem");

        callEl.innerHTML = `
            <img src="${call.avatar}" class="callAvatar" width="50" height="50" style="border-radius:50%; object-fit:cover;">
            <div class="callDetails">
                <div class="callName">${call.name}</div>
                <div class="callInfo">${call.type} • ${call.time}</div>
            </div>
        `;

        callsList.appendChild(callEl);
    });
}

// Render calls when page loads
window.addEventListener("load", renderCalls);

/* Load saved NX7 theme */

const savedTheme = localStorage.getItem("nx7Theme");

if(savedTheme){
  document.body.classList.add(savedTheme);
}
// NX7 Go Back Button

const goBackBtn = document.getElementById("goBackBtn");

if(goBackBtn){
    goBackBtn.addEventListener("click", () => {

        // If user came from another page
        if(document.referrer){
            window.history.back();
        }
        else{
            // fallback
            window.location.href = "chat.html";
        }

    });
}