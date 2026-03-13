/**
 * communities.js
 * Defensive, beginner-friendly script for Communities UI
 *
 * - Waits for DOMContentLoaded
 * - Uses safe element lookups and logs helpful warnings
 * - Keeps functions small and focused
 * - Handles modals, keyboard accessibility, and video playback cleanup
 *
 * Replace placeholder URLs in `communitiesData` with your real assets.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------
     Utility helpers
     ------------------------- */

  // Safe query selector that logs a warning if element is missing
  function $(selector) {
    const el = document.querySelector(selector);
    if (!el) console.warn(`Missing element for selector: ${selector}`);
    return el;
  }

  // Create element with optional class and attributes
  function createEl(tag, className, attrs = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.keys(attrs).forEach((k) => {
      if (k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  // Toggle modal visibility and body scroll
  function showModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hideModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Stop and reset a video element safely
  function resetVideo(videoEl) {
    if (!videoEl) return;
    try {
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
      videoEl.classList.add('hidden');
    } catch (err) {
      console.warn('Error resetting video element', err);
    }
  }

  /* -------------------------
     Demo data (replace these)
     ------------------------- */

  // Replace these avatar, thumbnail and videoSrc values with your own URLs
  const communitiesData = [
    {
      name: 'Tech Geeks',
      avatar: '../../images/tech.jpg',
      channels: [
        {
          title: 'AI Updates',
          videoThumbnail: '../../images/aiupdates.jpg',
          videoSrc: 'https://youtu.be/SVXTV69c2wQ'
        },
        {
          title: 'Programming Tips',
          videoThumbnail: 'https://lh6.googleusercontent.com/proxy/I8JbFY0JmWbujsPIypQuAFpcsVZDjHUn7vVESn0XgDF3DWsXh-U0gpG9A8D-f8yPkHzN7dfd-3xzaDesGQ7IIjoDsKlw_d7sS9pQxTU06FvdpCLKOnoSYp0aZDNIFcWgW1k',
          videoSrc: 'https://youtu.be/KT1r1qk_SWY'
        }
      ]
    },
    {
      name: 'Movie Fans',
      avatar: '../../images/movies.jpg',
      channels: [
        {
          title: 'Bhool Bhulaiya',
          videoThumbnail: '../../images/bhoolB.jpg',
          videoSrc: 'https://youtu.be/jzYxbnHHhY4?si=YI83zJY_z37mVR0B'
        },
        {
          title: 'Zindagi na milegi dobara',
          videoThumbnail: '../../images/zindagiN.jpg',
          videoSrc: 'https://youtu.be/gQEUkqZ33IA?si=zveLa3Dk6ikY6uvI'
        }
      ]
    },
    {
      name: 'Dog Lovers',
      avatar: '../../images/doglover.jpg',
      channels: [
        {
          title: 'Puppy Training',
          videoThumbnail: '../../images/puppyT.jpg',
          videoSrc: 'https://youtu.be/gYjnAPtID1w?si=XBiIieEA_qd3r_oE'
        }
      ]
    }
  ];

  /* -------------------------
     Element references
     ------------------------- */

  const el = {
    communitiesList: $('#communitiesList'),
    communityModal: $('#communityModal'),
    communityAvatar: $('#communityAvatar'),
    communityName: $('#communityName'),
    communityChannels: $('#communityChannels'),
    channelsList: $('#channelsList'),
    closeCommunity: $('#closeCommunity'),

    videoModal: $('#videoModal'),
    videoThumbnail: $('#videoThumbnail'),
    playButton: $('#playButton'),
    videoElement: $('#videoElement'),
    videoTitle: $('#videoTitle'),
    videoChannel: $('#videoChannel'),
    closeVideo: $('#closeVideo'),

    newCommunityBtn: $('#newCommunityBtn'),
    goBackBtn: $('#goBackBtn')
  };

  /* Guard: ensure required DOM nodes exist */
  if (!el.communitiesList) {
    console.error('Required container #communitiesList not found. Aborting script.');
    return;
  }

  /* -------------------------
     Rendering functions
     ------------------------- */

  // Render the list of communities
  function renderCommunities() {
    el.communitiesList.innerHTML = '';
    if (!Array.isArray(communitiesData) || communitiesData.length === 0) {
      // Empty state handled by CSS :empty pseudo-element if desired
      return;
    }

    communitiesData.forEach((community, index) => {
      const item = createCommunityElement(community, index);
      el.communitiesList.appendChild(item);
    });
  }

  // Create a community card element
  function createCommunityElement(community, index) {
    const wrapper = createEl('div', 'communityItem');
    wrapper.tabIndex = 0;

    const img = createEl('img');
    img.src = community.avatar || '';
    img.alt = `${community.name} avatar`;
    img.style.width = '56px';
    img.style.height = '56px';
    img.style.borderRadius = '10px';
    img.style.objectFit = 'cover';

    const details = createEl('div');
    details.style.display = 'flex';
    details.style.flexDirection = 'column';

    const title = createEl('div', 'communityName', { text: community.name || 'Unnamed' });
    const meta = createEl('div', 'communityChannels', { text: `${(community.channels || []).length} channels` });
    meta.style.fontSize = '13px';
    meta.style.color = 'rgba(0,0,0,0.55)';

    details.appendChild(title);
    details.appendChild(meta);

    wrapper.appendChild(img);
    wrapper.appendChild(details);

    // Click and keyboard activation
    wrapper.addEventListener('click', () => openCommunityModal(index));
    wrapper.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openCommunityModal(index); });

    return wrapper;
  }

  // Create a channel row element
  function createChannelElement(channel, communityName) {
    const row = createEl('div', 'channelItem');
    row.tabIndex = 0;

    const thumb = createEl('img');
    thumb.src = channel.videoThumbnail || '';
    thumb.alt = `${channel.title} thumbnail`;
    thumb.width = 96;
    thumb.height = 60;
    thumb.style.objectFit = 'cover';

    const titleWrap = createEl('div');
    const title = createEl('div', 'channelTitle', { text: channel.title || 'Untitled' });
    titleWrap.appendChild(title);

    row.appendChild(thumb);
    row.appendChild(titleWrap);

    // Click opens video modal
    row.addEventListener('click', (ev) => {
      ev.stopPropagation();
      openVideoModal(channel, communityName);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideoModal(channel, communityName);
      }
    });

    return row;
  }

  /* -------------------------
     Modal handlers
     ------------------------- */

  function openCommunityModal(index) {
    const community = communitiesData[index];
    if (!community) {
      console.warn('Community not found at index', index);
      return;
    }

    // Populate modal
    if (el.communityAvatar) el.communityAvatar.src = community.avatar || '';
    if (el.communityName) el.communityName.textContent = community.name || '';
    if (el.communityChannels) el.communityChannels.textContent = `${(community.channels || []).length} channels`;

    // Render channels
    if (el.channelsList) {
      el.channelsList.innerHTML = '';
      (community.channels || []).forEach((ch) => {
        const chEl = createChannelElement(ch, community.name);
        el.channelsList.appendChild(chEl);
      });
    }

    showModal(el.communityModal);
    // Move focus into modal for accessibility
    setTimeout(() => {
      const firstFocusable = el.communityModal && el.communityModal.querySelector('.channelItem, .closeBtn');
      if (firstFocusable) firstFocusable.focus();
    }, 50);
  }

  function openVideoModal(channel, communityName) {
  if (!channel) return;

  const thumbnail = el.videoThumbnail;
  const playBtn = el.playButton;
  const iframe = $('#ytPlayer');
  const titleEl = el.videoTitle;
  const channelEl = el.videoChannel;

  if (!thumbnail || !playBtn || !iframe) return;

  // Populate modal info
  thumbnail.src = channel.videoThumbnail || '';
  titleEl.textContent = channel.title || '';
  channelEl.textContent = communityName || '';

  // Show thumbnail & play button, hide iframe initially
  thumbnail.classList.remove('hidden');
  playBtn.classList.remove('hidden');
  iframe.classList.add('hidden');
  iframe.src = ''; // reset

  // Remove previous click listeners
  playBtn.onclick = null;

  // Play button handler
  playBtn.addEventListener('click', () => {
    if (!channel.videoSrc) {
      alert('Video source not available.');
      return;
    }

    // Hide thumbnail & play button
    thumbnail.classList.add('hidden');
    playBtn.classList.add('hidden');

    // Show iframe and set YouTube embed
    iframe.classList.remove('hidden');

    // Transform YouTube URL into embed URL
    let embedUrl = channel.videoSrc;
    if (embedUrl.includes('youtu.be')) {
      // Convert short link: https://youtu.be/VIDEOID → https://www.youtube.com/embed/VIDEOID?autoplay=1
      const id = embedUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (embedUrl.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(embedUrl.split('?')[1]);
      const id = urlParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    iframe.src = embedUrl;
  });

  // Show modal
  showModal(el.videoModal);
  setTimeout(() => {
    playBtn.focus();
  }, 50);
}

  /* -------------------------
     Close and cleanup handlers
     ------------------------- */

  // Close community modal
  if (el.closeCommunity) {
    el.closeCommunity.addEventListener('click', () => hideModal(el.communityModal));
  }

  // Close video modal and stop video
  if (el.closeVideo) {
  el.closeVideo.addEventListener('click', () => {
    // Reset iframe
    const iframe = $('#ytPlayer');
    if (iframe) {
      iframe.src = '';           // stop playback
      iframe.classList.add('hidden');
    }

    // Show thumbnail and play button again
    if (el.videoThumbnail) el.videoThumbnail.classList.remove('hidden');
    if (el.playButton) el.playButton.classList.remove('hidden');

    hideModal(el.videoModal);
  });
}
  // Click outside modal to close
  [el.communityModal, el.videoModal].forEach((modal) => {
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (modal === el.videoModal) {
        const iframe = $('#ytPlayer');
        if (iframe) iframe.src = '';
      }
      hideModal(modal);
    }
  });
});

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (el.communityModal && !el.communityModal.classList.contains('hidden')) hideModal(el.communityModal);
    if (el.videoModal && !el.videoModal.classList.contains('hidden')) {
      const iframe = $('#ytPlayer');
      if (iframe) iframe.src = '';
      hideModal(el.videoModal);
    }
  }
});

  /* -------------------------
     Top buttons (New / Go Back)
     ------------------------- */

  if (el.goBackBtn) {
    el.goBackBtn.addEventListener('click', () => {
      // Default behavior: go back in history if possible
      if (window.history && window.history.length > 1) window.history.back();
      else console.info('No history to go back to.');
    });
  }

  if (el.newCommunityBtn) {
    el.newCommunityBtn.addEventListener('click', () => {
      // Beginner-friendly placeholder action
      alert('Create new community feature not implemented yet.');
    });
  }

  /* -------------------------
     Initialization
     ------------------------- */

  try {
    renderCommunities();
    console.info('Communities script initialized.');
  } catch (err) {
    console.error('Initialization error in communities.js', err);
  }
});
/* Load saved NX7 theme */

const savedTheme = localStorage.getItem("nx7Theme");

if(savedTheme){
  document.body.classList.add(savedTheme);
}