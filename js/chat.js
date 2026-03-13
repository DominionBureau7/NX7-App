// ======================== NX7 Chat JS ========================

// ---------- Select DOM elements ----------
const users = document.querySelectorAll('.chatUser');
const welcome = document.getElementById('welcome');
const chatArea = document.getElementById('chatArea');

const chatName = document.getElementById('chatName');
const chatAvatar = document.getElementById('chatAvatar');

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatSearch = document.getElementById('chatSearch');
const clearBtn = document.getElementById('clearChat');

const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');

const profilePic = document.getElementById('myProfilePic');
profilePic.src = localStorage.getItem('profilePic') || 'default.png';

// Chat menu & modals
const menuBtn = document.getElementById('menuBtn');
const chatMenu = document.getElementById('chatMenu');
const viewProfileBtn = document.getElementById('viewProfile');
const muteChatBtn = document.getElementById('muteChat');
const deleteChatBtn = document.getElementById('deleteChat');

const profileModal = document.getElementById('profileModal');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const closeProfile = document.getElementById('closeProfile');

const callBtn = document.getElementById("callBtn");
const videoBtn = document.getElementById("videoBtn");
const callModal = document.getElementById("callModal");
const callAvatar = document.getElementById("callAvatar");
const callName = document.getElementById("callName");
const callType = document.getElementById("callType");
const endCall = document.getElementById("endCall");
const localVideo = document.getElementById("localVideo");
let cameraStream = null;

const mediaBtn = document.getElementById("mediaBtn");
const mediaInput = document.getElementById("mediaInput");
const mediaPreview = document.getElementById("mediaPreview");
const previewImage = document.getElementById("previewImage");
const previewVideo = document.getElementById("previewVideo");
const sendMedia = document.getElementById("sendMedia");
const cancelMedia = document.getElementById("cancelMedia");
let selectedFile = null;

// Sidebar profile pic
// ====== Load user profile from localStorage ======
const savedProfilePic = localStorage.getItem('profilePic') || '../../images/default.png';
const savedProfileName = localStorage.getItem('profileName') || 'Nadir Khan'; // default name
const myProfilePicSidebar = document.getElementById("myProfilePicSidebar");

// Update main header profile pic
if(profilePic) profilePic.src = savedProfilePic;

// Update sidebar profile pic
if(myProfilePicSidebar) myProfilePicSidebar.src = savedProfilePic;

// Update chat header avatar
if(chatAvatar) {
    chatAvatar.innerHTML = `<img src="${savedProfilePic}" width="40" height="40" style="border-radius:50%;object-fit:cover;">`;
}

// Update profile modal
if(profileAvatar) profileAvatar.src = savedProfilePic;
if(profileName) profileName.textContent = savedProfileName;



// Sidebar navigation
const sidebarLinks = document.querySelectorAll(".navIcons a, .bottomIcons a");
const pages = document.querySelectorAll('.page');

// Chat history storage
const chatHistory = JSON.parse(localStorage.getItem("nx7Chats")) || {};
let currentUser = "";
let isMuted = false;

// ---------------- Helper Functions ----------------

// Get current HH:MM time
function getTime() {
    const now = new Date();
    return now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');
}

// Update sidebar last message preview and time
function updateSidebar(messageText) {
    const activeUser = document.querySelector(".chatUser.active");
    if (!activeUser) return;
    const lastMsg = activeUser.querySelector(".lastMsg");
    const sideTime = activeUser.querySelector(".sideTime");
    lastMsg.innerHTML = messageText;
    sideTime.innerText = getTime();
}

// Move active chat to top
function moveChatToTop() {
    const activeChat = document.querySelector(".chatUser.active");
    if (!activeChat) return;
    activeChat.parentElement.prepend(activeChat);
}

