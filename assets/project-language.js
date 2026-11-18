
(() => {
  const key = 'hao-lang';
  const languages = new Set(['zh', 'en']);
  function stored() { try { return localStorage.getItem(key); } catch { return null; } }
  function apply(lang, remember) {
    const html = document.documentElement;
    html.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = document.body.dataset[lang + 'Title'];
    const desc = document.querySelector('meta[name="description"]');
    desc.content = document.querySelector('.deck .' + lang).textContent;
    document.querySelector('img[data-zh-alt]').alt = document.querySelector('img').dataset[lang+'Alt'];
    for (const a of document.querySelectorAll('[data-lang]')) {
      if (a.dataset.lang === lang) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    for (const a of document.querySelectorAll('[data-route]')) {
      const dest = new URL(a.dataset.route, document.baseURI);
      dest.searchParams.set('lang', lang); a.href = dest.href;
    }
    if (remember) try { localStorage.setItem(key, lang); } catch { /* optional preference */ }
  }
  const query = new URLSearchParams(location.search).get('lang');
  apply(languages.has(query) ? query : (stored() === 'en' ? 'en' : 'zh'), languages.has(query));
  document.querySelector('.switch').addEventListener('click', e => {
    const a = e.target.closest('[data-lang]');
    if (!a || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    e.preventDefault();
    const lang = a.dataset.lang;
    const anchor = [...document.querySelectorAll('[data-anchor]')].filter(n=>n.getBoundingClientRect().top<=90).pop();
    const top = anchor?.getBoundingClientRect().top;
    const ratio = anchor ? (90-top)/Math.max(anchor.getBoundingClientRect().height,1) : 0;
    apply(lang,true);
    const url = new URL(location.href); url.searchParams.set('lang',lang);
    try { history.replaceState(null,'',url); } catch { /* file preview */ }
    if(anchor && scrollY>80) {
      const bounds = anchor.getBoundingClientRect();
      scrollTo({top:Math.max(0,scrollY+bounds.top+ratio*bounds.height-90),behavior:'instant'});
    }
  });
})();
