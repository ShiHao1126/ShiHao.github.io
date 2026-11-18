// Run from any directory to rebuild the six static bilingual project articles.
const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
global.window = {};
require("./archive-data.js");
const data = window.PORTFOLIO;
const order = ["haptic", "tactile", "force", "hand", "sim", "kineteach"];
const notes = {
  haptic: {
    heading: ["从人的手臂到机械臂", "From the operator to the robot"],
    opening: [
      "遥操作有两个方向。主端要把操作者的运动传给机械臂，夹爪接触物体时，操作者还需要得到反馈。我在这套平台上把七自由度外骨骼和 Flexiv 机械臂连起来。",
      "Teleoperation runs in two directions. Motion travels from the operator to the robot, and information about contact travels back. On this project I worked with a seven-degree-of-freedom exoskeleton and a Flexiv arm.",
    ],
    ending: ["跟随、接触与记录", "Following motion and recording contact"],
    alt: [
      "主端外骨骼及其关节的原理示意",
      "Conceptual illustration of the haptic master and its joints",
    ],
  },
  tactile: {
    heading: ["先把一次接触记录清楚", "Recording a single contact"],
    opening: [
      "一张触觉图像能显示传感器表面的变化。为了用它估计力，还得知道那一刻机械臂在哪里、施加了多少载荷。我从采集流程着手，把每次接触的图像与这些信息放进同一份记录。",
      "A tactile image shows how the sensor surface changes under contact. To use that image to estimate force, I also need to know the robot pose and the load at the time of capture. I started by building the acquisition procedure around those records.",
    ],
    ending: ["回到真机看预测", "Comparing predictions with hardware readings"],
    alt: [
      "接触引起传感器表面形变的原理示意",
      "Conceptual illustration of surface deformation in a tactile sensor",
    ],
  },
  force: {
    heading: [
      "从人手擦拭到机器人执行",
      "From a human demonstration to robot execution",
    ],
    opening: [
      "擦拭任务里，工具沿着表面走过的路径只是记录的一部分。另一个问题是工具在什么时候贴上去，接触时施加了多少力。ForceTrace-CAFE 是我参与的团队项目，我做的工作横跨示教数据采集和机器人实验。",
      "When someone wipes a surface, the tool path tells only part of the story. The point of contact and the force applied during the stroke also matter. I worked on demonstration capture and robot experiments as part of the ForceTrace-CAFE team.",
    ],
    ending: ["从示教走到真机", "Taking demonstrations onto hardware"],
    alt: [
      "擦拭过程和接触力方向示意",
      "Schematic of wiping and the direction of contact force",
    ],
  },
  hand: {
    heading: [
      "手套数据怎样成为灵巧手动作",
      "Turning glove data into hand motions",
    ],
    opening: [
      "这个项目的输入来自 DexCap 手套，输出是灵巧智能 DexHand021 的关节指令。两边的手指尺寸、坐标和可动范围不同，映射时需要决定保留哪些动作特征。我的入口是指尖的位置和指腹朝向。",
      "The input comes from a DexCap glove, and the output is a set of joint commands for DexRobot’s DexHand021. Because the two hands differ in scale, coordinate frames and range of motion, I used fingertip position and fingerpad orientation to define the mapping.",
    ],
    ending: ["把手的动作存下来", "Keeping a record of each movement"],
    alt: [
      "灵巧手指尖和手指关节示意",
      "Conceptual illustration of a dexterous hand and its finger joints",
    ],
  },
  sim: {
    heading: ["在仿真里记录接触", "Capturing contact in simulation"],
    opening: [
      "我在 Isaac Lab 里用机械臂和触觉夹爪搭了一套装配场景，把千觉的 Xense SDK 接入其中。在插入和按压这些动作里，我关心物体开始接触的那一刻，以及装配受阻后怎样调整动作。",
      "I built an assembly scene in Isaac Lab with a robot arm and a tactile gripper and integrated the Xense SDK. During insertion and pressing, I was interested in the moment contact began and how the arm could correct its motion when an object failed to seat.",
    ],
    ending: ["查看一次装配", "Reviewing an assembly attempt"],
    alt: [
      "仿真装配插入位置和夹爪对位示意",
      "Conceptual illustration of gripper alignment during simulated insertion",
    ],
  },
  kineteach: {
    heading: [
      "让一段示教在另一个本体中重现",
      "Replaying a demonstration on another embodiment",
    ],
    opening: [
      "同一段真实示教，要用另一台机器人重现，先得把物体、场景与轨迹放在共同的坐标系里。我的工作从采集示教、跟踪物体位姿和构建三维资产开始。",
      "To replay a real demonstration on a different robot, the objects, scene and trajectory must share a coordinate frame. My part began with collecting the demonstrations, tracking object poses and building the 3D assets.",
    ],
    ending: ["从场景到机器人数据", "From reconstructed scenes to robot data"],
    alt: [
      "多个相机视角、物体位姿和示教轨迹的几何示意",
      "Geometric illustration of camera views, object poses and a demonstrated trajectory",
    ],
  },
};
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const B = (zh, en) =>
  '<span class="zh" lang="zh-CN">' +
  esc(zh) +
  '</span><span class="en" lang="en">' +
  esc(en) +
  "</span>";
