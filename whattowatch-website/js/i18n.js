/**
 * What to Watch? - Internationalization (English & Russian)
 * Pure vanilla JavaScript translation system.
 */
window.I18N = {
  currentLang: "en",

  translations: {
    en: {
      // Document
      pageTitle: "What to Watch? — Cinematic Personal Library for Android",
      metaDescription: "Organize movies, series, and custom watchlists with a dark cinematic visual identity. 100% offline, privacy-first Android application.",

      // Navigation
      navFeatures: "Features",
      navShared: "Shared Links",
      navPrivacy: "Privacy & Offline",
      navFaq: "FAQ",
      navGetApp: "Get the App",
      navGithub: "GitHub Repo",

      // Hero
      heroBadge: "Android Application",
      heroTitle: "Your Personal Cinema Library",
      heroSubtitle: "Organize films, series, and curated watchlists with zero friction. Built with a dark cinematic visual identity, restrained amber accents, and 100% offline privacy.",
      heroBtnPlay: "Get on Google Play",
      heroBtnShared: "Explore Shared Links",
      heroBtnGithub: "View on GitHub",

      // Mockup Card
      mockupHeader: "Library Preview",
      mockupItem1Title: "Inception (2010)",
      mockupItem1Type: "Movie",
      mockupItem1Status: "Watched",
      mockupItem1Notes: "Christopher Nolan mind-bender. Mind-blowing sound design.",
      mockupItem2Title: "Severance (Season 2)",
      mockupItem2Type: "Series",
      mockupItem2Status: "Watching",
      mockupItem2Notes: "Episode 4 next up. Unbelievable cinematography.",
      mockupItem3Title: "Dune: Part Two",
      mockupItem3Type: "Movie",
      mockupItem3Status: "Not Watched",
      mockupItem3Notes: "Recommended by Alex. IMAX 70mm cut.",
      mockupBadgeOffline: "100% Local Storage",

      // Features Section
      featuresTitle: "Crafted for True Film Enthusiasts",
      featuresSubtitle: "Everything you need to catalog, track, and share your cinematic journey without clutter or surveillance.",
      feat1Title: "Cinematic Organization",
      feat1Desc: "Catalog films, TV shows, and video links with custom categories, detailed personal impressions, and clear watch statuses.",
      feat2Title: "Thematic Collections",
      feat2Desc: "Create tailored lists like \"Weekend Marathon\", \"Director Retrospectives\", or \"Recommendations from Friends\".",
      feat3Title: "Peer-to-Peer Sharing",
      feat3Desc: "Share single titles or complete collections directly via lightweight data links or portable files. No cloud accounts required.",
      feat4Title: "Offline & Private by Design",
      feat4Desc: "Your database stays strictly on your device. Zero telemetry, no ads, no trackers, and no mandatory cloud registration.",

      // Shared Links Section
      sharedTitle: "Received a Shared Link?",
      sharedSubtitle: "Someone shared a movie or collection with you. Here is how What to Watch? handles shared links with complete privacy.",
      sharedExplanationTitle: "How Shared Links Work",
      sharedExplanationText: "When someone shares a movie or collection from What to Watch?, the data is compressed into a compact, self-contained payload. There is no central server holding your data — it travels directly between you and the sender.",
      sharedNoAppNote: "If you don't have the What to Watch? app installed yet, you can preview the contents of your link below or install the app to import it into your personal library.",
      sharedInputLabel: "Paste a shared link or payload code here:",
      sharedInputPlaceholder: "whattowatch://share/... or payload string",
      sharedBtnDecode: "Preview Shared Content",
      sharedBtnClear: "Clear",
      sharedPrivacyBadge: "Privacy Guarantee: Decompressed entirely in your browser memory. Never uploaded to any server.",

      // Shared Preview Active State
      previewTitle: "Shared Content Preview",
      previewTypeItem: "Single Content Item",
      previewTypeList: "Custom Collection",
      previewItemsCount: "Items in payload: ",
      previewCategoriesCount: "Categories included: ",
      previewOpenAppBtn: "Open in App (whattowatch://)",
      previewAppNotInstalledBtn: "Install App to Import",
      previewInvalidPayload: "Could not decode this shared link. Please ensure the full link was copied.",
      previewEmptyPayload: "This shared link contains no items.",
      previewSuccessNotice: "Payload safely decoded in local browser memory.",

      // Content Types & Statuses
      typeMovie: "Movie",
      typeSeries: "Series",
      typeVideo: "Video",
      typeOther: "Other",
      statusNotWatched: "Not Watched",
      statusWatching: "Watching",
      statusWatched: "Watched",

      // Technical & FAQ Section
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Transparent details on architecture, data privacy, and upcoming releases.",
      faq1Question: "Why doesn't the website automatically open the Android app yet?",
      faq1Answer: "Android App Links require domain ownership verification via a digital asset file (assetlinks.json) hosted on a production HTTPS domain. GitHub Pages project sites (github.io) do not automatically enable universal app links without specific root domain configuration. Direct in-app importing works via the whattowatch:// deep link scheme once installed.",
      faq2Question: "Where is my movie data stored?",
      faq2Answer: "100% locally on your Android device using SQLite and Room. What to Watch? has no remote database, no user accounts, and no background tracking. Your data is yours alone.",
      faq3Question: "Can I backup or transfer my watchlists?",
      faq3Answer: "Yes. The app includes built-in JSON backup and restore capabilities, as well as exportable .whattowatch files that can be sent over any messenger, email, or drive.",
      faq4Question: "When will the app be available on Google Play?",
      faq4Answer: "The app is currently in preparation for release. You can monitor the open-source repository on GitHub for APK releases and announcement of the Google Play Store listing.",

      // Download / CTA Section
      ctaTitle: "Ready to curate your cinema journey?",
      ctaSubtitle: "Download What to Watch? for Android and experience cinema organization the way it was meant to be.",
      ctaGooglePlay: "Get it on Google Play",
      ctaSourceCode: "Source Code on GitHub",

      // Modal
      modalTitle: "Google Play Release Coming Soon",
      modalBody: "What to Watch? is currently finalizing its release pipeline for the Google Play Store. The application package name is com.vp.whattowatch.",
      modalFollow: "In the meantime, you can follow progress, view source code, and download preview builds directly from the GitHub repository:",
      modalBtnGithub: "Go to GitHub Repository",
      modalBtnClose: "Close",

      // Footer
      footerTagline: "Cinematic personal library for Android.",
      footerNotice: "Free & Open Source. No backend, no cookies, no tracking scripts, no third-party APIs.",
      footerCopyright: "What to Watch? Project. All rights reserved."
    },

    ru: {
      // Document
      pageTitle: "Что посмотреть? — Персональная синематека для Android",
      metaDescription: "Организуйте фильмы, сериалы и списки для просмотра в стильном тёмном кинематографичном интерфейсе. 100% оффлайн и приватность для Android.",

      // Navigation
      navFeatures: "Возможности",
      navShared: "Общие ссылки",
      navPrivacy: "Приватность",
      navFaq: "Частые вопросы",
      navGetApp: "Скачать приложение",
      navGithub: "Репозиторий GitHub",

      // Hero
      heroBadge: "Приложение для Android",
      heroTitle: "Ваша личная синематека",
      heroSubtitle: "Удобный каталог фильмов, сериалов и персональных списков просмотра. Кинематографичный тёмный интерфейс с янтарными акцентами и полная оффлайн-приватность.",
      heroBtnPlay: "Доступно в Google Play",
      heroBtnShared: "Проверить общую ссылку",
      heroBtnGithub: "Проект на GitHub",

      // Mockup Card
      mockupHeader: "Предпросмотр библиотеки",
      mockupItem1Title: "Начало (2010)",
      mockupItem1Type: "Фильм",
      mockupItem1Status: "Просмотрено",
      mockupItem1Notes: "Шедевр Кристофера Нолана. Потрясающий саундтрек.",
      mockupItem2Title: "Разделение (2 сезон)",
      mockupItem2Type: "Сериал",
      mockupItem2Status: "Смотрю",
      mockupItem2Notes: "На 4 серии. Невероятный визуальный стиль и интрига.",
      mockupItem3Title: "Дюна: Часть вторая",
      mockupItem3Type: "Фильм",
      mockupItem3Status: "Не просмотрено",
      mockupItem3Notes: "Рекомендация от Саши. Смотреть в IMAX 70mm.",
      mockupBadgeOffline: "100% Локальное хранение",

      // Features Section
      featuresTitle: "Создано для настоящих ценителей кино",
      featuresSubtitle: "Всё необходимое для каталогизации, отслеживания просмотров и обмена рекомендациями без слежки и рекламы.",
      feat1Title: "Кинематографичный каталог",
      feat1Desc: "Ведите учет фильмов, сериалов и видео с персональными категориями, личными впечатлениями и статусами просмотра.",
      feat2Title: "Тематические подборки",
      feat2Desc: "Создавайте гибкие списки: «Марафон на выходные», «Ретроспектива режиссера» или «Советы друзей».",
      feat3Title: "Прямой обмен ссылками",
      feat3Desc: "Делитесь отдельными фильмами или целыми коллекциями через компактные автономные ссылки или файлы. Без облачных аккаунтов.",
      feat4Title: "Оффлайн и приватность",
      feat4Desc: "Все данные хранятся исключительно на вашем устройстве. Никакой телеметрии, рекламы, трекеров и принудительных регистраций.",

      // Shared Links Section
      sharedTitle: "Получили ссылку на фильм или список?",
      sharedSubtitle: "Вам отправили рекомендацию или подборку. Вот как «Что посмотреть?» обрабатывает общие данные с абсолютной приватностью.",
      sharedExplanationTitle: "Как работают общие ссылки",
      sharedExplanationText: "При отправке фильма или коллекции из приложения данные упаковываются в компактный автономный пакет. Никакой сервер не хранит ваши данные — они передаются напрямую от отправителя к получателю.",
      sharedNoAppNote: "Если у вас еще не установлено приложение «Что посмотреть?», вы можете просмотреть содержимое ссылки прямо здесь или установить приложение для импорта в свою библиотеку.",
      sharedInputLabel: "Вставьте общую ссылку или код пакета сюда:",
      sharedInputPlaceholder: "whattowatch://share/... или строка данных",
      sharedBtnDecode: "Просмотреть содержимое",
      sharedBtnClear: "Очистить",
      sharedPrivacyBadge: "Гарантия приватности: данные распаковываются исключительно в памяти вашего браузера и никогда не отправляются на сервер.",

      // Shared Preview Active State
      previewTitle: "Содержимое общей ссылки",
      previewTypeItem: "Элемент библиотеки",
      previewTypeList: "Пользовательская коллекция",
      previewItemsCount: "Элементов в пакете: ",
      previewCategoriesCount: "Категорий: ",
      previewOpenAppBtn: "Открыть в приложении (whattowatch://)",
      previewAppNotInstalledBtn: "Установить приложение для импорта",
      previewInvalidPayload: "Не удалось расшифровать ссылку. Убедитесь, что скопировали её целиком.",
      previewEmptyPayload: "В полученном пакете нет записей.",
      previewSuccessNotice: "Данные безопасно распакованы локально в браузере.",

      // Content Types & Statuses
      typeMovie: "Фильм",
      typeSeries: "Сериал",
      typeVideo: "Видео",
      typeOther: "Другое",
      statusNotWatched: "Не просмотрено",
      statusWatching: "Смотрю",
      statusWatched: "Просмотрено",

      // Technical & FAQ Section
      faqTitle: "Часто задаваемые вопросы",
      faqSubtitle: "Прозрачная информация об архитектуре, приватности данных и планах публикации.",
      faq1Question: "Почему сайт пока не открывает Android-приложение автоматически?",
      faq1Answer: "Механизм Android App Links требует верификации владения доменом через специальный файл (assetlinks.json), размещенный на рабочем HTTPS-домене. Проектные сайты GitHub Pages (github.io) не поддерживают автоматические ссылки приложений без настройки корневого домена. Прямой импорт работает через схему whattowatch:// после установки приложения.",
      faq2Question: "Где хранятся мои данные о фильмах?",
      faq2Answer: "Исключительно на вашем Android-устройстве в локальной базе данных SQLite (Room). У приложения нет удаленного сервера, учетных записей пользователей и фоновой телеметрии. Ваши данные принадлежат только вам.",
      faq3Question: "Можно ли сделать резервную копию или перенести библиотеку?",
      faq3Answer: "Да. В приложении есть функции резервного копирования в JSON, а также экспорт в файлы .whattowatch, которые можно передавать через любые мессенджеры, почту или накопители.",
      faq4Question: "Когда приложение появится в Google Play?",
      faq4Answer: "Приложение готовится к публикации в Google Play Store. Следить за обновлениями, скачивать тестовые сборки (APK) и исходный код можно в официальном репозитории на GitHub.",

      // Download / CTA Section
      ctaTitle: "Готовы навести порядок в фильмах?",
      ctaSubtitle: "Установите «Что посмотреть?» для Android и управляйте своей синематекой легко и красиво.",
      ctaGooglePlay: "Доступно в Google Play",
      ctaSourceCode: "Исходный код на GitHub",

      // Modal
      modalTitle: "Скоро в Google Play",
      modalBody: "Приложение «Что посмотреть?» находится на этапе подготовки к релизу в Google Play Store. Идентификатор пакета приложения: com.vp.whattowatch.",
      modalFollow: "Следить за разработкой, загрузить APK-файлы и изучить исходный код можно в репозитории на GitHub:",
      modalBtnGithub: "Перейти к репозиторию на GitHub",
      modalBtnClose: "Закрыть",

      // Footer
      footerTagline: "Персональная синематека для Android.",
      footerNotice: "Свободное и открытое ПО. Без бэкенда, файлов cookie, трекеров и сторонних API.",
      footerCopyright: "Проект «Что посмотреть?». Все права защищены."
    }
  },

  /**
   * Initializes language based on localStorage or browser navigator.language
   */
  init() {
    const saved = localStorage.getItem("wtw_language");
    if (saved && (saved === "en" || saved === "ru")) {
      this.currentLang = saved;
    } else {
      const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
      this.currentLang = browserLang.startsWith("ru") ? "ru" : "en";
    }
    this.applyLanguage(this.currentLang);
  },

  /**
   * Sets active language and updates DOM elements
   */
  setLanguage(lang) {
    if (lang !== "en" && lang !== "ru") return;
    this.currentLang = lang;
    try {
      localStorage.setItem("wtw_language", lang);
    } catch (e) {
      // Ignore localStorage failure in restricted contexts
    }
    this.applyLanguage(lang);
  },

  /**
   * Translates key or returns fallback
   */
  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    return dict[key] || this.translations.en[key] || key;
  },

  /**
   * Updates all DOM nodes with data-i18n, data-i18n-placeholder, and page title
   */
  applyLanguage(lang) {
    document.documentElement.lang = lang;

    // Update document title and meta description
    document.title = this.t("pageTitle");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", this.t("metaDescription"));
    }

    // Update text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translation = this.t(key);
      if (translation) {
        el.setAttribute("placeholder", translation);
      }
    });

    // Update aria labels
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      const translation = this.t(key);
      if (translation) {
        el.setAttribute("aria-label", translation);
      }
    });

    // Update language switch buttons
    document.querySelectorAll(".lang-switch-btn").forEach(btn => {
      const btnLang = btn.getAttribute("data-lang");
      if (btnLang === lang) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    // Re-render payload preview if already active
    if (window.wtwShareManager && window.wtwShareManager.hasDecodedPayload()) {
      window.wtwShareManager.renderCurrentPayload();
    }
  }
};
