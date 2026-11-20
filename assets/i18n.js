/* Shared i18n runtime for 6 languages
 * Languages: English (en), Japanese (ja), Simplified Chinese (zh-CN), Korean (ko), French (fr), Spanish (es)
 * Behavior:
 *  - Reads preferred language from localStorage (key: i18n_lang)
 *  - On first visit, picks from browser languages if supported; else defaults to 'en'
 *  - Applies translations for elements with [data-i18n]
 *  - Updates <html lang> and document.title when applicable
 *  - Adds a floating language switcher with persistence
 */
(function () {
  var STORAGE_KEY = 'i18n_lang';
  var SUPPORTED = ['en','ja','zh-CN','ko','fr','es'];

  // Map language+region to our supported list
  function normalizeLang(raw) {
    if (!raw) return 'en';
    var s = String(raw).trim();
    if (!s) return 'en';
    s = s.replace('_','-');
    var lower = s.toLowerCase();
    // language-only
    var base = lower.split('-')[0];
    if (base === 'zh') return 'zh-CN';
    if (base === 'en') return 'en';
    if (base === 'ja') return 'ja';
    if (base === 'ko') return 'ko';
    if (base === 'fr') return 'fr';
    if (base === 'es') return 'es';
    // Fallback to English
    return 'en';
  }

  function detectInitialLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) {}
    var candidates = [];
    if (Array.isArray(navigator.languages)) candidates = navigator.languages.slice();
    else if (navigator.language) candidates = [navigator.language];
    for (var i = 0; i < candidates.length; i++) {
      var n = normalizeLang(candidates[i]);
      if (SUPPORTED.indexOf(n) !== -1) return n;
    }
    return 'en';
  }

  var translations = {
    en: {
      page_removed_title: 'Page removed',
      site_removed_text: 'This site has been removed.',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국어',
      lang_fr: 'Français',
      lang_es: 'Español'
    },
    ja: {
      page_removed_title: 'ページは削除されました',
      site_removed_text: 'このサイトは削除されました。',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국語',
      lang_fr: 'Français',
      lang_es: 'Español'
    },
    'zh-CN': {
      page_removed_title: '页面已被删除',
      site_removed_text: '此网站已被删除。',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국어',
      lang_fr: 'Français',
      lang_es: 'Español'
    },
    ko: {
      page_removed_title: '페이지가 삭제되었습니다',
      site_removed_text: '이 사이트는 삭제되었습니다.',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국어',
      lang_fr: 'Français',
      lang_es: 'Español'
    },
    fr: {
      page_removed_title: 'Page supprimée',
      site_removed_text: 'Ce site a été supprimé.',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국어',
      lang_fr: 'Français',
      lang_es: 'Español'
    },
    es: {
      page_removed_title: 'Página eliminada',
      site_removed_text: 'Este sitio ha sido eliminado.',
      lang_en: 'English',
      lang_ja: '日本語',
      lang_zh: '简体中文',
      lang_ko: '한국어',
      lang_fr: 'Français',
      lang_es: 'Español'
    }
  };

  function applyTranslations(lang) {
    var dict = translations[lang] || translations.en;
    // Update lang attribute
    try { document.documentElement.setAttribute('lang', lang); } catch (_) {}
    // Elements with data-i18n
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach ? nodes.forEach(updateNode) : Array.prototype.forEach.call(nodes, updateNode);
    function updateNode(el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var text = dict[key] || translations.en[key];
      if (typeof text === 'string') {
        // For <title> we should also set document.title
        if (el.tagName && el.tagName.toLowerCase() === 'title') {
          el.textContent = text;
          try { document.title = text; } catch (_) {}
        } else {
          el.textContent = text;
        }
      }
    }
  }

  function persist(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function currentLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) {}
    return detectInitialLang();
  }

  function makeSwitcher(lang) {
    var root = document.createElement('div');
    root.className = 'i18n-switcher';
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', 'Language');

    var order = ['en','ja','zh-CN','ko','fr','es'];
    for (var i = 0; i < order.length; i++) {
      var code = order[i];
      var labelKey = (
        code === 'en' ? 'lang_en' :
        code === 'ja' ? 'lang_ja' :
        code === 'zh-CN' ? 'lang_zh' :
        code === 'ko' ? 'lang_ko' :
        code === 'fr' ? 'lang_fr' : 'lang_es'
      );
      var label = (translations[lang] && translations[lang][labelKey]) || translations.en[labelKey] || code;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.setAttribute('data-lang', code);
      if (code === lang) btn.setAttribute('aria-current','true');
      btn.addEventListener('click', function (ev) {
        var newLang = ev.currentTarget.getAttribute('data-lang');
        if (!newLang || SUPPORTED.indexOf(newLang) === -1) return;
        if (newLang === currentLang()) return;
        persist(newLang);
        // Rerender labels on the switcher itself using the new language
        applyTranslations(newLang);
        try { document.querySelectorAll('.i18n-switcher button').forEach(function (b) { b.removeAttribute('aria-current'); }); } catch (_) {}
        try { ev.currentTarget.setAttribute('aria-current','true'); } catch (_) {}
        // Also update button labels to match new language (rebuild)
        try {
          var parent = root.parentNode;
          if (parent) { parent.removeChild(root); parent.appendChild(makeSwitcher(newLang)); }
        } catch (_) {}
      });
      root.appendChild(btn);
    }
    return root;
  }

  function init() {
    var lang = currentLang();
    // If there was no saved value, persist detection now to avoid flip-flop later
    try { if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    applyTranslations(lang);
    // Insert switcher at the end of body to avoid overlaying initial layout calc
    try { document.body.appendChild(makeSwitcher(lang)); } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
