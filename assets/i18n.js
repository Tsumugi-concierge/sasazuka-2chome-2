/* Shared i18n runtime for 6 languages
 * Languages: English (en), Japanese (ja), Simplified Chinese (zh-CN), Korean (ko), French (fr), Spanish (es)
 * Behavior:
 *  - Reads preferred language from localStorage (key: i18n_lang)
 *  - On first visit, picks from browser languages if supported; else defaults to 'en'
 *  - Applies translations for elements with [data-i18n]
 *  - Updates <html lang> and document.title when applicable
 *  - Builds a language switcher in [data-i18n-switcher]
 */
(function () {
  var STORAGE_KEY = 'i18n_lang';
  var LANGUAGE_LABELS = {
    en: 'English',
    ja: '日本語',
    'zh-CN': '简体中文',
    ko: '한국어',
    fr: 'Français',
    es: 'Español'
  };
  var SUPPORTED = Object.keys(LANGUAGE_LABELS);

  function detectInitialLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) {}

    var candidates = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (var i = 0; i < candidates.length; i++) {
      var base = String(candidates[i] || '').trim().toLowerCase().split(/[-_]/)[0];
      var lang = base === 'zh' ? 'zh-CN' : base;
      if (SUPPORTED.indexOf(lang) !== -1) return lang;
    }
    return 'en';
  }

  var translations = {
    en: {
      page_removed_title: 'Page removed',
      site_removed_text: 'This site has been removed.',
      switcher_label: 'Language'
    },
    ja: {
      page_removed_title: 'ページは削除されました',
      site_removed_text: 'このサイトは削除されました。',
      switcher_label: '言語'
    },
    'zh-CN': {
      page_removed_title: '页面已被删除',
      site_removed_text: '此网站已被删除。',
      switcher_label: '语言'
    },
    ko: {
      page_removed_title: '페이지가 삭제되었습니다',
      site_removed_text: '이 사이트는 삭제되었습니다.',
      switcher_label: '언어'
    },
    fr: {
      page_removed_title: 'Page supprimée',
      site_removed_text: 'Ce site a été supprimé.',
      switcher_label: 'Langue'
    },
    es: {
      page_removed_title: 'Página eliminada',
      site_removed_text: 'Este sitio ha sido eliminado.',
      switcher_label: 'Idioma'
    }
  };

  function applyTranslations(lang) {
    var dict = translations[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      var key = element.getAttribute('data-i18n');
      var text = dict[key] || translations.en[key];
      if (typeof text === 'string') element.textContent = text;
    });
  }

  function init() {
    var switcher = document.querySelector('[data-i18n-switcher]');
    var activeLang = detectInitialLang();
    try {
      if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, activeLang);
    } catch (_) {}

    function render() {
      applyTranslations(activeLang);
      if (!switcher) return;
      switcher.setAttribute('aria-label', translations[activeLang].switcher_label);
      switcher.querySelectorAll('button').forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.lang === activeLang));
      });
    }

    if (switcher) {
      SUPPORTED.forEach(function (lang) {
        var button = document.createElement('button');
        button.type = 'button';
        button.lang = lang;
        button.textContent = LANGUAGE_LABELS[lang];
        button.addEventListener('click', function () {
          activeLang = lang;
          try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
          render();
        });
        switcher.appendChild(button);
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
