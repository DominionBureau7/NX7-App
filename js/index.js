// ===============================
// Select the "Tap to Open NX7" button
// ===============================
const openButton = document.getElementById("openNX7");

if(openButton){
    openButton.addEventListener("click", () => {

        // Disable button to prevent multiple clicks
        openButton.disabled = true;
        openButton.textContent = "Opening NX7...";

        // Allow intro sound on next page
        sessionStorage.setItem("nx7SoundAllowed","true");

        // Redirect to intro page after 0.6 seconds
        setTimeout(() => {
            window.location.href = "pages/onboarding/intro.html";
        }, 600);
    });
}
