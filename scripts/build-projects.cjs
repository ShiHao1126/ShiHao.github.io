// Run from any directory to regenerate the bilingual project articles.
const fs = require("node:fs");
const path = require("node:path");
const projects = require("./archive-data.js");
const renderTactileFigure = require("./tactile-figure.cjs");
const projectDir = path.resolve(__dirname, "../projects");

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function bilingual([chinese, english]) {
  return `<span class="zh" lang="zh-CN">${escapeHtml(chinese)}</span><span class="en" lang="en">${escapeHtml(english)}</span>`;
}

function homeBilingual([chinese, english]) {
  return `<span data-ln="zh">${escapeHtml(chinese)}</span><span data-ln="en">${escapeHtml(english)}</span>`;
}

const homePath = path.resolve(__dirname, "../index.html");
const homeProjects = projects.map(({ id, title, lead, figure, sections }) => {
  const explanation = sections.map(({ heading, text }) => `
              <section class="project-section">
                <h4>${homeBilingual(heading)}</h4>
                <p>${homeBilingual(text)}</p>
              </section>`).join("");
  if (id === "kineteach") {
    const media = (file, caption, overview = false) => `<figure class="kine-figure${overview ? " kine-overview" : ""}">
      <a href="assets/kineteach/${file}.webp" target="_blank" rel="noopener"><img src="assets/kineteach/${file}.webp" alt="${escapeHtml(caption[0])}" data-zh-alt="${escapeHtml(caption[0])}" data-en-alt="${escapeHtml(caption[1])}" loading="lazy" decoding="async"></a>
      <figcaption>${homeBilingual(caption)}</figcaption></figure>`;
    const copy = (indices) => indices.map(i => `<section class="project-section"><h5>${homeBilingual(sections[i].heading)}</h5><p>${homeBilingual(sections[i].text)}</p></section>`).join("");
    return `
        <article id="project-kineteach" class="project project-wide" data-part="kineteach" aria-labelledby="title-kineteach">
          <header><h3 id="title-kineteach">${homeBilingual(title)}</h3><p class="project-lead">${homeBilingual(lead)}</p></header>
          <div class="kine-shared">${copy([0])}</div>
          <div class="kine-branches">
            <section class="kine-branch">
              ${copy([1])}
              ${media("mujoco-overview", ["示教、轨迹增强与离屏渲染流程", "Demonstration, trajectory augmentation and offscreen rendering"], true)}
            </section>
            <section class="kine-branch">
              ${copy([2])}
              ${media("gs-pipeline", ["高斯重建、机器人运动学与物体位姿融合流程", "Gaussian reconstruction with robot kinematics and object poses"], true)}
            </section>
          </div>
          <div class="kine-results">
            <div class="kine-results-copy">${copy([3])}
              ${media("appearance-variants", ["视角、背景、物体颜色与光照变化示例", "Examples of viewpoint, background, object colour and lighting variations"])}
            </div>
            <div class="kine-result-images">
              ${media("exo-to-gs", ["真实示教场景到高斯场景的重建与运动映射", "Reconstruction and motion mapping from real demonstrations to Gaussian scenes"])}
            </div>
          </div>
        </article>`;
  }
  if (id === "sim") return `
        <article id="project-sim" class="project project-wide" data-part="sim" aria-labelledby="title-sim">
          <header class="sim-intro">
            <h3 id="title-sim">${homeBilingual(title)}</h3>
            <p class="project-lead">${homeBilingual(lead)}</p>
          </header>
          <figure class="project-visual sim-media">
            <video controls playsinline preload="metadata" poster="assets/sim/poster.jpg" aria-label="Isaac Lab simulation episode">
              <source src="assets/sim/episode_00000011142.mp4" type="video/mp4">
              <a href="assets/sim/episode_00000011142.mp4">${homeBilingual(["播放仿真视频", "Play simulation video"])}</a>
            </video>
            <figcaption>${homeBilingual(["Isaac Lab 仿真数据片段", "Isaac Lab simulation excerpt"])}</figcaption>
          </figure>
          <div class="sim-details">${explanation}</div>
        </article>`;
  return `
        <article id="project-${id}" class="project" data-part="${id}" aria-labelledby="title-${id}">
          ${id === "tactile" ? `<div class="project-visual tactile-media">
            <div class="tactile-photos">
              ${[["setup", "机械臂触觉采集装置", "Robot-based tactile acquisition setup"], ["contact", "球形压头与传感器接触", "Spherical indenter contacting the sensor"]].map(([file, zh, en]) => `<figure>
                <a href="assets/tactile/${file}.webp" target="_blank" rel="noopener"><img src="assets/tactile/${file}.webp" alt="${zh}" data-zh-alt="${zh}" data-en-alt="${en}" loading="lazy" decoding="async"></a>
                <figcaption>${homeBilingual([zh, en])}</figcaption>
              </figure>`).join("")}
            </div>
            <figure class="tactile-monitor">
              <a href="assets/tactile/monitor.webp" target="_blank" rel="noopener"><img src="assets/tactile/monitor.webp" alt="触觉图像、三轴力读数与采集状态监控" data-zh-alt="触觉图像、三轴力读数与采集状态监控" data-en-alt="Tactile images, three-axis force readings and acquisition status" width="1760" height="728" loading="lazy" decoding="async"></a>
              <figcaption>${homeBilingual(["触觉图像、三轴力读数与采集状态", "Tactile images, three-axis force readings and acquisition status"])}</figcaption>
            </figure>
            <p class="media-hint">${homeBilingual(["（点击放大）", "(Click to enlarge)"])}</p>
          </div>` : id === "haptic" ? `<div class="project-visual haptic-media">
            <figure>
              <video controls playsinline preload="metadata" poster="assets/haptic/poster.jpg" aria-label="Exoskeleton teleoperation demonstration">
                <source src="assets/haptic/demo.mp4" type="video/mp4">
                <a href="assets/haptic/demo.mp4">${homeBilingual(["播放演示视频", "Play demonstration video"])}</a>
              </video>
              <figcaption>${homeBilingual(["外骨骼遥操作实机演示", "Exoskeleton teleoperation demonstration"])}</figcaption>
            </figure>
            <div class="mounting-gallery">
              ${[["bottom", "底部安装", "Bottom mounting"], ["overhead", "顶部吊装", "Overhead mounting"], ["side", "侧向安装", "Side mounting"]].map(([file, zh, en]) => `<figure>
                <a href="assets/haptic/${file}.webp" target="_blank" rel="noopener"><img src="assets/haptic/${file}.webp" alt="${zh}" data-zh-alt="${zh}" data-en-alt="${en}" width="1200" height="1600" loading="lazy" decoding="async"></a>
                <figcaption>${homeBilingual([zh, en])}</figcaption>
              </figure>`).join("")}
            </div>
            <p class="media-hint">${homeBilingual(["同一外骨骼的不同安装方式", "Different mounting configurations of the same exoskeleton"])}</p>
          </div>` : id === "force" ? `<div class="project-visual force-media">
            ${[
              ["system", "实验平台、示教采集与策略部署", "Experimental setup, demonstration collection and policy deployment"],
              ["compensation", "重力补偿前后的六维力／力矩对比", "Six-axis force/torque measurements before and after gravity compensation"],
              ["task-progress", "擦拭任务执行阶段与不同策略的接触力对比", "Wiping task phases and contact-force comparison across policies"]
            ].map(([file, zh, en]) => `<figure>
              <a href="assets/force/${file}.webp" target="_blank" rel="noopener"><img src="assets/force/${file}.webp" alt="${zh}" data-zh-alt="${zh}" data-en-alt="${en}" loading="lazy" decoding="async"></a>
              <figcaption>${homeBilingual([zh, en])}</figcaption>
            </figure>`).join("")}
          </div>` : id === "hand" ? `<figure class="project-visual hand-media">
            <video controls playsinline preload="metadata" poster="assets/hand/teleop-poster.jpg" aria-label="DexCap to DexHand021 recorded motion replay">
              <source src="assets/hand/teleop.mp4" type="video/mp4">
              <a href="assets/hand/teleop.mp4">${homeBilingual(["播放动作回放", "Play motion replay"])}</a>
            </video>
            <figcaption>${homeBilingual(["DexCap → DexHand021：历史动作离线回放", "DexCap → DexHand021: recorded motion replay"])}</figcaption>
            <p class="media-hint">${homeBilingual(["左侧为从手，右侧为主端手套；圆球标记指尖。", "Left: robot hand; right: master glove. Spheres mark fingertips."])}</p>
          </figure>` : id === "mobile" ? `<figure class="project-visual mobile-media">
            <a href="assets/mobile/fairino-model.webp?v=2" target="_blank" rel="noopener"><img src="assets/mobile/fairino-model.webp?v=2" alt="法奥机器人示意" data-zh-alt="法奥机器人示意" data-en-alt="Fairino robot illustration" width="612" height="862" loading="lazy" decoding="async"></a>
            <figcaption>${homeBilingual(["法奥机器人示意", "Fairino robot illustration"])}</figcaption>
          </figure>` : `<figure class="project-visual">
            <img src="assets/figures/${id}.webp" alt="${escapeHtml(figure[0])}" data-zh-alt="${escapeHtml(figure[0])}" data-en-alt="${escapeHtml(figure[1])}" width="1200" height="800" loading="lazy" decoding="async">
            <figcaption>${homeBilingual(figure)}</figcaption>
          </figure>`}
          <div class="project-copy">
            <h3 id="title-${id}">${homeBilingual(title)}</h3>
            <p class="project-lead">${homeBilingual(lead)}</p>
${explanation}
          </div>
        </article>`;
}).join("\n");
const homepage = fs.readFileSync(homePath, "utf8").replace(
  /(<div class="project-list">)[\s\S]*?(\n      <\/div>\s*\n    <\/section>)/,
  (_, open, close) => open + homeProjects + close,
);
fs.writeFileSync(homePath, homepage);