// Load messages for user
function loadMessages(user) {
    messages.innerHTML = "";
    if (!chatHistory[user]) return;

    chatHistory[user].forEach(msg => {
        const messageEl = document.createElement("div");
        messageEl.classList.add("message", msg.type);

        if (msg.text.includes("http")) {
            // Image or video message
            messageEl.innerHTML =
                (msg.text.endsWith(".mp4") ?
                    `<video src='${msg.text}' controls style='max-width:200px;border-radius:10px;'></video>` :
                    `<img src='${msg.text}' style='max-width:200px;border-radius:10px;'>`
                ) + `<div class='timeStamp'>${msg.time}</div>`;
        } else {
            messageEl.innerHTML = msg.text + `<div class='timeStamp'>${msg.time}</div>`;
        }

        messages.appendChild(messageEl);
    });

    messages.scrollTop = messages.scrollHeight;
}

// Send message
function sendMessage() {
    if (!currentUser) return;
    const text = messageInput.value.trim();
    if (text === "") return;

    if (!chatHistory[currentUser]) chatHistory[currentUser] = [];

    // Create new message element
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "sent");
    newMessage.innerHTML = text + `<div class='timeStamp'>${getTime()} <span class='msgStatus'>✓</span></div>`;
    messages.appendChild(newMessage);

    // Update message status
    const status = newMessage.querySelector(".msgStatus");
    setTimeout(() => status.innerText = "✓✓", 1000);
    setTimeout(() => status.classList.add("read"), 3000);

    // Save to localStorage
    chatHistory[currentUser].push({ type: "sent", text: text, time: getTime() });
    localStorage.setItem("nx7Chats", JSON.stringify(chatHistory));

    updateSidebar(text);
    moveChatToTop();

    messageInput.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Typing indicator
    const typing = document.createElement("div");
    typing.classList.add("message", "received", "typing");
    typing.innerText = "NX7 typing........";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        typing.remove();
        botReply();
    }, 1500);
}

// Bot replies (simulate external APIs)
async function botReply() {
    if (!currentUser) return;

    let replyText = "";

    try {
        switch (currentUser) {
            case "Philosopher":
                const data1 = await (await fetch("https://dummyjson.com/quotes/random")).json();
                replyText = data1.quote + " - " + data1.author;
                break;
            case "Joker":
                const data2 = await (await fetch("https://official-joke-api.appspot.com/random_joke")).json();
                replyText = data2.setup + " " + data2.punchline;
                break;
            case "Dog Lover":
                const data3 = await (await fetch("https://dog.ceo/api/breeds/image/random")).json();
                replyText = data3.message;
                break;
            case "Advisor":
                const data4 = await (await fetch("https://api.adviceslip.com/advice")).json();
                replyText = data4.slip.advice;
                break;
            case "Cat":
                const data5 = await (await fetch("https://api.thecatapi.com/v1/images/search")).json();
                replyText = data5[0].url;
                break;
            case "Crypto":
                const data6 = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")).json();
                replyText = "Bitcoin price: $" + data6.bitcoin.usd;
                break;
            default:
                replyText = "NX7 bot 🤖";
        }
    } catch (err) {
        replyText = "NX7 bot error 🤖";
    }

    // Update sidebar preview
    updateSidebar(replyText.includes("http") ? (replyText.endsWith(".mp4") ? "🎥 Video" : "📷 Photo") : replyText);
    moveChatToTop();

    const reply = document.createElement("div");
    reply.classList.add("message", "received");

    if (replyText.includes("http")) {
        if (replyText.endsWith(".mp4")) {
            reply.innerHTML = `<video src='${replyText}' controls style='max-width:200px;border-radius:10px;'></video><div class='timeStamp'>${getTime()} <span class='msgStatus read'>✓✓</span></div>`;
        } else {
            reply.innerHTML = `<img src='${replyText}' style='max-width:200px;border-radius:10px;'><div class='timeStamp'>${getTime()} <span class='msgStatus read'>✓✓</span></div>`;
        }
    } else {
        reply.innerHTML = replyText + `<div class='timeStamp'>${getTime()} <span class='msgStatus read'>✓✓</span></div>`;
    }

    messages.appendChild(reply);
    chatHistory[currentUser].push({ type: "received", text: replyText, time: getTime() });
    localStorage.setItem("nx7Chats", JSON.stringify(chatHistory));
    messages.scrollTop = messages.scrollHeight;
}

// ---------------- Event Listeners ----------------

