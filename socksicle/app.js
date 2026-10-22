(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* OS Detection -------------------------------------------- */
  const detectedOS = /Windows/i.test(navigator.userAgent)
    ? 'windows'
    : /Linux/i.test(navigator.userAgent)
      ? 'linux'
      : null;

  /* Default Release Constants & Fallbacks ------------------- */
  const FALLBACK_TAG = 'v0.1.1';
  const FALLBACK_VERSION = '0.1.1';

  /* Translations Dictionary --------------------------------- */
  const I18N = {
    en: {
      'site.title': 'Socksicle: proxy client for Windows and Linux',
      'site.desc': 'A desktop proxy client for Windows and Linux. Six protocols, sing-box and Xray, TwinSock encrypted node exchange and a Material 3 interface.',

      'nav.skip': 'Skip to content',
      'nav.protocols': 'Protocols',
      'nav.screens': 'Screens',
      'nav.install': 'Install',
      'nav.download': 'Download',
      'nav.faq': 'FAQ',
      'nav.donate': 'Donate',
      'nav.btn_install': 'Install',

      'hero.title': 'A proxy client for <span class="accent">Windows and Linux.</span>',
      'hero.lede': 'Desktop GUI built on PySide6 with native Material 3. Supports Shadowsocks, VLESS, VMess, Hysteria 2, TUIC and system TUN. Connects directly to your own nodes without accounts or third-party servers.',
      'hero.cta_install': 'Terminal Install',
      'hero.cta_source': 'GitHub',
      'hero.note': 'Open source under MIT license.',
      'hero.dl_windows': 'Download for Windows',
      'hero.dl_linux': 'Download for Linux',
      'hero.dl_default': 'Download',

      'proto.head': 'Supported protocols',
      'proto.subhead': 'Links are parsed, validated and dispatched to the engine best suited for them.',
      'proto.th_protocol': 'Protocol',
      'proto.th_engine': 'Engine',
      'proto.th_notes': 'Notes',
      'proto.n_ss': 'SIP003 plugins are parsed but not forwarded to cores',
      'proto.n_vless': 'XHTTP transport requires Xray',
      'proto.n_vmess': 'TCP, WebSocket and gRPC',
      'proto.n_hy2': 'Obfs needs both the type and the password',
      'proto.n_trojan': 'Standard TLS transport',
      'proto.n_tuic': 'TUIC v5',
      'proto.accepted': 'Accepted links',

      'screens.head': 'The app',
      'screens.subhead': 'Home, settings and about.',
      'screens.main_title': 'Home',
      'screens.main_desc': 'Power, mode and the active server.',
      'screens.settings_title': 'Settings',
      'screens.settings_desc': 'Grouped by what you are trying to change.',
      'screens.about_title': 'About',
      'screens.about_desc': 'Version, core and your TwinSock key.',

      'install.head': 'How to install',
      'install.subhead': 'Fast and simple setup across Linux and Windows.',
      'install.tab_linux': 'Linux (Recommended)',
      'install.tab_source': 'From Source',
      'install.linux_curl_title': 'One-line automated installer',
      'install.linux_curl_desc': 'Downloads the binary, sets up desktop integration, and configures permissions automatically:',
      'install.copy': 'Copy',
      'install.copied': 'Copied!',
      'install.alt_or': 'or download standalone AppImage:',
      'install.download_appimage': 'Download AppImage',
      'install.windows_title': 'Windows Installer & Portable',
      'install.windows_desc': 'Requires Windows 10/11 x64. Bundles sing-box and wintun driver for system-wide TUN support.',
      'install.win_setup': 'Download Setup (.exe)',
      'install.win_portable': 'Portable (.zip)',
      'install.win_note': 'Administrator privileges are required only for enabling TUN mode.',
      'install.source_title': 'Build and run from source',
      'install.source_desc': 'Requires Python 3.10+ and external sing-box or Xray binaries:',

      'dl.head': 'Download',
      'dl.subhead_prefix': 'Version',
      'dl.subhead_suffix': 'for Windows x64 and Linux x86_64. Prebuilt releases bundle sing-box.',
      'dl.win_title': 'Windows',
      'dl.win_desc': 'Installer or portable, both x64.',
      'dl.win_inst': 'Installer',
      'dl.win_port': 'Portable',
      'dl.linux_title': 'Linux',
      'dl.linux_desc': 'AppImage, no install step.',
      'dl.linux_appimage': 'AppImage',
      'dl.all_releases': 'All releases',
      'dl.all_releases_sub': 'Older builds and changelogs',
      'dl.source_title': 'From source',
      'dl.source_desc': 'Python 3.10 or newer.',
      'dl.source_guide': 'Read the guide',
      'dl.fine': 'TUN mode needs Administrator on Windows (wintun.dll ships with the build) and pkexec on Linux. Xray is optional: put it in bin/xray/ or your PATH.',

      'faq.head': 'Frequently Asked Questions',
      'faq.subhead': 'Everything you need to know about Socksicle.',
      'faq.q1': 'Is it free?',
      'faq.a1': 'Yes. Socksicle is MIT licensed and the source is on GitHub. There is no paid tier and no account. sing-box and Xray are separate projects with their own licences.',
      'faq.q2': 'Does it work with my subscription?',
      'faq.a2': 'If your provider gives you an HTTPS URL that returns plain text, Base64 or SIP008 JSON, yes. Import it once and Socksicle refreshes nodes on a schedule with SSRF protection.',
      'faq.q3': 'Do I have to install sing-box or Xray?',
      'faq.a3': 'No. Release builds bundle sing-box. Xray is optional: install it into bin/xray/ or your PATH if you need XHTTP or want to compare engines.',
      'faq.q4': 'What does TUN mode require?',
      'faq.a4': 'Administrator privileges on Windows and pkexec on Linux, because the app has to create a virtual network adapter. SOCKS5 mode needs neither.',
      'faq.q5': 'Where is my data stored?',
      'faq.a5': 'Locally. %APPDATA%\\socksicle\\ on Windows and ~/.config/socksicle/ on Linux. Nothing is uploaded. The privacy policy ships with the app and lives in the repository.',
      'faq.q6': 'Is there a macOS build?',
      'faq.a6': 'Not yet. macOS is explicitly unsupported in this repository, and there is no build for it.',

      'donate.head': 'Donate',
      'donate.subhead': 'Support Socksicle development with any coin.',
      'donate.from_1': 'From $1',
      'donate.from_10': 'From $10',

      'footer.desc': 'A desktop proxy client for Windows and Linux.',
      'footer.product': 'Product',
      'footer.resources': 'Resources',
      'footer.community': 'Community',
      'footer.source': 'Source',
      'footer.releases': 'Releases',
      'footer.issues': 'Issues',
      'footer.licence': 'Licence',
      'footer.copy': 'sing-box and Xray are separate projects under their own licences.'
    },

    ru: {
      'site.title': 'Socksicle — прокси-клиент для Windows и Linux',
      'site.desc': 'Десктопный прокси-клиент для Windows и Linux. Шесть протоколов, ядра sing-box и Xray, зашифрованный обмен серверами TwinSock и интерфейс Material 3.',

      'nav.skip': 'Перейти к контенту',
      'nav.protocols': 'Протоколы',
      'nav.screens': 'Скриншоты',
      'nav.install': 'Установка',
      'nav.download': 'Скачать',
      'nav.faq': 'Вопросы',
      'nav.donate': 'Донат',
      'nav.btn_install': 'Установить',

      'hero.title': 'Прокси-клиент для <span class="accent">Windows и Linux.</span>',
      'hero.lede': 'Графический интерфейс на PySide6 с нативным Material 3. Поддерживает Shadowsocks, VLESS, VMess, Hysteria 2, TUIC и системный TUN. Прямое подключение к вашим узлам без регистрации и сторонних серверов.',
      'hero.cta_install': 'Установка через терминал',
      'hero.cta_source': 'GitHub',
      'hero.note': 'Открытый исходный код под лицензией MIT.',
      'hero.dl_windows': 'Скачать для Windows',
      'hero.dl_linux': 'Скачать для Linux',
      'hero.dl_default': 'Скачать',

      'proto.head': 'Поддерживаемые протоколы',
      'proto.subhead': 'Ссылки парсятся, проверяются и передаются оптимальному движку.',
      'proto.th_protocol': 'Протокол',
      'proto.th_engine': 'Движок',
      'proto.th_notes': 'Примечания',
      'proto.n_ss': 'Плагины SIP003 парсятся, но не передаются ядрам',
      'proto.n_vless': 'Транспорт XHTTP требует ядра Xray',
      'proto.n_vmess': 'TCP, WebSocket и gRPC',
      'proto.n_hy2': 'Для обфускации нужен тип и пароль',
      'proto.n_trojan': 'Стандартный транспорт TLS',
      'proto.n_tuic': 'TUIC версии 5',
      'proto.accepted': 'Форматы ссылок',

      'screens.head': 'Интерфейс',
      'screens.subhead': 'Главная, настройки и о программе.',
      'screens.main_title': 'Главная',
      'screens.main_desc': 'Питание, режим и активный сервер.',
      'screens.settings_title': 'Настройки',
      'screens.settings_desc': 'Сгруппированы по типам параметров.',
      'screens.about_title': 'О программе',
      'screens.about_desc': 'Версия ядра, билд и ваш ключ TwinSock.',

      'install.head': 'Как установить',
      'install.subhead': 'Самый быстрый и надежный запуск на Linux и Windows.',
      'install.tab_linux': 'Linux (Рекомендуется)',
      'install.tab_source': 'Из исходников',
      'install.linux_curl_title': 'Быстрая установка одной командой',
      'install.linux_curl_desc': 'Скрипт скачивает бинарник, интегрирует приложение в систему и настраивает права:',
      'install.copy': 'Скопировать',
      'install.copied': 'Скопировано!',
      'install.alt_or': 'или скачайте автономный AppImage:',
      'install.download_appimage': 'Скачать AppImage',
      'install.windows_title': 'Установщик и Portable для Windows',
      'install.windows_desc': 'Поддерживаются Windows 10/11 x64. Включает sing-box и драйвер wintun для системного TUN.',
      'install.win_setup': 'Скачать Setup (.exe)',
      'install.win_portable': 'Портативная версия (.zip)',
      'install.win_note': 'Права администратора требуются исключительно для работы режима TUN.',
      'install.source_title': 'Сборка и запуск из исходного кода',
      'install.source_desc': 'Требуется Python 3.10+ и бинарники sing-box или Xray:',

      'dl.head': 'Загрузки',
      'dl.subhead_prefix': 'Версия',
      'dl.subhead_suffix': 'для Windows x64 и Linux x86_64. Готовые сборки включают sing-box.',
      'dl.win_title': 'Windows',
      'dl.win_desc': 'Установщик или portable-архив, x64.',
      'dl.win_inst': 'Установщик',
      'dl.win_port': 'Портативная',
      'dl.linux_title': 'Linux',
      'dl.linux_desc': 'AppImage без необходимости установки.',
      'dl.linux_appimage': 'AppImage',
      'dl.all_releases': 'Все релизы',
      'dl.all_releases_sub': 'Предыдущие версии и чейнджлог',
      'dl.source_title': 'Из исходников',
      'dl.source_desc': 'Python 3.10 или новее.',
      'dl.source_guide': 'Руководство по сборке',
      'dl.fine': 'Режиму TUN требуются права Администратора на Windows (wintun.dll входит в сборку) и pkexec на Linux. Xray опционален: поместите его в bin/xray/ или ваш PATH.',

      'faq.head': 'Часто задаваемые вопросы',
      'faq.subhead': 'Ответы на ключевые вопросы о работе Socksicle.',
      'faq.q1': 'Это бесплатно?',
      'faq.a1': 'Да. Socksicle распространяется под свободной лицензией MIT, а весь исходный код открыт на GitHub. Никаких платных тарифов, подписок и сбора данных. sing-box и Xray — отдельные проекты со своими лицензиями.',
      'faq.q2': 'Работает ли приложение с моими подписками?',
      'faq.a2': 'Да, если ваш провайдер предоставляет HTTPS-ссылку с открытым текстом, Base64 или SIP008 JSON. Добавьте ссылку один раз — Socksicle автоматически устранит дубликаты и будет обновлять ноды по расписанию с защитой от SSRF.',
      'faq.q3': 'Нужно ли отдельно ставить sing-box или Xray?',
      'faq.a3': 'Нет. sing-box уже включен во все релизные сборки. Xray опционален: если вам нужен протокол XHTTP или вы хотите сравнивать производительность ядер, просто положите бинарник xray в bin/xray/ или добавьте в PATH.',
      'faq.q4': 'Что требуется для режима TUN?',
      'faq.a4': 'Права администратора на Windows (библиотека wintun.dll поставляется вместе с приложением) и pkexec / Polkit на Linux, так как создание виртуального сетевого адаптера требует системных привилегий. Режим локального SOCKS5 не требует повышенных прав.',
      'faq.q5': 'Где сохраняются мои данные?',
      'faq.a5': 'Исключительно на вашем компьютере: в %APPDATA%\\socksicle\\ на Windows и ~/.config/socksicle/ на Linux. Никакие профили или пароли не отправляются на удаленные серверы.',
      'faq.q6': 'Есть ли сборка для macOS?',
      'faq.a6': 'Пока нет. На текущий момент Socksicle разрабатывается исключительно для Linux и Windows.',

      'donate.head': 'Поддержать проект',
      'donate.subhead': 'Поддержите разработку Socksicle любой криптовалютой.',
      'donate.from_1': 'От $1',
      'donate.from_10': 'От $10',

      'footer.desc': 'Десктопный клиент прокси для Windows и Linux.',
      'footer.product': 'Продукт',
      'footer.resources': 'Ресурсы',
      'footer.community': 'Сообщество',
      'footer.source': 'Исходный код',
      'footer.releases': 'Релизы',
      'footer.issues': 'Ошибки и тикеты',
      'footer.licence': 'Лицензия',
      'footer.copy': 'sing-box и Xray являются сторонними проектами со своими лицензиями.'
    }
  };

  /* Current State ------------------------------------------- */
  let currentLang = root.lang || 'en';
  if (currentLang !== 'ru') currentLang = 'en';

  let currentTag = FALLBACK_TAG;
  let currentVersion = FALLBACK_VERSION;

  /* Language Switcher & Layout Stabilization ---------------- */
  const langSwitch = document.querySelector('.lang-switch');
  const langBtns = document.querySelectorAll('[data-lang-btn]');

  const updateDetectedOSLabel = () => {
    const heroCta = document.querySelector('[data-detect-os]');
    if (!heroCta) return;

    const dict = I18N[currentLang] || I18N.en;
    const labelEl = heroCta.querySelector('[data-os-label]');

    if (detectedOS === 'windows') {
      heroCta.href = `https://github.com/Socksicle/desktop/releases/download/${currentTag}/Socksicle-Setup-${currentVersion}-x64.exe`;
      if (labelEl) labelEl.textContent = dict['hero.dl_windows'];
    } else if (detectedOS === 'linux') {
      heroCta.href = '#install';
      if (labelEl) labelEl.textContent = dict['hero.dl_linux'];
    } else {
      heroCta.href = '#download';
      if (labelEl) labelEl.textContent = dict['hero.dl_default'];
    }
  };

  const updateTexts = (lang) => {
    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });

    if (dict['site.title']) document.title = dict['site.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict['site.desc']) metaDesc.setAttribute('content', dict['site.desc']);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && dict['site.title']) ogTitle.setAttribute('content', dict['site.title']);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && dict['site.desc']) ogDesc.setAttribute('content', dict['site.desc']);

    updateDetectedOSLabel();
  };

  const applyLanguage = (lang, animate) => {
    currentLang = lang;
    root.lang = lang;
    try { localStorage.setItem('socksicle-lang', lang); } catch (e) {}

    if (langSwitch) langSwitch.setAttribute('data-lang', lang);

    langBtns.forEach((btn) => {
      const active = btn.getAttribute('data-lang-btn') === lang;
      btn.setAttribute('aria-pressed', String(active));
    });

    if (animate && !reduceMotion) {
      document.body.classList.add('is-switching-lang');
      setTimeout(() => {
        updateTexts(lang);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.body.classList.remove('is-switching-lang');
          });
        });
      }, 120);
    } else {
      updateTexts(lang);
    }
  };

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang-btn');
      if (targetLang !== currentLang) {
        applyLanguage(targetLang, true);
      }
    });
  });

  /* App bar Sticky Header ----------------------------------- */
  const appbar = document.getElementById('appbar');
  const onScroll = () => {
    if (appbar) appbar.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile Navigation --------------------------------------- */
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');

  const setMenu = (open) => {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.innerHTML = `<svg class="i i--22" aria-hidden="true"><use href="#i-${open ? 'close' : 'menu'}"/></svg>`;
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) setMenu(false);
    });
  }

  /* Ripple Micro-interaction -------------------------------- */
  if (!reduceMotion) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const wave = document.createElement('span');
        wave.className = 'ripple__wave';
        wave.style.width = wave.style.height = `${size}px`;
        wave.style.left = `${e.clientX - rect.left}px`;
        wave.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(wave);
        setTimeout(() => wave.remove(), 600);
      });
    });
  }

  /* Scroll Reveal ------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '120px 0px 60px 0px', threshold: 0.01 });
    reveals.forEach((el) => io.observe(el));
  }

  /* Dynamic GitHub Releases API ----------------------------- */
  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const applyReleaseData = (tag, version, assets) => {
    if (!tag || !version) return;
    currentTag = tag;
    currentVersion = version;

    document.querySelectorAll('[data-release-version]').forEach((el) => {
      el.textContent = version;
    });

    let winSetupUrl = `https://github.com/Socksicle/desktop/releases/download/${tag}/Socksicle-Setup-${version}-x64.exe`;
    let winPortableUrl = `https://github.com/Socksicle/desktop/releases/download/${tag}/Socksicle-${version}-Windows-Portable-x64.zip`;
    let linuxAppImageUrl = `https://github.com/Socksicle/desktop/releases/download/${tag}/Socksicle-${version}-x86_64.AppImage`;

    if (Array.isArray(assets) && assets.length > 0) {
      const exactSetup = assets.find((a) => a.name === `Socksicle-Setup-${version}-x64.exe`);
      const exactPortable = assets.find((a) => a.name === `Socksicle-${version}-Windows-Portable-x64.zip`);
      const exactAppImage = assets.find((a) => a.name === `Socksicle-${version}-x86_64.AppImage`);

      if (exactSetup) {
        winSetupUrl = exactSetup.browser_download_url;
        const sizeStr = formatBytes(exactSetup.size);
        if (sizeStr) document.querySelectorAll('[data-win-setup-size]').forEach((el) => el.textContent = sizeStr);
      }
      if (exactPortable) {
        winPortableUrl = exactPortable.browser_download_url;
        const sizeStr = formatBytes(exactPortable.size);
        if (sizeStr) document.querySelectorAll('[data-win-portable-size]').forEach((el) => el.textContent = sizeStr);
      }
      if (exactAppImage) {
        linuxAppImageUrl = exactAppImage.browser_download_url;
        const sizeStr = formatBytes(exactAppImage.size);
        if (sizeStr) document.querySelectorAll('[data-linux-appimage-size]').forEach((el) => el.textContent = sizeStr);
      }
    }

    document.querySelectorAll('[data-link-win-setup]').forEach((a) => a.href = winSetupUrl);
    document.querySelectorAll('[data-link-win-portable]').forEach((a) => a.href = winPortableUrl);
    document.querySelectorAll('[data-link-linux-appimage]').forEach((a) => a.href = linuxAppImageUrl);

    updateDetectedOSLabel();
  };

  // Hydrate immediately with cached release or defaults
  try {
    const cached = JSON.parse(localStorage.getItem('socksicle_cached_rel') || 'null');
    if (cached?.tag && cached?.version) {
      applyReleaseData(cached.tag, cached.version, cached.assets);
    } else {
      applyReleaseData(FALLBACK_TAG, FALLBACK_VERSION, null);
    }
  } catch (e) {
    applyReleaseData(FALLBACK_TAG, FALLBACK_VERSION, null);
  }

  const fetchGitHubVersion = async () => {
    try {
      const releaseRes = await fetch('https://api.github.com/repos/Socksicle/desktop/releases');
      if (releaseRes.ok) {
        const releases = await releaseRes.json();
        if (Array.isArray(releases) && releases.length > 0) {
          const rel = releases[0];
          const tag = rel.tag_name || '';
          const ver = tag.replace(/^v/, '');
          applyReleaseData(tag, ver, rel.assets);
          try {
            localStorage.setItem('socksicle_cached_rel', JSON.stringify({ tag, version: ver, assets: rel.assets }));
          } catch (e) {}
          return;
        }
      }

      const tagsRes = await fetch('https://api.github.com/repos/Socksicle/desktop/tags');
      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        if (Array.isArray(tags) && tags.length > 0 && tags[0].name) {
          const tagVal = tags[0].name;
          const verVal = tagVal.replace(/^v/, '');
          applyReleaseData(tagVal, verVal, null);
          try {
            localStorage.setItem('socksicle_cached_rel', JSON.stringify({ tag: tagVal, version: verVal, assets: null }));
          } catch (e) {}
        }
      }
    } catch (e) {
      // Offline or rate-limited: fallback data already safely applied
    }
  };

  fetchGitHubVersion();

  /* Install Tabs with WAI-ARIA & Keyboard Navigation -------- */
  const tabBtns = Array.from(document.querySelectorAll('[data-tab-btn]'));
  const tabPanels = Array.from(document.querySelectorAll('[data-panel-name]'));

  const selectTab = (btn) => {
    const targetName = btn.getAttribute('data-tab-btn');
    tabBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    tabPanels.forEach((p) => {
      const active = p.getAttribute('data-panel-name') === targetName;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
  };

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => selectTab(btn));
    btn.addEventListener('keydown', (e) => {
      let targetIndex = index;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabBtns.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabBtns.length) % tabBtns.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = tabBtns.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      tabBtns[targetIndex].focus();
      selectTab(tabBtns[targetIndex]);
    });
  });

  /* Copy Command Buttons with Accessible Feedback ----------- */
  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  };

  document.querySelectorAll('[data-copy-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-cmd');
      if (!text) return;

      const label = btn.querySelector('.copy-label');
      const dict = I18N[currentLang] || I18N.en;

      const onCopiedSuccess = () => {
        btn.classList.add('is-copied');
        if (label) label.textContent = dict['install.copied'];
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (label) label.textContent = dict['install.copy'];
        }, 2200);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(onCopiedSuccess).catch(() => {
          fallbackCopy(text);
          onCopiedSuccess();
        });
      } else {
        fallbackCopy(text);
        onCopiedSuccess();
      }
    });
  });

  /* Smooth FAQ Accordion via Web Animations API ------------- */
  class SmoothAccordion {
    constructor(el) {
      this.el = el;
      this.summary = el.querySelector('summary');
      this.content = el.querySelector('.faq__content');
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;

      if (!this.summary || !this.content) return;
      this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {
      e.preventDefault();
      if (reduceMotion) {
        this.el.open = !this.el.open;
        return;
      }

      if (this.isClosing || !this.el.open) {
        this.open();
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }

    shrink() {
      this.isClosing = true;
      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight}px`;

      if (this.animation) this.animation.cancel();

      this.animation = this.el.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 260,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      });

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => { this.isClosing = false; };
    }

    open() {
      this.el.style.height = `${this.el.offsetHeight}px`;
      this.el.open = true;
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.isExpanding = true;
      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

      if (this.animation) this.animation.cancel();

      this.animation = this.el.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 300,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      });

      this.animation.onfinish = () => this.onAnimationFinish(true);
      this.animation.oncancel = () => { this.isExpanding = false; };
    }

    onAnimationFinish(open) {
      this.el.open = open;
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.el.style.height = '';
    }
  }

  document.querySelectorAll('.faq details').forEach((details) => new SmoothAccordion(details));

  /* Footer Dynamic Year ------------------------------------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Apply initial language
  applyLanguage(currentLang, false);
})();
