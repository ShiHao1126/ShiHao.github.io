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
      language === "en" ? "Hao Shi | 石昊" : "石昊 | Hao Shi";
    document.querySelector("meta[name=description]").content =
      language === "en"
        ? "Illustrated project notes by Hao Shi on tactile sensing, teleoperation, assembly and demonstration capture."
        : "石昊的项目笔记。图解触觉感知、双边遥操作、装配仿真与机器人示教中的系统设计和实验。";
    document
      .querySelector("nav")
      .setAttribute("aria-label", language === "en" ? "Navigation" : "导航");
    document
      .querySelectorAll("[data-lang]")
      .forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.lang === language)),
      );
    for (const image of document.querySelectorAll("img[data-zh-alt]")) {
      image.alt = image.dataset[language + "Alt"];
    }
    document
      .querySelector("#cv")
      .setAttribute("href", "cv/hao-shi-en.pdf?v=20261120-ielts");
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
  function openSection(hash) {
    const target = document.getElementById(hash.slice(1));
    const section = target?.closest("details");
    if (!section) return;
    section.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
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
  document.querySelectorAll('.nav-row nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => openSection(link.hash));
  });
  window.addEventListener("hashchange", () => openSection(location.hash));
  openSection(location.hash);
})();
