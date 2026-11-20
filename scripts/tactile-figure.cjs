module.exports = function renderTactileFigure(bilingual) {
  const modes = [
    {
      id: "press",
      name: ["法向按压", "Normal indentation"],
      motion: ["压头接触弹性表面后，沿表面法向继续压入。实验可指定压入深度或目标法向力。", "After first contact, the indenter advances along the surface normal. The experiment specifies either an indentation depth or a target normal force."],
      comparison: ["在同一加载序列中，将触觉图像给出的法向力估计值与机械臂反馈的对应分量逐次对照。", "Within the same loading sequence, compare the normal force estimated from each tactile image with the corresponding component reported by the robot."],
    },
    {
      id: "shear",
      name: ["接触后剪切", "Shear after contact"],
      motion: ["压头先建立接触，再沿表面切向移动。图中画出一个剪切方向，采集时可改变方向。", "The indenter first establishes contact, then moves tangentially. The sketch shows one shear direction. The acquisition routine can vary this direction between trials."],
      comparison: ["对照切向力的预测值与机械臂读数，同时保留法向分量。这样可以分别检查模型对剪切和按压的响应。", "Compare the estimated tangential force with the robot reading while retaining the normal component. This separates the checks on the model’s response to shear and indentation."],
    },
  ];

  const controls = modes.map(({ id, name }, index) => `
        <input class="load-choice" type="radio" name="tactile-load" id="load-${id}" aria-controls="load-view-${id}"${index === 0 ? " checked" : ""}>
        <label for="load-${id}">${bilingual(name)}</label>`).join("");
  const panels = modes.map(({ id, motion, comparison }) => `
        <div class="load-view" id="load-view-${id}">
          <div class="load-sketch" aria-hidden="true">
            <span class="load-plane">${bilingual(["压头轨迹 · 侧视", "Indenter path · side view"])}</span>
            <span class="load-material"></span>
            <span class="load-origin"></span>
            <span class="load-descent"></span>${id === "shear" ? '<span class="load-traverse"></span>' : ""}
            <span class="load-surface">${bilingual(["未加载表面", "Unloaded surface"])}</span>
            <span class="load-gel">${bilingual(["弹性层", "Elastomer"])}</span>
          </div>
          <dl class="load-explanation">
            <dt>${bilingual(["压头怎样运动", "Indenter motion"])}</dt>
            <dd>${bilingual(motion)}</dd>
            <dt>${bilingual(["怎样核对力估计", "Checking the force estimate"])}</dt>
            <dd>${bilingual(comparison)}</dd>
          </dl>
        </div>`).join("");

  return `<figure class="tactile-loads" aria-labelledby="load-legend">
      <fieldset>
        <legend id="load-legend">${bilingual(["两种接触加载方式", "Two ways to load the sensor"])}</legend>${controls}${panels}
      </fieldset>
      <figcaption>${bilingual(["运动路径示意。空心点为首次接触位置，箭头为压头运动方向。", "Schematic indenter paths. The open circle marks first contact and the arrow indicates the direction of motion."])}</figcaption>
    </figure>`;
};
