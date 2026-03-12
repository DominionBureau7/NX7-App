// ===============================
// Selecting Elements
// ===============================
const formEl = document.getElementById('signupForm');
const nameEl = document.getElementById('fullName');
const phoneEl = document.getElementById('phone');
const emailEl = document.getElementById('email');

const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');
const emailError = document.getElementById('emailError');

const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');
const confirmpasswordError = document.getElementById('confirmpasswordError');

const togglePass = document.getElementById('togglePassword');
const toggleConfirmPass = document.getElementById('toggleConfirmPassword');

const termEl = document.getElementById('terms');
const avatar = document.getElementById('avatar');

const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// ===============================
// Form Submission
// ===============================
formEl.addEventListener('submit', e => {
    e.preventDefault();
    saveUser();
});

// ===============================
// Save User Function
// ===============================
function saveUser(){
    const n = nameEl.value.trim();
    const p = phoneEl.value.trim();
    const e = emailEl.value.trim();
    const pass = passwordEl.value.trim();
    const confirmPass = confirmPasswordEl.value.trim();

    // Reset error messages
    nameError.innerText = "";
    phoneError.innerText = "";
    emailError.innerText = "";
    passwordError.innerText = "";
    confirmpasswordError.innerText = "";

    // ------------------------------
    // Validation
    // ------------------------------
    if(!n || !p || !e || !pass || !confirmPass){
        nameError.innerText = !n ? "Name is required" : "";
        phoneError.innerText = !p ? "Phone is required" : "";
        emailError.innerText = !e ? "Email is required" : "";
        passwordError.innerText = !pass ? "Password is required" : "";
        confirmpasswordError.innerText = !confirmPass ? "Confirm your password" : "";
        alert("All fields are required");
        return;
    }

    if(!isNaN(n)){
        nameError.innerText = "Name should contain only letters.";
        alert("Name should contain only letters.");
        return;
    }

    if(isNaN(p) || p.length !== 10){
        phoneError.innerText = "Phone must be 10 digits.";
        alert("Phone must be 10 digits.");
        return;
    }

    if(!e.includes("@") || !e.includes(".com")){
        emailError.innerText = "Enter a valid email address.";
        alert("Enter a valid email address.");
        return;
    }

    if(pass.length < 8){
        passwordError.innerText = "Password must be at least 8 characters.";
        alert("Password must be at least 8 characters.");
        return;
    }

    if(pass !== confirmPass){
        confirmpasswordError.innerText = "Passwords do not match.";
        alert("Passwords do not match.");
        return;
    }

    if(!termEl.checked){
        alert("You must accept the Terms & Conditions!");
        return;
    }

    // ------------------------------
    // Save user data in localStorage
    // ------------------------------
    const userData = { Name: n, Phone: p, Email: e, Password: pass };
    localStorage.setItem("nx7User", JSON.stringify(userData));

    // Redirect to main chat page
    window.location.href = "../app/chat.html";
}

// ===============================
// Toggle Password Visibility
// ===============================
togglePass.addEventListener('click', () => {
    if(passwordEl.type === "password"){
        passwordEl.type = "text";
        togglePass.innerText = "Hide";
    } else {
        passwordEl.type = "password";
        togglePass.innerText = "Show";
    }
});

toggleConfirmPass.addEventListener('click', () => {
    if(confirmPasswordEl.type === "password"){
        confirmPasswordEl.type = "text";
        toggleConfirmPass.innerText = "Hide";
    } else {
        confirmPasswordEl.type = "password";
        toggleConfirmPass.innerText = "Show";
    }
});

// ===============================
// Password Strength Meter
// ===============================
passwordEl.addEventListener('input', () => {
    const value = passwordEl.value;
    let strength = 0;

    if(value.length >= 8) strength++;
    if(/[0-9]/.test(value)) strength++;
    if(/[A-Z]/.test(value)) strength++;
    if(/[!@#$%^&*]/.test(value)) strength++;

    strengthBar.style.width = "0%";

    if(value.length === 0){
        strengthText.innerText = "";
        strengthBar.style.backgroundColor = "lightgray";
        return;
    }

    if(strength <= 1){
        strengthBar.style.width = "33%";
        strengthBar.style.backgroundColor = "red";
        strengthText.innerText = "Weak";
    } else if(strength <= 3){
        strengthBar.style.width = "66%";
        strengthBar.style.backgroundColor = "orange";
        strengthText.innerText = "Moderate";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "green";
        strengthText.innerText = "Strong";
    }
});

// ===============================
// Avatar Initials from Name
// ===============================
nameEl.addEventListener("keyup", () => {
    const name = nameEl.value.trim();
    if(name === ""){
        avatar.innerText = "";
        return;
    }
    const words = name.split(" ");
    const first = words[0][0];
    const second = words.length > 1 ? words[1][0] : "";
    avatar.innerText = (first + second).toUpperCase();
});