function articleTitle([chinese, english]) {
  const phrases = chinese.split(/(?=与)|(?<=：)/u)
    .map(phrase => `<span class="title-phrase">${escapeHtml(phrase)}</span>`).join("<wbr>");
  return `<span class="zh" lang="zh-CN">${phrases}</span><span class="en" lang="en">${escapeHtml(english)}</span>`;
}

function loadDiagram() {
  return `<figure class="load-diagram">
          <figcaption>${bilingual(["力传感器读数的组成", "What the force sensor measures"])}</figcaption>
          <div class="load-equation">
            <span>${bilingual(["力的读数", "Measured force"])}</span><span>=</span>
            <span>${bilingual(["接触力", "Contact force"])}</span><span>+</span>
            <span>${bilingual(["工具重力分量", "Tool weight in the sensor frame"])}</span><span>+</span>
            <span>${bilingual(["传感器零偏", "Sensor bias"])}</span>
          </div>
          <p>${bilingual(["上式描述缓慢运动时的力平衡，各分量均在传感器坐标系中表示。工具悬空时，接触力为零；翻转手腕，重力在各轴上的投影仍会变化。若质心偏离传感器原点，这个偏移还会产生力矩。", "This quasi-static force balance uses the sensor frame throughout. With the tool clear of the surface, contact force is zero, yet rotating the wrist changes the weight projected onto each sensor axis. If the tool’s centre of mass is offset from the sensor origin, its weight also produces a moment."])}</p>
        </figure>`;
}

