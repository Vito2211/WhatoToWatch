# What to Watch? — Static Website

A responsive, privacy-first static landing page for the **What to Watch?** (**Что посмотреть?**) Android application.

Designed to be hosted on **GitHub Pages** from the repository [https://github.com/Vito2211/WhatoToWatch](https://github.com/Vito2211/WhatoToWatch).

---

## Features

- **Dark Cinematic Visual Identity**: Styled to match the Android app's design system (`#0C0D11` primary surfaces with restrained amber/gold accents `#E5A93C` and slate cards).
- **Bilingual Support (English & Russian)**: Full translation toggle between English and Russian with language preference persistence.
- **Shared Link Handler & Offline Preview**: Decodes and previews shared movie/series watchlists locally in browser memory using native `DecompressionStream`.
- **Zero Backend & Complete Privacy**:
  - No database, no backend, no server.
  - Zero external API calls or network requests.
  - Never collects, tracks, or transmits shared link payloads.
  - No analytics scripts, no advertising, no tracking cookies.
- **Accessible & Mobile-Friendly**: Semantic HTML5 markup, keyboard navigation support, and responsive layouts for screens from 320px up to 4K displays.
- **Configurable Google Play Button**: Clean separation of release parameters in `js/config.js` with an informative modal dialog while release is pending.

---

## Directory Structure

```text
whattowatch-website/
├── index.html              # Main landing page & shared link receiver
├── README.md               # Documentation & deployment instructions
├── css/
│   └── style.css           # Cinematic dark theme stylesheet
├── js/
│   ├── config.js           # Publish-time configuration settings
│   ├── i18n.js             # English & Russian translation dictionary
│   ├── share.js            # Client-side offline payload decompressor & preview
│   └── main.js             # Event wiring, modal management & initialization
└── assets/
    ├── logo.svg            # Cinematic vector logo
    ├── favicon.svg         # Browser tab icon
    └── google-play-badge.svg # Google Play Store vector icon
```

---

## How to Preview Locally

Because the website utilizes modern browser APIs (such as URL parameters, hash fragments, and the native `DecompressionStream` API for decoding compressed share payloads), it is best previewed through a local HTTP server rather than opening `file:///` directly.

### Option 1: Python 3 (Recommended)
Open a terminal inside the `whattowatch-website` directory and run:

```bash
cd whattowatch-website
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Node.js (`npx serve`)
```bash
cd whattowatch-website
npx serve .
```

### Option 3: VS Code / Android Studio Live Server
If using VS Code or an IDE plugin like *Live Server*, right-click `whattowatch-website/index.html` and select **Open with Live Server**.

---

## How to Deploy to GitHub Pages

The repository URL is:
`https://github.com/Vito2211/WhatoToWatch`

On GitHub Pages, a project repository is hosted under a subpath by default:
`https://vito2211.github.io/WhatoToWatch/`

### Deployment Options

#### Option A: Dedicated `gh-pages` branch
1. Push the contents of `whattowatch-website/` to a `gh-pages` branch on the repository.
2. In the repository settings on GitHub:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose the `gh-pages` branch and `/ (root)`.
   - Click **Save**.

#### Option B: GitHub Actions Workflow
Create a `.github/workflows/deploy-pages.yml` file in your repository:
```yaml
name: Deploy Static Website to GitHub Pages

on:
  push:
    branches: ["master"]
    paths:
      - "whattowatch-website/**"

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'whattowatch-website'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Relative Path Consistency
All resource links in `index.html` use relative paths (`./css/style.css`, `./js/...`, `./assets/...`). This guarantees that the site functions identically whether served from:
- A root domain: `https://example.com/`
- A local server: `http://localhost:8080/`
- A GitHub Pages project subpath: `https://vito2211.github.io/WhatoToWatch/`

---

## Configuration & Publish-Time Values

When the Android app is published to the Google Play Store, update the following values in **`whattowatch-website/js/config.js`**:

```javascript
window.APP_CONFIG = {
  // Update with your real Google Play Store URL once live:
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.vp.whattowatch",

  // Set to true once the listing is active
  isPublished: true,

  // App Links domain (see below if configuring a verified domain)
  appLinksDomain: "https://your-custom-domain.com"
};
```

### Behavior Before vs After Publishing
- **Before Publishing (`googlePlayUrl: null`)**: Clicking the "Get it on Google Play" button displays a modal window informing the user that the app is in release preparation, displaying the package name (`com.vp.whattowatch`) and providing a direct link to the GitHub repository for preview APKs and source code.
- **After Publishing (`googlePlayUrl: "https://..."`)**: Clicking the button directly redirects the user to the live Google Play Store listing.

---

## Android App Links & GitHub Pages: Technical Implications

### Deep Links vs. Android App Links

1. **Custom Deep Links (`whattowatch://share/...`)**:
   - The Android app registers the `whattowatch` URI scheme in `app/src/main/AndroidManifest.xml`:
     ```xml
     <intent-filter>
         <action android:name="android.intent.action.VIEW" />
         <category android:name="android.intent.category.DEFAULT" />
         <category android:name="android.intent.category.BROWSABLE" />
         <data android:scheme="whattowatch" android:host="share" />
     </intent-filter>
     ```
   - When an Android user clicks a `whattowatch://share/...` link, the system directly opens the app (if installed).
   - **Limitation**: Web browsers, email clients, and social networks frequently block or fail to resolve custom non-HTTP schemes if the app is not installed.

2. **Android App Links (`https://...`)**:
   - Universal links that use regular `https://` URLs.
   - If the app is installed and verified, the OS opens the app directly without showing an "Open with..." dialog.
   - If the app is **not** installed, the link opens in the web browser, bringing the user to this landing page.

### Implications of Hosting on GitHub Pages (`github.io`)

Android App Links enforce strict domain verification via Digital Asset Links:
The verification file **must** be served with `Content-Type: application/json` at:
`https://<domain>/.well-known/assetlinks.json`

Because GitHub Pages hosts project sites under a subpath (`https://vito2211.github.io/WhatoToWatch/`), the domain is `vito2211.github.io`.

- **Root Domain Requirement**: Android verification checks `https://vito2211.github.io/.well-known/assetlinks.json`. It **does not** look inside `https://vito2211.github.io/WhatoToWatch/.well-known/assetlinks.json`.
- **Shared Domain Consequence**: If the root repository `vito2211.github.io` is used, the verification file there affects the entire GitHub account domain.

### Recommendation for Production App Links
1. **Custom Domain**:
   Configure a dedicated custom domain (e.g. `whattowatch.app` or `watch.yourdomain.com`) in the GitHub Pages repository settings.
2. **Host `.well-known/assetlinks.json`**:
   Deploy the asset links verification file at the domain root:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.vp.whattowatch",
       "sha256_cert_fingerprints": [
         "YOUR_RELEASE_KEYSTORE_SHA256_FINGERPRINT_HERE"
       ]
     }
   }]
   ```
3. **Update AndroidManifest.xml**:
   Once the domain is verified, add `android:autoVerify="true"` and the HTTPS intent-filter to `AndroidManifest.xml`:
   ```xml
   <intent-filter android:autoVerify="true">
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:scheme="https" android:host="your-custom-domain.com" android:pathPrefix="/share" />
   </intent-filter>
   ```

Until this verification step is completed with a verified domain, the website honestly documents that incoming links can be opened via the app's `whattowatch://` scheme or inspected directly on the website.