// Open chat user
users.forEach(user => {
    user.addEventListener("click", () => {
        document.getElementById("gameLaunchArea").style.display = "none";
        users.forEach(u => u.classList.remove("active"));
        user.classList.add("active");

        currentUser = user.querySelector(".name")?.innerText || "User";
        const avatar = user.querySelector(".avatar")?.src || "default.png";

        chatName.innerText = currentUser;
        chatAvatar.innerHTML = `<img src="${avatar}" width="40" height="40" style="border-radius:50%">`;
        chatAvatar.alt = currentUser + "'s avatar";

        welcome.style.display = "none";
        chatArea.style.display = "flex";

        loadMessages(currentUser);
    });
});

// Send message on click or Enter
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

// Chat search
chatSearch.addEventListener("input", () => {
    const searchText = chatSearch.value.toLowerCase();
    users.forEach(user => {
        const name = user.querySelector(".name")?.innerText.toLowerCase() || "";
        user.style.display = name.includes(searchText) ? "flex" : "none";
    });
});

// Clear chat
clearBtn.addEventListener("click", () => {
    if (!currentUser) return;
    chatHistory[currentUser] = [];
    localStorage.setItem("nx7Chats", JSON.stringify(chatHistory));
    messages.innerHTML = "";
    const activeUser = document.querySelector(".chatUser.active");
    if (activeUser) {
        activeUser.querySelector(".lastMsg").innerText = "";
        activeUser.querySelector(".sideTime").innerText = "";
    }
    if(messages.children.length === 0){
    document.getElementById("gameLaunchArea").style.display = "flex";
}
});

// Toggle emoji panel
emojiBtn.addEventListener('click', () => emojiPanel.classList.toggle('hidden'));
document.addEventListener('click', e => {
    if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) emojiPanel.classList.add('hidden');
});

// Load emojis dynamically
const emojiList = ["😀","😂","😎","😍","😅","🤣","😊","😇","😏","😌","🥳","🤩","😺","😸","😹","😻","🙃","😉"];
emojiList.forEach(e => {
    const span = document.createElement('span');
    span.innerText = e;
    span.addEventListener('click', () => {
        messageInput.value += e;
        messageInput.focus();
    });
    emojiPanel.appendChild(span);
});

// Chat menu
menuBtn?.addEventListener("click", () => chatMenu?.classList.toggle("hidden"));
viewProfileBtn?.addEventListener("click", () => {
    const activeUser = document.querySelector(".chatUser.active");
    if (!activeUser) return;
    profileAvatar.src = activeUser.querySelector("img")?.src || "default.png";
    profileName.innerText = chatName.innerText;
    profileModal?.classList.remove("hidden");
    chatMenu?.classList.add("hidden");
});
closeProfile?.addEventListener("click", () => profileModal?.classList.add("hidden"));

muteChatBtn?.addEventListener("click", () => {
    isMuted = !isMuted;
    alert(isMuted ? "🔕 Chat muted" : "🔔 Chat unmuted");
    chatMenu?.classList.add("hidden");
});

deleteChatBtn?.addEventListener("click", () => {
    messages.innerHTML = "";
    chatMenu?.classList.add("hidden");
});

// Calls & video
function openCall(type) {
    const activeUser = document.querySelector(".chatUser.active");
    if (!activeUser) { alert("Select a chat first"); return; }

    callAvatar.src = activeUser.querySelector("img")?.src || "default.png";
    callName.innerText = activeUser.querySelector(".name")?.innerText || "User";
    callType.innerText = type;
    callModal.classList.remove("hidden");

    let calls = JSON.parse(localStorage.getItem("nx7Calls")) || [];
    calls.unshift({ name: callName.innerText, avatar: callAvatar.src, type, time: getTime() });
    localStorage.setItem("nx7Calls", JSON.stringify(calls));
}

callBtn?.addEventListener("click", () => openCall("📞 Calling..."));
videoBtn?.addEventListener("click", async () => {
    openCall("📹 Starting Video Call...");
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = cameraStream;
        localVideo.classList.remove("hidden");
        callType.innerText = "📹 Video Call Active";
    } catch (err) {
        alert("Camera access denied or not available");
    }
});
endCall?.addEventListener("click", () => {
    callModal.classList.add("hidden");
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    localVideo.classList.add("hidden");
});

