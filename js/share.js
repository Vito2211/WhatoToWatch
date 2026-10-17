/**
 * What to Watch? - Share Link Handler
 * 
 * STRICT PRIVACY GUARANTEE:
 * 1. All decoding and decompression is executed 100% locally in browser memory.
 * 2. Zero network requests, zero telemetry, zero servers, zero cookies.
 * 3. Never transmits or logs shared payload contents.
 */
class ShareManager {
  constructor() {
    this.currentPayload = null;
    this.rawEncodedString = null;
    this.initEventListeners();
  }

  /**
   * Listens for hash changes in case of client-side navigation
   */
  initEventListeners() {
    window.addEventListener("hashchange", () => {
      this.checkUrlForPayload();
    });
  }

  /**
   * Extracts payload from any URL format, fragment, query param, or raw string
   */
  extractPayload(input) {
    if (!input || !input.trim()) return null;
    const str = input.trim();

    // 1. Full URI parsing (http, https, whattowatch)
    if (/^(https?|whattowatch):\/\//i.test(str)) {
      try {
        let parseable = str;
        if (str.startsWith("whattowatch://")) {
          // Normalize custom scheme so browser URL constructor can reliably parse search and path
          parseable = "https://" + str.substring("whattowatch://".length);
        }
        const url = new URL(parseable);

        // Check query parameters
        const qData = url.searchParams.get("data") || url.searchParams.get("share");
        if (qData) {
          return this.sanitizeEncodedString(qData);
        }

        // Check hash fragments (#share/..., #/share/..., #data=..., #share=..., or raw hash)
        if (url.hash) {
          const hashPayload = this.extractFromHash(url.hash);
          if (hashPayload) return hashPayload;
        }

        // Check pathname (e.g. whattowatch://share/<encoded> or /share/<encoded>)
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === "share") {
          return this.sanitizeEncodedString(pathParts[1]);
        } else if (pathParts.length === 1 && str.startsWith("whattowatch://share/")) {
          return this.sanitizeEncodedString(pathParts[0]);
        }
      } catch (_) {
        // Fall back to regex patterns below
      }
    }