const get = (l, id) => data[l].projects.find((p) => p.id === id);
for (const [i, id] of order.entries()) {
  const z = get("zh", id),
    e = get("en", id),
    n = notes[id],
    next = order[(i + 1) % order.length];
  const title = B(z.title, e.title),
    nextTitle = B(get("zh", next).title, get("en", next).title);
  const pub = data.en.publications.find((v) => v.project === id);
  const pubHtml = pub
    ? '<aside class="source" data-anchor><strong>' +
      B("相关论文", "Related paper") +
      '</strong><p lang="en">' +
      esc(pub.title) +
      "</p><p>" +
      B(data.zh.publications.find((v) => v.project === id).status, pub.status) +
      " · " +
      esc(pub.venue) +
      " · " +
      B(data.zh.publications.find((v) => v.project === id).author, pub.author) +
      "</p></aside>"
    : "";
  const html =
    '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#faf8f2"><meta name="description" content="' +
    esc(z.description) +
    '"><title>' +
    esc(z.title) +
    ' · 石昊</title><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/project-archive.css"><script defer src="../assets/project-language.js"></script></head>' +
    '<body data-zh-title="' +
    esc(z.title) +
    ' · 石昊" data-en-title="' +
    esc(e.title) +
    ' · Hao Shi"><a class="skip" href="#article">' +
    B("跳到正文", "Skip to article") +
    "</a>" +
    '<header class="bar"><div class="bar-inner"><a class="signature" href="../index.html" data-route="../index.html"><i aria-hidden="true">✳</i> Hao Shi <small>石昊</small></a><a class="nav-back" href="../index.html#projects" data-route="../index.html#projects">' +
    B("全部项目", "All projects") +
    '</a><nav class="switch" aria-label="中文 / English"><a data-lang="zh" lang="zh-CN" href="?lang=zh" aria-label="中文">中</a><span aria-hidden="true">/</span><a data-lang="en" lang="en" href="?lang=en" aria-label="English">EN</a></nav></div></header>' +
    '<main class="page" id="article"><article><header data-anchor><p class="byline">' +
    B(z.kicker, e.kicker) +
    "</p><h1>" +
    title +
    '</h1><p class="deck">' +
    B(z.description, e.description) +
    "</p></header>" +
    '<figure data-anchor><div class="art"><img width="1152" height="720" src="../assets/art/' +
    id +
    '.webp" alt="' +
    esc(n.alt[0]) +
    '" data-zh-alt="' +
    esc(n.alt[0]) +
    '" data-en-alt="' +
    esc(n.alt[1]) +
    '"></div><figcaption>' +
    B(n.alt[0], n.alt[1]) +
    "</figcaption></figure>" +
    '<div class="body-copy"><section data-anchor><h2>' +
    B(...n.heading) +
    "</h2><p>" +
    B(...n.opening) +
    "</p><p>" +
    B(z.role, e.role) +
    "</p></section>" +
    z.steps
      .map(
        (s, j) =>
          "<section data-anchor><h2>" +
          B(s.title, e.steps[j].title) +
          "</h2><p>" +
          B(s.text, e.steps[j].text) +
          "</p></section>",
      )
      .join("") +
    "<section data-anchor><h2>" +
    B(...n.ending) +
    "</h2><p>" +
    B(z.evidence, e.evidence) +
    "</p></section>" +
    pubHtml +
    '<nav class="next"><a class="back-main" href="../index.html#projects" data-route="../index.html#projects">← ' +
    B("回到主页", "Back to homepage") +
    '</a><a href="' +
    next +
    '.html" data-route="' +
    next +
    '.html">' +
    nextTitle +
    " →</a></nav></div></article></main>" +
    '<footer><div class="footer-inner"><span>石昊 / Hao Shi</span><a class="zh" href="../cv/hao-shi-zh.pdf">中文简历</a><a class="en" href="../cv/hao-shi-en.pdf">English CV</a></div></footer></body></html>\n';
  fs.writeFileSync(path.join(root, "projects", id + ".html"), html);
}
console.log("Built six bilingual project articles.");