for (const [index, project] of projects.entries()) {
  const { id, title, lead, walkthrough, sections, figure, paper } = project;
  const next = projects[(index + 1) % projects.length];
  const illustration = `
        <figure>
          <a class="figure-link" href="../assets/figures/${id}.webp">
            <img width="1200" height="800" src="../assets/figures/${id}.webp" decoding="async"
                 alt="${escapeHtml(figure[0])}" data-zh-alt="${escapeHtml(figure[0])}" data-en-alt="${escapeHtml(figure[1])}">
          </a>
          <figcaption>${bilingual(figure)}</figcaption>
        </figure>`;
  const sectionLinks = sections.map(({heading}, i) =>
    `<li><a href="#section-${i + 1}">${bilingual(heading)}</a></li>`
  ).join("\n");
  const caseSteps = walkthrough.steps.map(({label, text}) =>
    `<li><h3>${bilingual(label)}</h3><p>${bilingual(text)}</p></li>`
  ).join("\n");
  const sectionBlocks = sections.map(({ heading, text }, i) => {
    let diagram = "";
    if (id === "tactile" && i === 0) diagram = renderTactileFigure(bilingual);
    if (id === "force" && i === 1) diagram = loadDiagram();
    return `      <section id="section-${i + 1}" data-anchor class="reading-section">
        <h2>${bilingual(heading)}</h2>
        <p>${bilingual(text)}</p>${diagram ? "\n        " + diagram : ""}
      </section>`;
  }).join("\n");
  const publication = paper ? `
      <aside class="publication" data-anchor>
        <h2>${bilingual(["相关论文", "Related paper"])}</h2>
        <p lang="en">${escapeHtml(paper.title)}</p>
        <p class="paper-details"><span lang="en">${escapeHtml(paper.venue)}</span> · ${bilingual(paper.status)}</p>
      </aside>` : "";
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="${escapeHtml(lead[0])}">
  <title>${escapeHtml(title[0])} · 石昊</title>
  <link rel="icon" href="../assets/favicon.svg?v=20261120-sunrise" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/project-archive.css">${id === "tactile" ? '\n  <link rel="stylesheet" href="../assets/tactile-figure.css">' : ""}
  <script defer src="../assets/project-language.js"></script>
</head>
<body data-zh-title="${escapeHtml(title[0])} · 石昊" data-en-title="${escapeHtml(title[1])} · Hao Shi">
  <a class="skip" href="#article">${bilingual(["跳到正文", "Skip to article"])}</a>
  <header class="site-header">
    <a href="../index.html" data-route="../index.html">${bilingual(["石昊", "Hao Shi"])}</a>
    <a href="../index.html#projects" data-route="../index.html#projects">${bilingual(["全部项目", "All projects"])}</a>
    <nav class="switch" aria-label="语言 / Language">
      <a data-lang="zh" lang="zh-CN" href="?lang=zh" aria-current="true">中文</a>
      <span aria-hidden="true">/</span>
      <a data-lang="en" lang="en" href="?lang=en">English</a>
    </nav>
  </header>
  <main id="article" tabindex="-1">
    <article>
      <header class="article-intro" data-anchor>
        <div>
          <h1>${articleTitle(title)}</h1>
          <p class="deck">${bilingual(lead)}</p>
        </div>${illustration}
      </header>
      <div class="reading-layout">
        <nav class="contents" aria-label="本文目录 / In this article">
          <p>${bilingual(["本文目录", "In this article"])}</p>
          <ol>
            <li><a href="#case">${bilingual(walkthrough.heading)}</a></li>
            ${sectionLinks}
          </ol>
        </nav>
        <div class="reading-body">
          <section class="case-study" id="case" data-anchor>
            <h2>${bilingual(walkthrough.heading)}</h2>
            <ol class="case-steps">${caseSteps}</ol>
          </section>
          ${sectionBlocks}${publication}
        </div>
      </div>
    </article>
    <nav class="project-nav" aria-label="项目导航 / Project navigation">
      <a href="../index.html#projects" data-route="../index.html#projects">${bilingual(["返回项目列表", "Back to projects"])}</a>
      <a href="${next.id}.html" data-route="${next.id}.html"><small>${bilingual(["下一篇", "Next project"])}</small>${bilingual(next.title)} →</a>
    </nav>
  </main>
  <footer>
    <a class="zh" lang="zh-CN" href="../cv/hao-shi-zh.pdf">中文简历</a>
    <a class="en" lang="en" href="../cv/hao-shi-en.pdf">English CV</a>
  </footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(projectDir, id + ".html"), html);
}
console.log(`Built ${projects.length} bilingual project articles.`);