// Media handling
mediaBtn?.addEventListener("click", () => mediaInput.click());

mediaInput?.addEventListener("change", () => {
    selectedFile = mediaInput.files[0];
    if (!selectedFile) return;
    const fileURL = URL.createObjectURL(selectedFile);

    if (selectedFile.type.startsWith("image")) {
        previewImage.src = fileURL;
        previewImage.classList.remove("hidden");
        previewVideo.classList.add("hidden");
    } else if (selectedFile.type.startsWith("video")) {
        previewVideo.src = fileURL;
        previewVideo.classList.remove("hidden");
        previewImage.classList.add("hidden");
    }
    mediaPreview.classList.remove("hidden");
});

cancelMedia?.addEventListener("click", () => {
    mediaPreview.classList.add("hidden");
    mediaInput.value = "";
    selectedFile = null;
});

sendMedia?.addEventListener("click", () => {
    if (!selectedFile || !currentUser) return;
    const fileURL = URL.createObjectURL(selectedFile);
    const message = document.createElement("div");
    message.classList.add("message", "sent");

    if (selectedFile.type.startsWith("image")) {
        const img = document.createElement("img");
        img.src = fileURL;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "10px";
        message.appendChild(img);
        updateSidebar("📷 Photo");
    } else if (selectedFile.type.startsWith("video")) {
        const video = document.createElement("video");
        video.src = fileURL;
        video.controls = true;
        video.style.maxWidth = "200px";
        video.style.borderRadius = "10px";
        message.appendChild(video);
        updateSidebar("🎥 Video");
    }

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("msgTime");
    timeDiv.innerText = getTime();
    message.appendChild(timeDiv);

    const status = document.createElement("span");
    status.classList.add("msgStatus");
    status.innerText = "✓";
    message.appendChild(status);

    messages.appendChild(message);

    setTimeout(() => status.innerText = "✓✓", 1000);
    setTimeout(() => status.classList.add("read"), 3000);

    messages.scrollTop = messages.scrollHeight;
    mediaPreview.classList.add("hidden");
    mediaInput.value = "";
    selectedFile = null;

    chatHistory[currentUser].push({ type: "sent", text: fileURL, time: getTime() });
    localStorage.setItem("nx7Chats", JSON.stringify(chatHistory));
});

// Profile picture upload
const profilePicInput = document.getElementById('profilePic');
const profilePreview = document.getElementById('profilePreview');

profilePicInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const base64URL = reader.result; // This is persistent across reloads

        // Save to localStorage
        localStorage.setItem('profilePic', base64URL);

        // Update all UI
        if(profilePreview) profilePreview.src = base64URL;
        if(profilePic) profilePic.src = base64URL;
        if(myProfilePicSidebar) myProfilePicSidebar.src = base64URL;
        if(chatAvatar) chatAvatar.innerHTML = `<img src="${base64URL}" width="40" height="40" style="border-radius:50%;object-fit:cover;">`;
        if(profileAvatar) profileAvatar.src = base64URL;
    };
    reader.readAsDataURL(file); // Converts image to Base64
});

/* Load saved NX7 theme */

const savedTheme = localStorage.getItem("nx7Theme");

if(savedTheme){
  document.body.classList.add(savedTheme);
}

