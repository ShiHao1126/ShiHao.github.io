// Shared publication titles are reproduced in the language of the manuscripts.
(() => {
  const manuscripts = [
    ["KineTeach for Robot-Free Real-to-Sim-to-Real Data Generation in Cross-Embodiment Robotic Manipulation", "ICIRA 2026", "kineteach"],
    ["Towards Physical Intelligence in Contact-Rich Manufacturing: A Visual-Force-Pose Demonstration and Phase-Aware Learning Framework", "Robotics and Computer-Integrated Manufacturing", "force"],
    ["Anti-Light-Variation, Detailed Camera-Based Tactile Sensing With Continuous Binary Encoding", "IEEE Transactions on Industrial Electronics", ""]
  ];
  const publications = (status, author) => manuscripts.map(([title, venue, project], i) => ({
    title, status: status[i], venue, author: author[i], project
  }));

  window.PORTFOLIO = {
    zh: {
      projects: [
        {
          id: "haptic", title: "七自由度力反馈遥操作", kicker: "双边遥操作",
          description: "操作者通过外骨骼控制 Flexiv 机械臂。夹爪接触物体时，末端力和力矩通过主端反馈给操作者。",
          role: "我带领小组搭建主从平台，负责运动映射、力反馈控制、夹爪集成和多模态数据记录。",
          steps: [
            { title: "把人的运动映射到机械臂", text: "建立七自由度主端的运动学模型，将主端位姿映射到 Flexiv 末端。结合导纳控制与重力补偿，通过标定实验调整跟随和反馈响应。" },
            { title: "处理夹爪与物体的接触", text: "接入力反馈与视触觉夹爪，编写接触检测、抓力调节和抓取释放逻辑，在真机上联调异常恢复流程。" },
            { title: "记录一次完整操作", text: "用 Python 多进程和共享内存组织控制与记录，关联机器人状态、力和力矩、夹爪状态、触觉图与 RGB-D 图像，并检查记录完整性。" }
          ],
          evidence: "真机联调覆盖主从运动跟随、接触力反馈、抓取和释放。每次操作的多模态记录可用于回看接触前后的机器人与夹爪状态。"
        },
        {
          id: "tactile", title: "视触觉采集与三轴力估计", kicker: "触觉感知",
          description: "用 Flexiv 机械臂重复执行按压、旋转和剪切动作，把触觉图像与接触载荷对应起来。",
          role: "我搭建自动化采集平台，编写数据关联与质检流程，并实现、训练和部署三轴力估计模型。",
          steps: [
            { title: "控制接触条件", text: "配置接触位置、压入深度或目标载荷，让机械臂在可复现的条件下按压、旋转或平移传感器接触面。" },
            { title: "为每张触觉图找到对应的载荷", text: "将触觉图像、六维力和力矩、工具中心点位姿及加载条件关联存储，检查缺失记录并可视化采集轨迹。" },
            { title: "从图像估计三轴接触力", text: "使用 MAE ViT 编码器与双头潜变量结构开展分阶段训练。将模型用于实时推理，并与机器人的参考力信号对照。" }
          ],
          evidence: "在真机上对照触觉模型的三轴输出与机器人参考力。另用 Blender 批量渲染形变网格，生成用于观察接触形变的图像。"
        },
        {
          id: "force", title: "ForceTrace-CAFE", kicker: "示教采集与真机部署",
          description: "从人手示教到机器人执行，记录擦拭、刮除与装配任务中的视觉、位姿和接触力。",
          role: "在团队项目中，我负责多模态示教采集、策略与基线的真机部署，以及操作实验和接触力分析。",
          steps: [
            { title: "补偿工具对测力的影响", text: "对工具重力、质心偏置及传感器零偏进行补偿，以便在示教工具姿态变化时分析物体接触产生的力和力矩。" },
            { title: "整理示教数据", text: "对齐视觉、力和力矩、位姿及夹爪状态，标注接触阶段，为视觉和力觉策略准备训练数据接口。" },
            { title: "把策略接入真机", text: "适配观测和动作接口，调试推理时序与动作执行，并在擦拭、刮除和装配中对照策略与基线的实际表现。" }
          ],
          evidence: "我参与采集真人示教、运行真机策略并分析任务过程中的接触力。相关团队稿件已投稿至 Robotics and Computer-Integrated Manufacturing，我为第四作者。"
        },
        {
          id: "hand", title: "手套驱动的灵巧手遥操作", kicker: "灵巧操作",
          description: "将 DexCap 手套采集的手部运动映射到灵巧智能 DexHand021 灵巧手。",
          role: "我开发手部运动映射、控制接口以及记录与回放工具。",
          steps: [
            { title: "从手套到指尖", text: "解析手套数据，完成坐标对齐和尺度映射，通过正逆运动学匹配指尖位置与指腹方向。" },
            { title: "记录与回放", text: "加入关节与速度限制，联调控制接口，关联记录手套信号、指尖位姿、关节指令与触觉反馈。" }
          ],
          evidence: "在 DexHand021 上集成并测试了手套控制接口和运动限制。"
        },
        {
          id: "sim", title: "Isaac Lab 装配与触觉仿真", kicker: "机器人仿真",
          description: "将千觉 Xense SDK 接入 Isaac Lab，在装配场景中模拟夹爪接触与触觉响应。",
          role: "我集成触觉 SDK，并为机械臂编写装配任务的自动示教流程。",
          steps: [
            { title: "编排装配动作", text: "搭建含机械臂与触觉夹爪的仿真场景，编写抓取、插入、按压和盒盖装配流程。" },
            { title: "处理装配受阻", text: "在示教中引入位姿扰动，并根据接触受阻情况执行重抓或纠偏。" }
          ],
          evidence: "在仿真装配任务中生成示教轨迹，并观察接触状态与恢复动作。"
        },
        {
          id: "kineteach", title: "KineTeach 跨本体示教", kicker: "示教数据生成",
          description: "从真实示教中重建三维场景，再为不同机器人生成视觉观测、状态与动作数据。",
          role: "我采集真实示教、构建三维资产与渲染流程，并参与轨迹增强和跨本体运动学重定向。",
          steps: [
            { title: "重建场景", text: "用 SAM 2 和 FoundationPose 分割并跟踪物体；结合 SAPIEN 多视角采样与 3D Gaussian Splatting 生成三维资产。" },
            { title: "生成不同本体的示教", text: "按轨迹重建场景并批量渲染，参与运动学重定向与 MuJoCo 数据生成，为模仿学习组织观测和动作。" }
          ],
          evidence: "团队论文获 ICIRA 2026 录用，我为第四作者。"
        }
      ],
      publications: publications(["已录用", "已投稿", "修回中"], ["第四作者", "第四作者", "第六作者"]),
      experience: [
        { org: "千觉机器人 × 上海交通大学 MPI Lab", group: "马道林课题组", focus: "触觉感知与自动化数据采集", role: "科研实习生", dates: "2026.05—至今" },
        { org: "灵巧智能（DexRobot）", group: "", focus: "灵巧手遥操作与移动机器人", role: "机器人工程实习生", dates: "2026.03—至今" },
        { org: "上海交通大学机械与动力工程学院", group: "唐鼎课题组", focus: "力反馈遥操作与示教采集", role: "科研实习生", dates: "2025.09—2026.05" },
        { org: "上海交通大学 MVIG", group: "卢策吾课题组", focus: "MuJoCo 仿真与三维高斯建模", role: "科研实习生", dates: "2024.11—2025.09" }
      ]
    },
    en: {
      projects: [
        {
          id: "haptic", title: "7-DoF Haptic Teleoperation", kicker: "Bilateral teleoperation",
          description: "An operator guides a Flexiv arm through an exoskeleton and feels contact forces and torques through the master device.",
          role: "I led the team that built the platform and worked on motion mapping, force feedback, gripper integration, and multimodal recording.",
          steps: [
            { title: "Map the operator’s motion", text: "I modelled the seven-degree-of-freedom master, mapped its pose to the Flexiv end effector, and tuned admittance control and gravity compensation through calibration experiments." },
            { title: "Control contact at the gripper", text: "I integrated haptic and vision-based tactile grippers, implemented contact detection and grasp-force regulation, and tested grasp, release, and fault recovery on hardware." },
            { title: "Record an entire interaction", text: "A Python multiprocessing framework uses shared memory to link robot state, force and torque, gripper state, tactile images, and RGB-D frames. Images are saved asynchronously and recordings checked for completeness." }
          ],
          evidence: "Hardware tests covered motion tracking, contact feedback, grasping, and release. The recordings make it possible to inspect the robot and gripper states before and after contact."
        },
        {
          id: "tactile", title: "Tactile Data and Force Estimation", kicker: "Tactile sensing",
          description: "A Flexiv arm repeats indentation, rotation, and shear motions so that tactile images can be paired with the loads that produced them.",
          role: "I built the acquisition platform and its data checks, then implemented, trained, and deployed a model for three-axis contact force estimation.",
          steps: [
            { title: "Control the contact conditions", text: "I parameterised the contact location, indentation depth, and target load so that experiments could be repeated under known conditions." },
            { title: "Pair images with loads", text: "The recorder associates tactile images with six-axis force and torque, tool-centre-point pose, and loading conditions. I added checks for missing data and tools to visualise the sampling paths." },
            { title: "Estimate force from images", text: "I trained a model with an MAE ViT encoder and a dual-head latent architecture in stages, then deployed it for real-time comparison with the robot’s force feedback." }
          ],
          evidence: "I compared three-axis force predictions with the robot’s reference signals on hardware. A separate Blender pipeline rendered deformation meshes in batches for visual inspection."
        },
        {
          id: "force", title: "ForceTrace-CAFE", kicker: "Demonstrations and deployment",
          description: "Human demonstrations and robot executions capture how vision, pose, and contact force change during wiping, scraping, and assembly.",
          role: "My contributions to this team project were demonstration capture, hardware deployment of policies and baselines, and contact-force analysis during experiments.",
          steps: [
            { title: "Compensate the force measurements", text: "I compensated for tool weight, centre-of-mass offset, and sensor bias to isolate the effect of contact as the demonstrator changed the tool’s orientation." },
            { title: "Prepare the demonstrations", text: "I aligned visual observations, force and torque, pose, and gripper state in time, annotated contact phases, and prepared data interfaces for vision- and force-based policies." },
            { title: "Run the policies on a robot", text: "I adapted observation and action interfaces, debugged inference timing and action execution, and compared policies with baselines in wiping, scraping, and assembly experiments." }
          ],
          evidence: "My experiments covered human demonstration capture, policy execution on physical robots, and analysis of the resulting force traces. I am the fourth author of the associated manuscript submitted to Robotics and Computer-Integrated Manufacturing."
        },
        {
          id: "hand", title: "Glove-to-Hand Teleoperation", kicker: "Dexterous manipulation",
          description: "Hand motion captured by a DexCap glove drives DexRobot’s DexHand021 dexterous hand.",
          role: "I developed the motion mapping, hand-control interface, and recording and replay tools.",
          steps: [
            { title: "Map glove motion to fingertips", text: "I parsed glove data, aligned coordinate frames, applied motion scaling, and used forward and inverse kinematics to match fingertip positions and fingerpad orientations." },
            { title: "Record and replay", text: "I integrated joint and speed limits and linked glove signals, fingertip poses, joint commands, and tactile feedback in the recordings." }
          ],
          evidence: "I integrated and tested the glove-control interface and motion limits on the DexHand021."
        },
        {
          id: "sim", title: "Tactile Assembly in Isaac Lab", kicker: "Robot simulation",
          description: "The Xense SDK brings simulated gripper contact and tactile sensing into Isaac Lab assembly tasks.",
          role: "I integrated the tactile SDK and programmed automated demonstrations for the assembly arm.",
          steps: [
            { title: "Generate assembly motions", text: "I set up an arm and tactile gripper for grasping, insertion, pressing, and lid assembly in simulation." },
            { title: "Recover from obstructions", text: "I added pose perturbations, obstruction detection, regrasping, and corrective motions to the simulated demonstrations." }
          ],
          evidence: "The simulated assembly tasks produced demonstration trajectories for inspecting contact and recovery behaviour."
        },
        {
          id: "kineteach", title: "KineTeach", kicker: "Cross-embodiment demonstrations",
          description: "Real demonstrations are reconstructed in 3D to generate visual observations, robot states, and actions for different embodiments.",
          role: "I collected demonstrations, built 3D assets and a rendering pipeline, and contributed to trajectory augmentation and kinematic retargeting.",
          steps: [
            { title: "Reconstruct the scene", text: "I used SAM 2 and FoundationPose for segmentation and object pose tracking, and combined SAPIEN multi-view sampling with 3D Gaussian Splatting to build assets." },
            { title: "Generate demonstrations", text: "I built trajectory-driven scene reconstruction and batch rendering and contributed to kinematic retargeting and MuJoCo data generation for imitation learning." }
          ],
          evidence: "The team’s paper was accepted at ICIRA 2026. I am the fourth author."
        }
      ],
      publications: publications(["Accepted", "Submitted", "Under revision"], ["Fourth author", "Fourth author", "Sixth author"]),
      experience: [
        { org: "Xense Robotics & SJTU MPI Lab", group: "Daolin Ma Research Group", focus: "Tactile sensing and automated data acquisition", role: "Research Intern", dates: "May 2026–present" },
        { org: "DexRobot", group: "", focus: "Dexterous hand teleoperation and mobile robotics", role: "Robotics Engineering Intern", dates: "Mar 2026–present" },
        { org: "School of Mechanical Engineering, SJTU", group: "Ding Tang Research Group", focus: "Haptic teleoperation and demonstration capture", role: "Research Intern", dates: "Sep 2025–May 2026" },
        { org: "MVIG, Shanghai Jiao Tong University", group: "Cewu Lu Research Group", focus: "MuJoCo simulation and 3D Gaussian Splatting", role: "Research Intern", dates: "Nov 2024–Sep 2025" }
      ]
    }
  };
})();
