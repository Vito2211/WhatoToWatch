/**
 * What to Watch? - Main Application Script
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Internationalization
  if (window.I18N) {
    window.I18N.init();
  }

  // 2. Setup Language Switcher Buttons
  document.querySelectorAll(".lang-switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetLang = btn.getAttribute("data-lang");
      if (window.I18N && targetLang) {
        window.I18N.setLanguage(targetLang);
      }
    });
  });

  // 3. Setup Google Play Buttons and Modal
  const playModal = document.getElementById("play-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalDismissBtn = document.getElementById("modal-dismiss-btn");
  let lastFocusedElement = null;

  function openPlayModal() {
    lastFocusedElement = document.activeElement;
    if (playModal) {
      playModal.setAttribute("aria-hidden", "false");
      playModal.classList.add("modal-open");
      if (modalCloseBtn) modalCloseBtn.focus();
      document.body.style.overflow = "hidden";
    }
  }

  function closePlayModal() {
    if (playModal) {
      playModal.setAttribute("aria-hidden", "true");
      playModal.classList.remove("modal-open");
      document.body.style.overflow = "";
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }
  }

  // Handle all elements with .btn-google-play
  document.querySelectorAll(".btn-google-play").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const playUrl = window.APP_CONFIG && window.APP_CONFIG.googlePlayUrl;
      if (playUrl && playUrl.trim().length > 0) {
        // App is published, let standard link navigation proceed
        btn.setAttribute("href", playUrl);
      } else {
        // Not yet published, prevent navigation and open informative modal
        e.preventDefault();
        openPlayModal();
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closePlayModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener("click", closePlayModal);

  // Close modal when clicking backdrop
  if (playModal) {
    playModal.addEventListener("click", (e) => {
      if (e.target === playModal) {
        closePlayModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && playModal && playModal.classList.contains("modal-open")) {
      closePlayModal();
    }
  });

  // 4. Setup Share Preview Form
  const shareBtnDecode = document.getElementById("share-btn-decode");
  const shareBtnClear = document.getElementById("share-btn-clear");
  const shareInput = document.getElementById("share-input-text");

  if (shareBtnDecode && shareInput) {
    shareBtnDecode.addEventListener("click", () => {
      const val = shareInput.value;
      if (window.wtwShareManager) {
        window.wtwShareManager.processEncodedString(val, true);
      }
    });

    shareInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        shareBtnDecode.click();
      }
    });
  }

  if (shareBtnClear) {
    shareBtnClear.addEventListener("click", () => {
      if (window.wtwShareManager) {
        window.wtwShareManager.clear();
      }
    });
  }

  // 5. Update GitHub Links from Configuration
  const repoUrl = (window.APP_CONFIG && window.APP_CONFIG.githubRepoUrl) || "https://github.com/Vito2211/WhatoToWatch";
  document.querySelectorAll(".dynamic-repo-link").forEach(el => {
    el.setAttribute("href", repoUrl);
  });

  // 6. Check URL for Shared Payload on page load
  if (window.wtwShareManager) {
    window.wtwShareManager.checkUrlForPayload();
  }
});