document.addEventListener('DOMContentLoaded', function() {
            // ===============================
            // NX7 DOG CATCH GAME - FIXED
            // ==============================

            // Select elements
            const launchGameBtn = document.getElementById("launchGameBtn");
            const dogGameWindow = document.getElementById("dogGameWindow");

            const goBackFromGameBtn = document.getElementById("goBackFromGameBtn");
            const closeDogGameBtn = document.getElementById("closeDogGameBtn");

            const startDogGameBtn = document.getElementById("startDogGameBtn");
            const restartDogGameBtn = document.getElementById("restartDogGameBtn");

            const dogGameStart = document.getElementById("dogGameStart");
            const dogGameArea = document.getElementById("dogGameArea");
            const dogGameOver = document.getElementById("dogGameOver");

            const dogTarget = document.getElementById("dogTarget");

            const dogScore = document.getElementById("dogScore");
            const finalDogScore = document.getElementById("finalDogScore");

            // Game variables
            let score = 0;
            let animateInterval = null;
            let gameTimer = null;
            let moveSpeed = 6.0; // Lerp speed factor (higher = faster)
            let targetX = 0;
            let targetY = 0;

            // OPEN GAME
            if (launchGameBtn && dogGameWindow) {
                launchGameBtn.addEventListener("click", () => {
                    dogGameWindow.classList.remove("hidden");
                });
            }

            // CLOSE GAME
            function closeGame() {
                if (!dogGameWindow) return;
                dogGameWindow.classList.add("hidden");
                stopGame();
            }

            if (goBackFromGameBtn) {
                goBackFromGameBtn.addEventListener("click", closeGame);
            }

            if (closeDogGameBtn) {
                closeDogGameBtn.addEventListener("click", closeGame);
            }

            // START GAME
            if (startDogGameBtn) {
                startDogGameBtn.addEventListener("click", startGame);
            }

            function startGame() {
                score = 0;
                moveSpeed = 4.0;

                if (dogScore) dogScore.textContent = score;

                dogGameStart?.classList.add("hidden");
                dogGameOver?.classList.add("hidden");
                dogGameArea?.classList.remove("hidden");

                // Center dog initially
                if (dogTarget && dogGameArea) {
                    const rect = dogGameArea.getBoundingClientRect();
                    dogTarget.style.left = rect.width / 2 + "px";
                    dogTarget.style.top = rect.height / 2 + "px";
                    targetX = rect.width / 2;
                    targetY = rect.height / 2;
                }

                moveDog();
                animateLoop();

                // clearTimeout(gameTimer);
                // gameTimer = setTimeout(endGame, 10000);
            }

            // MOVE DOG - Set new target position
            function moveDog() {
                if (!dogGameArea || !dogTarget) return;

                const rect = dogGameArea.getBoundingClientRect();
                const dogWidth = dogTarget.clientWidth || 90;
                const dogHeight = dogTarget.clientHeight || 90;

                targetX = Math.random() * (rect.width - dogWidth);
                targetY = Math.random() * (rect.height - dogHeight);
            }

            // SMOOTH ANIMATION LOOP
            function animateLoop() {
                if (!dogGameArea || !dogTarget) return;

                const rect = dogGameArea.getBoundingClientRect();
                const dogWidth = dogTarget.clientWidth;
                const dogHeight = dogTarget.clientHeight;

                const currentLeft = parseFloat(dogTarget.style.left) || 0;
                const currentTop = parseFloat(dogTarget.style.top) || 0;

                // Smooth lerp movement
                const newLeft = currentLeft + (targetX - currentLeft) * (moveSpeed / 100);
                const newTop = currentTop + (targetY - currentTop) * (moveSpeed / 100);

                dogTarget.style.left = newLeft + "px";
                dogTarget.style.top = newTop + "px";

                // Check if reached target, move to new position
                if (Math.abs(targetX - newLeft) < 6 && Math.abs(targetY - newTop) < 6) {
                    moveDog();
                }

                animateInterval = requestAnimationFrame(animateLoop);
            }

            // CATCH DOG
            if (dogTarget) {
                dogTarget.addEventListener("click", () => {
                    score++;
                    if (dogScore) dogScore.textContent = score;

                    // Increase difficulty
                    if (moveSpeed < 6) {
                        moveSpeed += 0.2;
                    }
                });
            }

            // END GAME
            function endGame() {
                stopGame();
                dogGameArea?.classList.add("hidden");
                dogGameOver?.classList.remove("hidden");
                if (finalDogScore) finalDogScore.textContent = score;
            }

            // STOP GAME
            function stopGame() {
                // clearTimeout(gameTimer);
                if (animateInterval) {
                    cancelAnimationFrame(animateInterval);
                    animateInterval = null;
                }
            }

            // RESTART
            if (restartDogGameBtn) {
                restartDogGameBtn.addEventListener("click", startGame);
            }
        });