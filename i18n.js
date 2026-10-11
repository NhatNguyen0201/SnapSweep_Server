/*!
 * SnapSweep – lightweight client-side i18n (vanilla JS, no dependencies)
 *
 * Usage in HTML (put in <head>):
 *   <script src="i18n.js" defer></script>
 *
 * Markup attributes:
 *   data-i18n="key"                    -> sets element.textContent
 *   data-i18n-html="key"               -> sets element.innerHTML (trusted strings only)
 *   data-i18n-attr="attr:key; a2:k2"   -> sets attributes (content, aria-label, placeholder, ...)
 *   <select data-lang-select>          -> auto-populated and wired up as a language picker
 *
 * Public API (window.i18n and window.switchLanguage):
 *   switchLanguage('vi')   -> switches, saves, and re-renders; returns true/false
 *   i18n.getLanguage()     -> current language code
 *   i18n.t('key')          -> translated string for the current language
 *   document event 'i18n:change' fires after every switch (detail: { lang })
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. Configuration
   * ------------------------------------------------------------------ */
  var STORAGE_KEY = 'snapsweep_lang';
  var DEFAULT_LANG = 'en';

  // Display names are written in their own language (shown in the dropdown).
  var LANGUAGES = {
    en: 'English',
    vi: 'Tiếng Việt',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
    zh: '简体中文'
  };

  // Value used for <html lang="..."> (zh needs the script subtag for Simplified).
  var HTML_LANG = { zh: 'zh-Hans' };

  /* ------------------------------------------------------------------ *
   * 2. Translation dictionary
   *    Add a key to ALL languages. Missing keys fall back to English.
   * ------------------------------------------------------------------ */
  var translations = {
    /* ============================ English ============================ */
    en: {
      lang_label: 'Language',

      // Page titles
      title_index: 'SnapSweep – Free up phone storage',
      title_privacy: 'Privacy Policy – SnapSweep',
      title_terms: 'Terms of Service – SnapSweep',

      // Navigation / footer
      nav_home: 'Home',
      nav_features: 'Features',
      nav_privacy: 'Privacy Policy',
      nav_terms: 'Terms of Service',
      footer_rights: 'All rights reserved.',

      // Hero
      hero_title: 'Clean up your phone in a few swipes',
      hero_subtitle: 'SnapSweep finds duplicates, blurry shots, and clutter so you can reclaim storage in minutes.',
      cta_download: 'Get SnapSweep',
      cta_features: 'See features',

      // Features
      features_title: 'Everything you need to free up space',
      feat1_title: 'Smart duplicate finder',
      feat1_desc: 'Spot identical and near-identical photos automatically and keep only the best one.',
      feat2_title: 'Swipe to sweep',
      feat2_desc: 'Review photos one by one. Swipe to keep or delete — it\u2019s that simple.',
      feat3_title: 'Private by design',
      feat3_desc: 'Your photos are analyzed on your device and never uploaded to our servers.',
      feat4_title: 'Storage insights',
      feat4_desc: 'See what\u2019s taking up space and how much you\u2019ve saved.',

      // Legal pages (shared)
      last_updated: 'Last updated',
      legal_notice: 'This translation is provided for convenience. If there is any discrepancy, the English version prevails.',

      // Privacy page sections
      privacy_s1: 'Information we collect',
      privacy_s2: 'How we use information',
      privacy_s3: 'Data sharing',
      privacy_s4: 'Your rights and choices',
      privacy_s5: 'Contact us',

      // Terms page sections
      terms_s1: 'Acceptance of terms',
      terms_s2: 'Use of the app',
      terms_s3: 'Intellectual property',
      terms_s4: 'Disclaimer and liability',
      terms_s5: 'Changes to these terms'
    },

    /* ============================ Tiếng Việt ============================ */
    vi: {
      lang_label: 'Ngôn ngữ',

      title_index: 'SnapSweep – Giải phóng dung lượng điện thoại',
      title_privacy: 'Chính sách quyền riêng tư – SnapSweep',
      title_terms: 'Điều khoản dịch vụ – SnapSweep',

      nav_home: 'Trang chủ',
      nav_features: 'Tính năng',
      nav_privacy: 'Chính sách quyền riêng tư',
      nav_terms: 'Điều khoản dịch vụ',
      footer_rights: 'Bảo lưu mọi quyền.',

      hero_title: 'Dọn dẹp điện thoại chỉ với vài lần vuốt',
      hero_subtitle: 'SnapSweep tìm ảnh trùng lặp, ảnh mờ và các tệp thừa để bạn lấy lại dung lượng chỉ trong vài phút.',
      cta_download: 'Tải SnapSweep',
      cta_features: 'Xem tính năng',

      features_title: 'Mọi thứ bạn cần để giải phóng dung lượng',
      feat1_title: 'Tìm ảnh trùng lặp thông minh',
      feat1_desc: 'Tự động phát hiện ảnh giống hệt hoặc gần giống nhau và chỉ giữ lại bản đẹp nhất.',
      feat2_title: 'Vuốt để dọn dẹp',
      feat2_desc: 'Xem từng ảnh một. Vuốt để giữ lại hoặc xóa — đơn giản vậy thôi.',
      feat3_title: 'Riêng tư ngay từ thiết kế',
      feat3_desc: 'Ảnh của bạn được phân tích ngay trên thiết bị và không bao giờ được tải lên máy chủ của chúng tôi.',
      feat4_title: 'Thống kê dung lượng',
      feat4_desc: 'Xem thứ gì đang chiếm dung lượng và bạn đã tiết kiệm được bao nhiêu.',

      last_updated: 'Cập nhật lần cuối',
      legal_notice: 'Bản dịch này chỉ mang tính tham khảo. Nếu có sự khác biệt, bản tiếng Anh sẽ được ưu tiên áp dụng.',

      privacy_s1: 'Thông tin chúng tôi thu thập',
      privacy_s2: 'Cách chúng tôi sử dụng thông tin',
      privacy_s3: 'Chia sẻ dữ liệu',
      privacy_s4: 'Quyền và lựa chọn của bạn',
      privacy_s5: 'Liên hệ với chúng tôi',

      terms_s1: 'Chấp nhận điều khoản',
      terms_s2: 'Sử dụng ứng dụng',
      terms_s3: 'Quyền sở hữu trí tuệ',
      terms_s4: 'Tuyên bố miễn trừ và trách nhiệm pháp lý',
      terms_s5: 'Thay đổi các điều khoản này'
    },

    /* ============================ Español ============================ */
    es: {
      lang_label: 'Idioma',

      title_index: 'SnapSweep: libera espacio en tu móvil',
      title_privacy: 'Política de privacidad – SnapSweep',
      title_terms: 'Términos del servicio – SnapSweep',

      nav_home: 'Inicio',
      nav_features: 'Funciones',
      nav_privacy: 'Política de privacidad',
      nav_terms: 'Términos del servicio',
      footer_rights: 'Todos los derechos reservados.',

      hero_title: 'Limpia tu móvil con unos pocos deslizamientos',
      hero_subtitle: 'SnapSweep encuentra duplicados, fotos borrosas y desorden para que recuperes espacio en minutos.',
      cta_download: 'Obtener SnapSweep',
      cta_features: 'Ver funciones',

      features_title: 'Todo lo que necesitas para liberar espacio',
      feat1_title: 'Buscador inteligente de duplicados',
      feat1_desc: 'Detecta automáticamente fotos idénticas o casi idénticas y conserva solo la mejor.',
      feat2_title: 'Desliza para limpiar',
      feat2_desc: 'Revisa las fotos una a una. Desliza para conservar o eliminar: así de fácil.',
      feat3_title: 'Privacidad desde el diseño',
      feat3_desc: 'Tus fotos se analizan en tu dispositivo y nunca se suben a nuestros servidores.',
      feat4_title: 'Estadísticas de almacenamiento',
      feat4_desc: 'Descubre qué ocupa espacio y cuánto has liberado.',

      last_updated: 'Última actualización',
      legal_notice: 'Esta traducción se ofrece solo como cortesía. En caso de discrepancia, prevalece la versión en inglés.',

      privacy_s1: 'Información que recopilamos',
      privacy_s2: 'Cómo usamos la información',
      privacy_s3: 'Intercambio de datos',
      privacy_s4: 'Tus derechos y opciones',
      privacy_s5: 'Contáctanos',

      terms_s1: 'Aceptación de los términos',
      terms_s2: 'Uso de la aplicación',
      terms_s3: 'Propiedad intelectual',
      terms_s4: 'Exención de responsabilidad',
      terms_s5: 'Cambios en estos términos'
    },

    /* ============================ Français ============================ */
    fr: {
      lang_label: 'Langue',

      title_index: 'SnapSweep – Libérez de l\u2019espace sur votre téléphone',
      title_privacy: 'Politique de confidentialité – SnapSweep',
      title_terms: 'Conditions d\u2019utilisation – SnapSweep',

      nav_home: 'Accueil',
      nav_features: 'Fonctionnalités',
      nav_privacy: 'Politique de confidentialité',
      nav_terms: 'Conditions d\u2019utilisation',
      footer_rights: 'Tous droits réservés.',

      hero_title: 'Nettoyez votre téléphone en quelques glissements',
      hero_subtitle: 'SnapSweep repère les doublons, les photos floues et le superflu pour vous faire récupérer de l\u2019espace en quelques minutes.',
      cta_download: 'Obtenir SnapSweep',
      cta_features: 'Découvrir les fonctionnalités',

      features_title: 'Tout ce qu\u2019il faut pour libérer de l\u2019espace',
      feat1_title: 'Détecteur de doublons intelligent',
      feat1_desc: 'Repère automatiquement les photos identiques ou quasi identiques et ne garde que la meilleure.',
      feat2_title: 'Glissez pour nettoyer',
      feat2_desc: 'Passez vos photos en revue une à une. Glissez pour conserver ou supprimer : c\u2019est aussi simple que ça.',
      feat3_title: 'Confidentialité dès la conception',
      feat3_desc: 'Vos photos sont analysées sur votre appareil et ne sont jamais envoyées à nos serveurs.',
      feat4_title: 'Suivi du stockage',
      feat4_desc: 'Voyez ce qui occupe de la place et combien d\u2019espace vous avez récupéré.',

      last_updated: 'Dernière mise à jour',
      legal_notice: 'Cette traduction est fournie à titre informatif. En cas de divergence, la version anglaise prévaut.',

      privacy_s1: 'Informations que nous collectons',
      privacy_s2: 'Comment nous utilisons les informations',
      privacy_s3: 'Partage des données',
      privacy_s4: 'Vos droits et choix',
      privacy_s5: 'Nous contacter',

      terms_s1: 'Acceptation des conditions',
      terms_s2: 'Utilisation de l\u2019application',
      terms_s3: 'Propriété intellectuelle',
      terms_s4: 'Exclusion de garantie et responsabilité',
      terms_s5: 'Modifications des présentes conditions'
    },

    /* ============================ Deutsch ============================ */
    de: {
      lang_label: 'Sprache',

      title_index: 'SnapSweep – Speicherplatz auf dem Handy freigeben',
      title_privacy: 'Datenschutzerklärung – SnapSweep',
      title_terms: 'Nutzungsbedingungen – SnapSweep',

      nav_home: 'Startseite',
      nav_features: 'Funktionen',
      nav_privacy: 'Datenschutzerklärung',
      nav_terms: 'Nutzungsbedingungen',
      footer_rights: 'Alle Rechte vorbehalten.',

      hero_title: 'Räume dein Handy mit ein paar Wischern auf',
      hero_subtitle: 'SnapSweep findet Duplikate, unscharfe Fotos und Datenmüll, damit du in wenigen Minuten Speicherplatz zurückgewinnst.',
      cta_download: 'SnapSweep holen',
      cta_features: 'Funktionen ansehen',

      features_title: 'Alles, was du brauchst, um Speicherplatz freizugeben',
      feat1_title: 'Intelligente Duplikatsuche',
      feat1_desc: 'Erkennt identische und nahezu identische Fotos automatisch und behält nur das beste.',
      feat2_title: 'Wischen zum Aufräumen',
      feat2_desc: 'Sieh dir Fotos nacheinander an. Wische, um zu behalten oder zu löschen – ganz einfach.',
      feat3_title: 'Datenschutz von Anfang an',
      feat3_desc: 'Deine Fotos werden auf deinem Gerät analysiert und niemals auf unsere Server hochgeladen.',
      feat4_title: 'Speicher-Einblicke',
      feat4_desc: 'Sieh, was Speicherplatz belegt und wie viel du bereits gespart hast.',

      last_updated: 'Zuletzt aktualisiert',
      legal_notice: 'Diese Übersetzung dient nur als Serviceleistung. Bei Abweichungen gilt die englische Fassung.',

      privacy_s1: 'Welche Informationen wir erfassen',
      privacy_s2: 'Wie wir Informationen verwenden',
      privacy_s3: 'Weitergabe von Daten',
      privacy_s4: 'Deine Rechte und Wahlmöglichkeiten',
      privacy_s5: 'Kontakt',

      terms_s1: 'Annahme der Bedingungen',
      terms_s2: 'Nutzung der App',
      terms_s3: 'Geistiges Eigentum',
      terms_s4: 'Haftungsausschluss und Haftung',
      terms_s5: 'Änderungen dieser Bedingungen'
    },

    /* ============================ 日本語 ============================ */
    ja: {
      lang_label: '言語',

      title_index: 'SnapSweep – スマホのストレージを解放',
      title_privacy: 'プライバシーポリシー – SnapSweep',
      title_terms: '利用規約 – SnapSweep',

      nav_home: 'ホーム',
      nav_features: '機能',
      nav_privacy: 'プライバシーポリシー',
      nav_terms: '利用規約',
      footer_rights: '無断転載を禁じます。',

      hero_title: '数回スワイプするだけで、スマホをすっきり整理',
      hero_subtitle: 'SnapSweepは重複写真やブレた写真、不要なデータを見つけ、数分でストレージを取り戻します。',
      cta_download: 'SnapSweepを入手',
      cta_features: '機能を見る',

      features_title: 'ストレージを空けるために必要なすべて',
      feat1_title: 'スマートな重複検出',
      feat1_desc: '同一またはほぼ同じ写真を自動で見つけ、最も良い1枚だけを残します。',
      feat2_title: 'スワイプで整理',
      feat2_desc: '写真を1枚ずつ確認。スワイプして残すか削除するだけです。',
      feat3_title: 'プライバシーを最優先',
      feat3_desc: '写真はお使いのデバイス上で解析され、当社のサーバーにアップロードされることはありません。',
      feat4_title: 'ストレージ分析',
      feat4_desc: '何が容量を使っているか、どれだけ節約できたかがひと目でわかります。',

      last_updated: '最終更新日',
      legal_notice: 'この翻訳は参考用です。内容に相違がある場合は、英語版が優先されます。',

      privacy_s1: '収集する情報',
      privacy_s2: '情報の利用方法',
      privacy_s3: 'データの共有',
      privacy_s4: 'お客様の権利と選択',
      privacy_s5: 'お問い合わせ',

      terms_s1: '規約への同意',
      terms_s2: 'アプリの利用',
      terms_s3: '知的財産権',
      terms_s4: '免責事項および責任',
      terms_s5: '本規約の変更'
    },

    /* ============================ 简体中文 ============================ */
    zh: {
      lang_label: '语言',

      title_index: 'SnapSweep – 释放手机存储空间',
      title_privacy: '隐私政策 – SnapSweep',
      title_terms: '服务条款 – SnapSweep',

      nav_home: '首页',
      nav_features: '功能',
      nav_privacy: '隐私政策',
      nav_terms: '服务条款',
      footer_rights: '保留所有权利。',

      hero_title: '轻轻几下滑动，清爽整理手机',
      hero_subtitle: 'SnapSweep 可找出重复照片、模糊照片和多余文件，几分钟内帮你腾出存储空间。',
      cta_download: '获取 SnapSweep',
      cta_features: '查看功能',

      features_title: '释放存储空间所需的一切',
      feat1_title: '智能重复项查找',
      feat1_desc: '自动识别相同或近似的照片，只保留最好的一张。',
      feat2_title: '滑动清理',
      feat2_desc: '逐张查看照片，滑动即可保留或删除，就这么简单。',
      feat3_title: '隐私优先的设计',
      feat3_desc: '照片仅在你的设备上分析，绝不会上传到我们的服务器。',
      feat4_title: '存储空间洞察',
      feat4_desc: '查看哪些内容占用了空间，以及你已节省了多少。',

      last_updated: '最后更新',
      legal_notice: '本译文仅供参考。如有出入，以英文版为准。',

      privacy_s1: '我们收集的信息',
      privacy_s2: '我们如何使用信息',
      privacy_s3: '数据共享',
      privacy_s4: '你的权利与选择',
      privacy_s5: '联系我们',

      terms_s1: '接受条款',
      terms_s2: '应用的使用',
      terms_s3: '知识产权',
      terms_s4: '免责声明与责任',
      terms_s5: '条款变更'
    }
  };

  /* ------------------------------------------------------------------ *
   * 3. Helpers
   * ------------------------------------------------------------------ */
  var currentLang = DEFAULT_LANG;

  function isSupported(code) {
    return Object.prototype.hasOwnProperty.call(translations, code);
  }

  // 'zh-CN' / 'zh_Hans' / 'ZH' -> 'zh'; returns null if unsupported.
  function normalize(code) {
    if (!code) return null;
    var c = String(code).toLowerCase().replace('_', '-');
    if (isSupported(c)) return c;
    var base = c.split('-')[0];
    return isSupported(base) ? base : null;
  }

  function readStored() {
    try { return normalize(window.localStorage.getItem(STORAGE_KEY)); }
    catch (e) { return null; } // storage blocked (private mode, etc.)
  }

  function writeStored(code) {
    try { window.localStorage.setItem(STORAGE_KEY, code); }
    catch (e) { /* ignore */ }
  }

  function readUrlParam() {
    try { return normalize(new URLSearchParams(window.location.search).get('lang')); }
    catch (e) { return null; }
  }

  function detectLanguage() {
    // Priority: ?lang=xx  >  saved choice  >  browser preference  >  default
    var fromUrl = readUrlParam();
    if (fromUrl) return fromUrl;

    var stored = readStored();
    if (stored) return stored;

    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage];
    for (var i = 0; i < prefs.length; i++) {
      var match = normalize(prefs[i]);
      if (match) return match;
    }
    return DEFAULT_LANG;
  }

  // Look up a key; fall back to English; return null if it doesn't exist at all.
  function t(key, lang) {
    var dict = translations[lang || currentLang];
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    var fallback = translations[DEFAULT_LANG];
    return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : null;
  }

  /* ------------------------------------------------------------------ *
   * 4. DOM updates
   * ------------------------------------------------------------------ */
  function applyTranslations(root) {
    root = root || document;

    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var text = t(nodes[i].getAttribute('data-i18n'));
      if (text !== null) nodes[i].textContent = text;
    }

    var htmlNodes = root.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlNodes.length; j++) {
      var html = t(htmlNodes[j].getAttribute('data-i18n-html'));
      if (html !== null) htmlNodes[j].innerHTML = html; // only ever your own strings
    }

    var attrNodes = root.querySelectorAll('[data-i18n-attr]');
    for (var k = 0; k < attrNodes.length; k++) {
      var pairs = attrNodes[k].getAttribute('data-i18n-attr').split(';');
      for (var p = 0; p < pairs.length; p++) {
        var parts = pairs[p].split(':');
        if (parts.length < 2) continue;
        var attr = parts[0].trim();
        var value = t(parts.slice(1).join(':').trim());
        if (attr && value !== null) attrNodes[k].setAttribute(attr, value);
      }
    }
  }

  function syncSelectors() {
    var selects = document.querySelectorAll('select[data-lang-select]');
    for (var i = 0; i < selects.length; i++) selects[i].value = currentLang;
  }

  function buildSelector(select) {
    // Populate options from LANGUAGES unless the page already supplies them.
    if (select.options.length < 2) {
      select.innerHTML = '';
      Object.keys(LANGUAGES).forEach(function (code) {
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = LANGUAGES[code];
        opt.lang = HTML_LANG[code] || code;
        select.appendChild(opt);
      });
    }
    select.value = currentLang;
    select.addEventListener('change', function () {
      switchLanguage(select.value);
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. Public API
   * ------------------------------------------------------------------ */
  function switchLanguage(langCode) {
    var code = normalize(langCode);
    if (!code) {
      if (window.console) console.warn('[i18n] Unsupported language:', langCode);
      return false;
    }
    currentLang = code;
    document.documentElement.lang = HTML_LANG[code] || code;
    writeStored(code);
    applyTranslations(document);
    syncSelectors();

    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: code } }));
    return true;
  }

  function init() {
    var selects = document.querySelectorAll('select[data-lang-select]');
    currentLang = detectLanguage();
    for (var i = 0; i < selects.length; i++) buildSelector(selects[i]);
    switchLanguage(currentLang);

    // Keep multiple open tabs in sync.
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        var code = normalize(e.newValue);
        if (code && code !== currentLang) switchLanguage(code);
      }
    });
  }

  window.switchLanguage = switchLanguage;
  window.i18n = {
    switchLanguage: switchLanguage,
    getLanguage: function () { return currentLang; },
    getSupportedLanguages: function () { return Object.assign({}, LANGUAGES); },
    t: function (key) { return t(key); },
    apply: applyTranslations // call after injecting new DOM: i18n.apply(container)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
