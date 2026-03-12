// ------------------------
// Sample archive data
// ------------------------
const archiveItems = [
  {
    title: "AI Future",
    community: "Tech Geeks",
    thumbnail: "../../images/ai.jpg",          // downloaded thumbnail
    // videoFile: "videos/ai.mp4",         // local video file (optional)
    youtubeSrc: "https://youtu.be/7ARBJQn6QkM?si=VgluMEuymhgE9Q77",                      // YouTube URL (optional)
    date: "2026-03-09"
  },
  {
    title: "Marvel Movie Clip",
    community: "Movie Fans",
    thumbnail: "../../images/marvel.jpg",
    // videoFile: "",
    youtubeSrc: "https://youtu.be/l66NJcjEy1k?si=ijjqsmX7VDc2VoVU",  // example YouTube video
    date: "2026-02-20"
  },
  {
    title: "Puppy Training Tips",
    community: "Dog Lovers",
    thumbnail: "../../images/puppyT2.jpg",
    // videoFile: "videos/puppy.mp4",
    youtubeSrc: "https://youtu.be/HTXajoc4a3k?si=avw8Hjn84HW-rfPZ",
    date: "2026-01-15"
  },
  {
    title: "Programming Basics",
    community: "Tech Geeks",
    thumbnail: "../../images/programming.jpg",
    // videoFile: "",
    youtubeSrc: "https://youtu.be/0HyIda5eub8?si=9axaMvTV89_8NzE5",
    date: "2026-03-01"
  }
];
// ------------------------
// Pagination settings
// ------------------------
let currentPage = 1;
const itemsPerPage = 4;

// ------------------------
// DOM references
// ------------------------
const grid = document.getElementById("grid");
const pagination = document.getElementById("pagination");
const emptyDiv = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterCommunity = document.getElementById("filterCommunity");
const sortBy = document.getElementById("sortBy");
const previewModal = document.getElementById("previewModal");
const previewVideo = document.getElementById("previewVideo");
const previewTitle = document.getElementById("previewTitle");
const previewMeta = document.getElementById("previewMeta");
const closePreview = document.getElementById("closePreview");
const goBackBtn = document.getElementById("goBackBtn");

// ------------------------
// Initialize filter options
// ------------------------
function populateFilterOptions() {
  const communities = [...new Set(archiveItems.map(item => item.community))]; // unique communities
  communities.forEach(com => {
    const option = document.createElement("option");
    option.value = com;
    option.textContent = com;
    filterCommunity.appendChild(option);
  });
}

// ------------------------
// Render archive grid
// ------------------------
function renderGrid() {
  let items = [...archiveItems];

  // Apply search filter
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    items = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.community.toLowerCase().includes(searchTerm)
    );
  }

  // Apply community filter
  const communityFilter = filterCommunity.value;
  if (communityFilter) {
    items = items.filter(item => item.community === communityFilter);
  }

  // Apply sort
  if (sortBy.value === "new") {
    items.sort((a,b) => new Date(b.date) - new Date(a.date));
  } else {
    items.sort((a,b) => new Date(a.date) - new Date(b.date));
  }

  // Pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Clear previous grid
  grid.innerHTML = "";

  if (paginatedItems.length === 0) {
    emptyDiv.hidden = false;
  } else {
    emptyDiv.hidden = true;
    paginatedItems.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" class="thumb">
        <div class="cardBody">
          <div class="meta">
            <div class="title">${item.title}</div>
            <div class="sub">${item.community}</div>
          </div>
        </div>
      `;
      // Click to open preview
      card.addEventListener("click", () => openPreview(item));
      grid.appendChild(card);
    });
  }

  renderPagination(totalPages);
}

// ------------------------
// Render pagination buttons
// ------------------------
function renderPagination(totalPages) {
  pagination.innerHTML = "";
  if (totalPages <= 1) return; // no need for pagination if 1 page

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("pageBtn");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true; // current page disabled
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGrid();
    });
    pagination.appendChild(btn);
  }
}

// ------------------------
// Open preview modal
// ------------------------
function openPreview(item) {
  previewTitle.textContent = item.title;
  previewMeta.textContent = item.community;

  // Clear previous content
  previewVideo.innerHTML = "";

  if (item.youtubeSrc) {
    // Convert YouTube URL to embed
    let videoId = "";
    if (item.youtubeSrc.includes("youtu.be")) {
      videoId = item.youtubeSrc.split("youtu.be/")[1].split("?")[0];
    } else if (item.youtubeSrc.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(item.youtubeSrc.split("?")[1]);
      videoId = urlParams.get("v");
    }

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "360";
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    previewVideo.appendChild(iframe);
  } else if (item.videoFile) {
    const videoEl = document.createElement("video");
    videoEl.width = "100%";
    videoEl.height = "360";
    videoEl.controls = true;
    videoEl.preload = "metadata";

    const source = document.createElement("source");
    source.src = item.videoFile;
    source.type = "video/mp4";

    videoEl.appendChild(source);
    previewVideo.appendChild(videoEl);
  }

  previewModal.setAttribute("aria-hidden", "false");
}

// Close preview modal
closePreview.addEventListener("click", () => {
  previewModal.setAttribute("aria-hidden", "true");
  previewVideo.innerHTML = ""; // remove iframe/video to stop playback
});

// ------------------------
// Go back button
// ------------------------
goBackBtn.addEventListener("click", () => {
  window.location.href = "chat.html";
});

// ------------------------
// Search, filter, sort events
// ------------------------
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderGrid();
});
filterCommunity.addEventListener("change", () => {
  currentPage = 1;
  renderGrid();
});
sortBy.addEventListener("change", () => {
  currentPage = 1;
  renderGrid();
});

// ------------------------
// Initialize page
// ------------------------
populateFilterOptions();
renderGrid();