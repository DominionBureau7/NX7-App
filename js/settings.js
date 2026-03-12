// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------
  // Helper: safe query selectors
  // -----------------------
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // -----------------------
  // Go back button
  // -----------------------
  const goBackBtn = $("#goBackBtn");
  if (goBackBtn) {
    goBackBtn.addEventListener("click", () => {
      window.location.href = "chat.html"; // redirect to chat page
    });
  }

  // -----------------------
  // Collapsible sections
  // -----------------------
  $$(".collapseBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sectionContent = btn.closest(".settingsSection")?.querySelector(".sectionContent");
      if (!sectionContent) return;
      if (sectionContent.style.display === "none") {
        sectionContent.style.display = "flex";
        btn.textContent = "▼";
      } else {
        sectionContent.style.display = "none";
        btn.textContent = "▶";
      }
    });
  });

  // -----------------------
  // Profile section functionality
  // -----------------------
  const profilePicInput = $("#profilePic");
  const profilePreview = $("#profilePreview");
  if (profilePicInput && profilePreview) {
    profilePicInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => { profilePreview.src = reader.result; };
      reader.readAsDataURL(file);
    });
  }

  const saveProfileBtn = $(".saveBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      const username = $("#usernameInput")?.value || "";
      const email = $("#emailInput")?.value || "";
      const currentPassword = $("#currentPassword")?.value || "";
      const newPassword = $("#newPassword")?.value || "";

      // Defensive validation
      if (!username.trim()) { alert("Username cannot be empty!"); return; }
      if (!email.trim()) { alert("Email cannot be empty!"); return; }

      // For frontend-only, just show confirmation
      alert("Profile saved successfully!");
      console.log({ username, email, currentPassword, newPassword });
    });
  }

  // -----------------------
  // Notifications section
  // -----------------------
  const notifElements = ["notifMessages", "notifMentions", "notifUpdates"];
  notifElements.forEach(id => {
    const el = $(`#${id}`);
    if (el) {
      el.addEventListener("change", () => {
        console.log(`${id} changed to ${el.checked}`);
      });
    }
  });

  // Do Not Disturb times
  const dndStart = $("#dndStart");
  const dndEnd = $("#dndEnd");
  if (dndStart) dndStart.addEventListener("change", () => console.log(`DND Start: ${dndStart.value}`));
  if (dndEnd) dndEnd.addEventListener("change", () => console.log(`DND End: ${dndEnd.value}`));

  // Notification volume
  const notifVolume = $("#notifVolume");
  if (notifVolume) notifVolume.addEventListener("input", () => console.log(`Notification volume: ${notifVolume.value}`));

  // -----------------------
  // App Preferences section
  // -----------------------
  const preferences = ["themeSelect", "languageSelect", "fontSizeSelect", "layoutSelect"];
  preferences.forEach(id => {
    const el = $(`#${id}`);
    if (el) el.addEventListener("change", () => console.log(`${id} changed to ${el.value}`));
  });

  // -----------------------
  // Security & Privacy section
  // -----------------------
  const securityChecks = ["twoFA", "profileVisibility"];
  securityChecks.forEach(id => {
    const el = $(`#${id}`);
    if (el) el.addEventListener("change", () => console.log(`${id} changed to ${el.checked}`));
  });

  // -----------------------
  // Initialize collapsible sections (all open by default)
  // -----------------------
  $$(".settingsSection .sectionContent").forEach(sec => sec.style.display = "flex");

  // -----------------------
  // Defensive logging
  // -----------------------
  console.log("Settings page initialized.");
});