    // 2. Query param regex check in loose or partial URLs
    const queryMatch = str.match(/[?&](?:data|share)=([^&#]+)/);
    if (queryMatch) {
      return this.sanitizeEncodedString(queryMatch[1]);
    }

    // 3. Hash fragment regex check in loose strings
    if (str.includes("#")) {
      const hashPart = str.substring(str.indexOf("#"));
      const extracted = this.extractFromHash(hashPart);
      if (extracted) return extracted;
    }

    // 4. Default: sanitize raw string
    return this.sanitizeEncodedString(str);
  }

  /**
   * Extracts encoded payload from a hash fragment string
   */
  extractFromHash(hashString) {
    if (!hashString) return null;
    let h = hashString.replace(/^#\/?/, ""); // Strip leading # and optional leading /

    if (h.startsWith("share/")) {
      return this.sanitizeEncodedString(h.substring(6));
    }
    if (h.startsWith("data=")) {
      return this.sanitizeEncodedString(h.substring(5));
    }
    if (h.startsWith("share=")) {
      return this.sanitizeEncodedString(h.substring(6));
    }
    // Direct payload in hash (typical Base64 GZIP payloads are 30+ characters without slashes)
    if (h.length >= 16 && !h.includes("/")) {
      return this.sanitizeEncodedString(h);
    }
    return null;
  }

  /**
   * Sanitizes and normalizes an encoded string
   */
  sanitizeEncodedString(raw) {
    if (!raw) return null;
    let clean = raw.trim().replace(/\/$/, ""); // Remove trailing slash
    try {
      clean = decodeURIComponent(clean);
    } catch (_) {
      // Keep as-is if decodeURIComponent fails
    }
    return clean.replace(/\s+/g, "");
  }

  /**
   * Checks current page URL (query params and hash) for shared payload
   */
  async checkUrlForPayload() {
    try {
      // 1. Check query parameters (?data=... or ?share=...)
      const urlParams = new URLSearchParams(window.location.search);
      let raw = urlParams.get("data") || urlParams.get("share");

      // 2. Check hash fragments (#share/..., #/share/..., #data=..., etc.)
      if (!raw && window.location.hash) {
        raw = this.extractFromHash(window.location.hash);
      }

      if (raw) {
        await this.processEncodedString(raw, false);
      }
    } catch (e) {
      console.warn("Could not parse shared link from URL:", e);
    }
  }

  /**
   * Cleans input string and decodes the payload
   */
  async processEncodedString(inputString, fromUserInput = true) {
    if (!inputString || !inputString.trim()) {
      return;
    }

    const encodedData = this.extractPayload(inputString);
    if (!encodedData) {
      this.showError(window.I18N ? window.I18N.t("previewInvalidPayload") : "Could not decode this shared link.");
      return;
    }

    const errorContainer = document.getElementById("share-error");
    const previewContainer = document.getElementById("share-preview-card");

    try {
      if (errorContainer) errorContainer.style.display = "none";

      const payload = await this.decodeAndDecompress(encodedData);
      this.currentPayload = payload;
      // Normalize to URL-safe unpadded Base64 (matching Android SharingService format)
      this.rawEncodedString = encodedData.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

      this.renderCurrentPayload();

      if (previewContainer) {
        previewContainer.style.display = "block";
        if (fromUserInput) {
          previewContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch (err) {
      console.error("Decoding error:", err);
      this.currentPayload = null;
      this.rawEncodedString = null;
      if (previewContainer) previewContainer.style.display = "none";
      this.showError(window.I18N ? window.I18N.t("previewInvalidPayload") : "Could not decode this shared link.");
    }
  }

  showError(message) {
    const errorContainer = document.getElementById("share-error");
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = "block";
    }
  }

  /**
   * Decompresses URL-safe Base64 GZIP using native browser DecompressionStream
   */
  async decodeAndDecompress(base64UrlString) {
    let clean = this.sanitizeEncodedString(base64UrlString);
    if (!clean) {
      throw new Error("Empty payload string");
    }

    // Convert URL-safe Base64 (- and _) to standard Base64 (+ and /)
    let base64 = clean.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    // Decode Base64 to binary Uint8Array
    let bytes;
    try {
      const binaryString = atob(base64);
      bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
    } catch (e) {
      throw new Error("Invalid base64 encoding: " + e.message);
    }

    let jsonString = "";

    // Modern browsers support native DecompressionStream('gzip')
    if (typeof DecompressionStream !== "undefined") {
      const stream = new Response(bytes).body.pipeThrough(new DecompressionStream("gzip"));
      jsonString = await new Response(stream).text();
    } else {
      // Fallback: If browser does not have DecompressionStream, try plain utf-8 text
      const decoder = new TextDecoder("utf-8");
      jsonString = decoder.decode(bytes);
    }

    let payload;
    try {
      payload = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Payload is not valid JSON");
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload structure");
    }

    // Validate supported version (Android SharingService CURRENT_VERSION = 1)
    if (typeof payload.version === "number" && payload.version > 1) {
      throw new Error("Unsupported sharing version " + payload.version);
    }

    if (!payload.type || !payload.title) {
      throw new Error("Missing required payload fields");
    }

    return payload;
  }

  hasDecodedPayload() {
    return this.currentPayload !== null;
  }

  /**
   * Renders the decoded payload in the DOM with strict sanitization (no innerHTML with user input)
   */
  renderCurrentPayload() {
    if (!this.currentPayload) return;

    const payload = this.currentPayload;
    const isEn = !window.I18N || window.I18N.currentLang === "en";

    // Header title and type
    const titleEl = document.getElementById("payload-title");
    const typeBadgeEl = document.getElementById("payload-type-badge");
    const summaryEl = document.getElementById("payload-summary");
    const itemsListEl = document.getElementById("payload-items-list");
    const directAppBtn = document.getElementById("payload-open-app-btn");

    if (titleEl) {
      titleEl.textContent = payload.title || (isEn ? "Shared Watchlist" : "Общий список");
    }

    if (typeBadgeEl) {
      const isSingle = payload.type === "SINGLE_ITEM";
      typeBadgeEl.textContent = isSingle 
        ? (window.I18N ? window.I18N.t("previewTypeItem") : "Single Item") 
        : (window.I18N ? window.I18N.t("previewTypeList") : "Custom Collection");
      typeBadgeEl.className = "status-badge " + (isSingle ? "badge-single" : "badge-collection");
    }

    if (summaryEl) {
      const contentsCount = payload.contents ? payload.contents.length : 0;
      const categoriesCount = payload.categories ? payload.categories.length : 0;
      summaryEl.textContent = `${window.I18N ? window.I18N.t("previewItemsCount") : "Items: "} ${contentsCount} • ${window.I18N ? window.I18N.t("previewCategoriesCount") : "Categories: "} ${categoriesCount}`;
    }

    // Direct app button handler (whattowatch:// scheme)
    if (directAppBtn) {
      const scheme = (window.APP_CONFIG && window.APP_CONFIG.deepLinkScheme) || "whattowatch";
      const host = (window.APP_CONFIG && window.APP_CONFIG.deepLinkHost) || "share";
      directAppBtn.href = `${scheme}://${host}/${this.rawEncodedString}`;
    }

    // Category lookup map
    const categoryMap = {};
    if (Array.isArray(payload.categories)) {
      payload.categories.forEach(cat => {
        if (cat && cat.id) categoryMap[cat.id] = cat.name;
      });
    }

    // Map item ID to category names
    const itemCategoriesMap = {};
    if (Array.isArray(payload.contentCategories)) {
      payload.contentCategories.forEach(ref => {
        if (ref && ref.contentId && ref.categoryId && categoryMap[ref.categoryId]) {
          if (!itemCategoriesMap[ref.contentId]) itemCategoriesMap[ref.contentId] = [];
          itemCategoriesMap[ref.contentId].push(categoryMap[ref.categoryId]);
        }
      });
    }

    // Render items securely without innerHTML injection
    if (itemsListEl) {
      itemsListEl.innerHTML = "";

      const contents = payload.contents || [];
      if (contents.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-items-notice";
        emptyMsg.textContent = window.I18N ? window.I18N.t("previewEmptyPayload") : "No items found in this payload.";
        itemsListEl.appendChild(emptyMsg);
        return;
      }

      contents.forEach(item => {
        const card = document.createElement("article");
        card.className = "shared-item-card";

        // Item Header Row
        const headerRow = document.createElement("div");
        headerRow.className = "shared-item-header";

        const titleSpan = document.createElement("h4");
        titleSpan.className = "shared-item-title";
        titleSpan.textContent = item.title;
        headerRow.appendChild(titleSpan);

        const badgesContainer = document.createElement("div");
        badgesContainer.className = "shared-badges-container";

        // Content Type Badge (Movie, Series, Video, Other)
        const typeBadge = document.createElement("span");
        typeBadge.className = "shared-meta-badge type-badge";
        typeBadge.textContent = this.formatContentType(item.contentType);
        badgesContainer.appendChild(typeBadge);

        // Status Badge (Watched, Watching, Not Watched)
        const statusBadge = document.createElement("span");
        statusBadge.className = `shared-meta-badge status-pill status-${(item.watchStatus || "").toLowerCase()}`;
        statusBadge.textContent = this.formatStatus(item.watchStatus);
        badgesContainer.appendChild(statusBadge);

        // Category badges if assigned
        const itemCats = itemCategoriesMap[item.id] || [];
        itemCats.forEach(catName => {
          const catBadge = document.createElement("span");
          catBadge.className = "shared-meta-badge category-badge";
          catBadge.textContent = catName;
          badgesContainer.appendChild(catBadge);
        });

        headerRow.appendChild(badgesContainer);
        card.appendChild(headerRow);

        // Description / Personal Notes
        if (item.description && item.description.trim()) {
          const notesP = document.createElement("p");
          notesP.className = "shared-item-notes";
          notesP.textContent = item.description.trim();
          card.appendChild(notesP);
        }

        // External Link (if present, safely sanitized)
        if (item.externalUrl && typeof item.externalUrl === "string") {
          const safeUrl = this.sanitizeUrl(item.externalUrl);
          if (safeUrl) {
            const linkA = document.createElement("a");
            linkA.className = "shared-item-link";
            linkA.href = safeUrl;
            linkA.target = "_blank";
            linkA.rel = "noopener noreferrer";
            linkA.textContent = "↗ " + safeUrl;
            card.appendChild(linkA);
          }
        }

        itemsListEl.appendChild(card);
      });
    }
  }

  /**
   * Sanitizes external URLs to permit only safe HTTP / HTTPS protocols
   */
  sanitizeUrl(urlString) {
    try {
      const parsed = new URL(urlString);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch (_) {
      // Invalid URL
    }
    return null;
  }

  formatContentType(type) {
    if (!type) return "";
    const key = `type${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`;
    return window.I18N ? window.I18N.t(key) : type;
  }

  formatStatus(status) {
    if (!status) return "";
    switch (status.toUpperCase()) {
      case "WATCHED":
        return window.I18N ? window.I18N.t("statusWatched") : "Watched";
      case "WATCHING":
        return window.I18N ? window.I18N.t("statusWatching") : "Watching";
      case "NOT_WATCHED":
      default:
        return window.I18N ? window.I18N.t("statusNotWatched") : "Not Watched";
    }
  }

  clear() {
    this.currentPayload = null;
    this.rawEncodedString = null;
    const previewContainer = document.getElementById("share-preview-card");
    const errorContainer = document.getElementById("share-error");
    const inputEl = document.getElementById("share-input-text");
    const directAppBtn = document.getElementById("payload-open-app-btn");

    if (previewContainer) previewContainer.style.display = "none";
    if (errorContainer) errorContainer.style.display = "none";
    if (inputEl) inputEl.value = "";
    if (directAppBtn) directAppBtn.href = "#";
  }
}

window.wtwShareManager = new ShareManager();
