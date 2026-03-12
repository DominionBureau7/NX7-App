// =========================
// NX7 Status Page JS
// =========================

const statusData = [
  { name: "Philosopher", avatar: "../../images/philosophy.jpg", image: "../../images/philosophy.jpg", time: "10:30 AM", viewed: false },
  { name: "Joker", avatar: "../../images/joker.jpg", image: "../../images/joker.jpg", time: "12:15 PM", viewed: false },
  { name: "Dog Lover", avatar: "../../images/dog.jpg", image: "../../images/dog.jpg", time: "2:00 PM", viewed: false }
];
let currentStatusIndex = 0;
let progressTimeout;

// ---------------- Render status list ----------------
function renderStatus() {
  const statusList = document.getElementById("statusList");
  statusList.innerHTML = "";

  statusData.forEach((status, index) => {
    const item = document.createElement("div");
    item.classList.add("statusItem");
    if (status.viewed) item.classList.add("viewed");
    
    item.innerHTML = `
      <img src="${status.avatar}" alt="${status.name}">
      <div class="statusName">${status.name}</div>
    `;

    item.addEventListener("click", () => openStatus(index));
    statusList.appendChild(item);
  });
}

// ---------------- Open status modal ----------------
function openStatus(index) {
  currentStatusIndex = index;
  updateModal();
  markViewed(index);
  startProgressBar();
  document.getElementById("statusModal").classList.remove("hidden");
}

// ---------------- Update modal content ----------------
function updateModal() {
  const status = statusData[currentStatusIndex];
  document.getElementById("statusImage").src = status.image;
  document.getElementById("statusName").textContent = status.name;
  document.getElementById("statusTime").textContent = status.time;
}

// ---------------- Mark status as viewed ----------------
function markViewed(index) {
  if (!statusData[index].viewed) {
    statusData[index].viewed = true;
    localStorage.setItem('statusData', JSON.stringify(statusData));
    renderStatus();
  }
}

// ---------------- Progress bar ----------------
function startProgressBar() {
  clearTimeout(progressTimeout);
  const bar = document.querySelector('.progressBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';

  setTimeout(() => {
    bar.style.transition = 'width 7s linear';
    bar.style.width = '100%';

    progressTimeout = setTimeout(nextStatus, 7000);
  }, 50);
}

// ---------------- Next & Previous ----------------
function nextStatus() {
  if (currentStatusIndex < statusData.length - 1) {
    openStatus(currentStatusIndex + 1);
  } else {
    closeModal();
  }
}

function prevStatus() {
  if (currentStatusIndex > 0) {
    openStatus(currentStatusIndex - 1);
  }
}

// ---------------- Close modal ----------------
function closeModal() {
  clearTimeout(progressTimeout);
  document.getElementById("statusModal").classList.add("hidden");
}

// ---------------- Setup modal buttons ----------------
function setupModal() {
  const modal = document.getElementById("statusModal");
  document.getElementById("closeStatus").addEventListener("click", closeModal);
  document.getElementById("prevStatus").addEventListener("click", prevStatus);
  document.getElementById("nextStatus").addEventListener("click", nextStatus);

  // Close modal if clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ---------------- Load saved status data ----------------
function loadStatusData() {
  const saved = localStorage.getItem('statusData');
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.forEach((s, i) => { if (statusData[i]) statusData[i].viewed = s.viewed; });
  }
}

// ---------------- Initialize ----------------
window.addEventListener("DOMContentLoaded", () => {
  loadStatusData();
  renderStatus();
  setupModal();
});