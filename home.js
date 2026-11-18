(() => {
  "use strict";
  const root = document.documentElement;
  const storageKey = "hao-lang";
  let previous;
  try {
    previous = localStorage.getItem(storageKey);
  } catch {}
  const requested = new URLSearchParams(location.search).get("lang");
  let active = ["zh", "en"].includes(requested)
    ? requested
    : previous === "en"
      ? "en"
      : "zh";

  const getPos = () => {
    if (scrollY < 80) return null;
    const items = [...document.querySelectorAll("[data-part]")].filter(
      (el) => el.getBoundingClientRect().top <= 85,
    );
    const el = items.at(-1);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { el, ratio: (85 - rect.top) / Math.max(rect.height, 1) };
  };
  function apply(language, remember = false, restore = false) {
    const pos = restore ? getPos() : null;
    active = language;
    document.body.classList.toggle("english", language === "en");
    root.lang = language === "en" ? "en" : "zh-CN";
    document.title =
      language === "en" ? "Hao Shi · Personal homepage" : "石昊 · Hao Shi";
    document.querySelector("meta[name=description]").content =
      language === "en"
        ? "Hao Shi’s personal homepage. From studying automation in Shanghai to building robots and collecting tactile data."
        : "石昊的个人主页。关于在交大学自动化、做机器人和记录触觉的经历。";
    document
      .querySelector("nav")
      .setAttribute("aria-label", language === "en" ? "Navigation" : "导航");
    document
      .querySelectorAll("[data-lang]")
      .forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.lang === language)),
      );
    document.querySelectorAll("[data-project]").forEach((a) => {
      const href = a.getAttribute("href").split("?")[0];
      a.setAttribute(
        "href",
        href + (language === "en" ? "?lang=en" : "?lang=zh"),
      );
      if (a.classList.contains("cover"))
        a.setAttribute(
          "aria-label",
          a.closest("article").querySelector('h3 [data-ln="' + language + '"]')
            .textContent,
        );
    });
    document
      .querySelector("#cv")
      .setAttribute("href", "cv/hao-shi-" + language + ".pdf");
    if (remember) {
      try {
        localStorage.setItem(storageKey, language);
      } catch {}
    }
    if (pos) {
      const rect = pos.el.getBoundingClientRect();
      window.scrollTo({
        top: Math.max(0, scrollY + rect.top + pos.ratio * rect.height - 85),
        behavior: "instant",
      });
    }
  }
  function openPaper() {
    if (
      /^#paper-[1-3]$/.test(location.hash) ||
      location.hash === "#publications"
    ) {
      document.querySelector("#publications details").open = true;
      const target = document.getElementById(location.hash.slice(1));
      if (target)
        requestAnimationFrame(() =>
          target.scrollIntoView({ block: "start", behavior: "instant" }),
        );
    }
  }
  apply(active, requested === "en" || requested === "zh");
  document.querySelectorAll("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (active === btn.dataset.lang) return;
      const url = new URL(location.href);
      url.searchParams.set("lang", btn.dataset.lang);
      try {
        history.replaceState(null, "", url);
      } catch {}
      apply(btn.dataset.lang, true, true);
    }),
  );
  window.addEventListener("hashchange", openPaper);
  openPaper();
})();
