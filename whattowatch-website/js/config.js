/**
 * What to Watch? - Static Website Configuration
 * 
 * IMPORTANT: Update these values when preparing for production and publishing
 * the Android application on Google Play.
 */
window.APP_CONFIG = {
  // App Identifiers
  appNameEn: "What to Watch?",
  appNameRu: "Что посмотреть?",
  packageName: "com.vp.whattowatch",

  // GitHub Repository & Pages Information
  githubRepoUrl: "https://github.com/Vito2211/WhatoToWatch",
  githubPagesUrl: "https://vito2211.github.io/WhatoToWatch/",

  // Google Play Store Configuration
  // Set to the real Google Play Store URL once the app is published:
  // e.g. "https://play.google.com/store/apps/details?id=com.vp.whattowatch"
  // When null or empty, the site displays a "Coming Soon to Google Play" notification.
  googlePlayUrl: null,

  // App Release Status (true once live on Google Play)
  isPublished: false,

  // Android Deep Link Scheme (configured in AndroidManifest.xml)
  // Used for local app intents: whattowatch://share/<payload>
  deepLinkScheme: "whattowatch",
  deepLinkHost: "share",

  // Android App Links Domain (HTTP/HTTPS)
  // NOTE: Android App Links require a verified domain hosting:
  // https://<domain>/.well-known/assetlinks.json
  // Keep null until a custom domain or root GitHub Pages domain is verified.
  appLinksDomain: null
};