---

## Testing Shared Payloads

You can test the website's offline decompressor by appending the payload to the URL or by pasting a payload/link into the input box on the page.

### Supported Link & Input Formats:
1. **HTTPS Hash Fragment** (preserves payload client-side without sending to server logs):
   - `https://vito2211.github.io/WhatoToWatch/#share/<payload>`
   - `https://vito2211.github.io/WhatoToWatch/#/share/<payload>`
   - `https://vito2211.github.io/WhatoToWatch/#data=<payload>`
   - `https://vito2211.github.io/WhatoToWatch/#share=<payload>`
2. **HTTPS Query Parameter**:
   - `https://vito2211.github.io/WhatoToWatch/?data=<payload>`
   - `https://vito2211.github.io/WhatoToWatch/?share=<payload>`
3. **Android Deep Link Scheme**:
   - `whattowatch://share/<payload>`
   - `whattowatch://share?data=<payload>`
4. **Raw Payload Code**:
   - Direct Base64 GZIP string pasted into the web previewer.

### Example Test Payloads:

#### Single Item (*Inception* - English):
```text
H4sIAAAAAAAAE32RUWvCMBSF_0rIs9p1MoW-ieu2gG4Puu1BZGTptQm0SUlu14nsv--2Ft1AzEvgnJvvcE8O_At8MM7yJB5w3FfAE74Sz4-L9EOs0yUn0WDRqsIqqLAdHXDlLILFwJPNgZuM3Ph2fH12fWQvX95ESmojUekVSqwJwt9n6_lTek86fCN4K4tXX5CuEauQRFHTNCNTZp8j5cqoC4kQ4_H0bjKZRPQqg6C8OSYmfMZQG9ixRjsWEGQRmHK-cl4isADKAwYa8a7ONd3A6gDM7VjmQZbDoKU3NmcISltXuHw_arcgDyGbIRU1vTmfAa-r7KLzs6VX5OTOG_jTFGkxAa0su66VGT6YKwEdpg7oyoUJXePbU6fz__heFef_6PP34hTc4goCCYSyh7ULXwr-BRh_2u8cAgAA
```

#### Single Item with Russian Text (*Интерстеллар*):
```text
H4sIAAAAAAAAE5VQzUrDQBh8lbjnRtpKifZWatBAq4cGPUiRkCw20Pyw2ShShFQFLz6ACL158BjEQrW2z_DtGzmJIhWKIMuy7Mz3zQwzYudcJH4UsmatwuRlzFmT9ayDvY55atlmlwH05bBA6YEW6pqmKlPj4qU5Tq4yjLhRKHkoE9Y8GTHfw7BI9dq_du0v6-7hkWUCvXCkO-hJR6YQZcctu71v7gL3eOIKP5ZlYkYTiNyoO1rQUle3lJcueekxAzxVY3qnGb1pIGc0V_f0odGjysAWM0vAyES5BqVlEQlK-aZGz4j4ivuiso0io-CO5F5LoiVjp143qsb2VqPaqLA09tYyV31sgTmLhM9XegGmixSSoROUxTz9Do24-R-GpWyayCjo-EnZd_-nwfaqHeAhJizJg-9vMnDEOsVPzWtnEgICAAA
```

When decoded, the website renders the title, content type, viewing status, personal notes, and category badges—entirely within local browser memory with zero network requests.
