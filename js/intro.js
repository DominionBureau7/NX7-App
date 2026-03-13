// ===============================
// Element Selection
// ===============================
const loadingMessage = document.querySelector(".loadingMessage");
const percentText = document.querySelector(".loadingPercent");
const progressBar = document.querySelector(".progressBar");
const container = document.querySelector(".introContainer");

// Sound element (optional autoplay)
const introSound = document.getElementById("introSound");
const soundAllowed = sessionStorage.getItem("nx7SoundAllowed");

// Play sound if previously allowed by user
if(introSound && soundAllowed === "true"){
    introSound.currentTime = 0; 
    introSound.volume = 1;      
    introSound.play().catch(()=>{}); // avoid errors if autoplay blocked
}

// ===============================
// Preload Next Pages for faster navigation
// ===============================
function preloadPage(url){
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
}

preloadPage("signup.html");
preloadPage("chat.html");

// ===============================
// Autoplay workaround (some browsers block audio autoplay)
// ===============================
function playIntroSound(){
    if(introSound){
        introSound.muted = true; // temporarily mute
        introSound.play().then(()=>{
            introSound.muted = false; // unmute after play
        }).catch(()=>{});
    }
    // Remove event listeners after first interaction
    document.removeEventListener("click", playIntroSound);
    document.removeEventListener("keydown", playIntroSound);
}

document.addEventListener("click", playIntroSound);
document.addEventListener("keydown", playIntroSound);

// ===============================
// Loading Messages System
// ===============================
function changeMessage(text){
    if(!loadingMessage) return;
    loadingMessage.style.opacity = "0";
    setTimeout(()=>{
        loadingMessage.textContent = text;
        loadingMessage.style.opacity = "1";
    }, 300);
}

// Timeline for loading messages
setTimeout(()=>changeMessage("Initializing NX7"), 200);
setTimeout(()=>changeMessage("Loading conversations"), 1800);
setTimeout(()=>changeMessage("Securing connection"), 3500);
setTimeout(()=>changeMessage("Preparing interface"), 5200);
setTimeout(()=>changeMessage("Launching NX7..."), 7000);

// ===============================
// Percentage Counter (for progress display)
// ===============================
let percent = 0;
const percentInterval = setInterval(()=>{
    percent += Math.floor(Math.random() * 12) + 5; // increase randomly 5-16%
    if(percent >= 100) percent = 100;

    // Update percentage display if element exists
    if(percentText){
        percentText.textContent = percent + "%";
    }

    // When 100%, clear interval and show READY
    if(percent === 100){
        clearInterval(percentInterval);
        showReady();
    }
}, 700);

// ===============================
// READY state display
// ===============================
function showReady(){
    if(loadingMessage){
        loadingMessage.textContent = "READY";
        loadingMessage.style.fontWeight = "bold";
        loadingMessage.style.fontSize = "20px";
    }
}

// ===============================
// Redirect Logic after intro
// ===============================
function redirectUser(){
    // Clear user data every page load
    localStorage.removeItem("nx7User");
    const user = localStorage.getItem("nx7User");

    // fade out intro container
    if(container){
        container.style.opacity = "0";
        container.style.transform = "translateY(20px)";
    }

    setTimeout(()=>{
        if(user){
            window.location.href = "../app/chat.html"; // existing user
        }else{
            window.location.href = "signup.html";      // new user
        }
    }, 600);
}

// Main redirect after ~8 seconds
setTimeout(redirectUser, 8000);

// Safety fallback after 8.5 seconds
setTimeout(redirectUser, 8500);

