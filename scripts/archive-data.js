// Titles, section headings, and body copy are stored in Chinese–English pairs.
module.exports = [
  {
    id: "tactile",
    lead: [
      "围绕视触觉传感器的接触力感知，搭建机械臂自动化采集平台，完成三轴力估计模型的训练与实时部署，并构建基于形变网格的触觉图像渲染流程。",
      "This project combines automated robotic data acquisition, training and real-time deployment of a three-axis contact force estimator, and tactile image rendering from simulated deformation meshes.",
    ],
    walkthrough: {
      heading: ["为什么按采集轮次划分训练集与验证集？", "Why keep an entire acquisition run in one data split?"],
      steps: [
        {
          label: ["一次按压的参照", "The reference for one press"],
          text: [
            "每轮先在无接触时采集参考图像并对力传感器清零。待压头停稳，同一个样本保存接触图像、工具位姿和实测力／力矩。设定的压入深度说明实验条件，传感器读数说明该条件下实际测得的载荷。",
            "Each run begins with an unloaded image and a force tare. Once the indenter settles, the sample pairs a contact image with the tool pose and measured wrench. Indentation depth describes the test condition. The sensor reading gives the load measured under that condition.",
          ],
        },
        {
          label: ["相邻样本的共同条件", "What nearby samples share"],
          text: [
            "一轮连续按压共享参考图像和清零基准。若把同一次加载中的相邻帧随机分进两组，训练和验证都可能看到几乎相同的形变，验证误差便难以反映模型在下一轮采集中的表现。",
            "Samples from one loading sequence share the reference image and tare. A random frame-level split can put almost identical deformations into both sets, making validation error a poor guide to performance on the next acquisition run.",
          ],
        },
        {
          label: ["分别看跨轮次验证与真机预测", "Read the two evaluations separately"],
          text: [
            "离线验证把整轮数据留出，考察模型在另一轮采集中能否保持表现。真机评估另外在按压和剪切时，逐轴对照实时预测与机械臂反馈的接触力读数。前者考察跨轮次表现，后者能看出一次实际加载中偏差出现在哪个阶段。",
            "Offline validation holds out entire runs to test how the model performs on a separate acquisition. In a separate hardware evaluation, real-time predictions are compared axis by axis with forces reported by the robot during indentation and shear. One comparison tests transfer between runs. The other locates discrepancies within an actual loading sequence.",
          ],
        },
      ],
    },
    title: [
      "视触觉数据采集与三轴力估计",
      "Visuotactile data acquisition and three-axis force estimation",
    ],
    figure: [
      "压头、弹性接触面与光学成像单元的剖面示意",
      "Cross-sectional schematic of the indenter, compliant contact surface and imaging optics",
    ],
    sections: [
      {
        heading: [
          "机械臂自动化采集",
          "Automated robotic data acquisition",
        ],
        text: [
          "基于 Flexiv 机械臂实现定深按压、定力加载、双向旋转及多方向剪切，支持不同接触位置、载荷和运动路径的重复采集。采集流程包含力矩清零、无接触参考图像获取、到位停稳采样及中断续采。",
          "The Flexiv-based acquisition platform supports depth-controlled indentation, force-controlled loading, bidirectional rotation and multidirectional shear across contact locations and loading paths. The acquisition workflow includes torque zeroing, non-contact reference-image capture, sampling after settling and resumption of interrupted runs.",
        ],
      },
      {
        heading: [
          "触觉图像与力数据整理",
          "Tactile image and force data preparation",
        ],
        text: [
          "关联保存触觉图像、六维力／力矩、工具中心点（TCP）位姿及加载参数。通过轨迹可视化核对采样位置，并将触觉图像与对应的三轴力读数整理为模型训练样本。",
          "Tactile images are stored with six-axis force/torque measurements, tool centre point (TCP) poses and loading parameters. Trajectory visualisation supports inspection of sampling locations. The tactile images are paired with the corresponding three-axis force readings to form training samples for the force estimator.",
        ],
      },
      {
        heading: [
          "三轴力估计与实时部署",
          "Three-axis force estimation and real-time deployment",
        ],
        text: [
          "实现基于 MAE ViT 编码器与双头潜变量结构的力估计模型，完成数据适配、分阶段训练及离线评估。模型部署于采集平台，根据触觉图像实时预测三轴接触力，并在按压与剪切实验中对照机械臂反馈的力读数，分析各分量随加载过程变化的预测误差。",
          "A force estimator using an MAE ViT encoder and a dual-head latent architecture was implemented through data preparation, staged training and offline evaluation. Deployed on the acquisition platform, it predicts three-axis contact forces from tactile images in real time. Indentation and shear experiments compare these predictions with force readings reported by the robot to analyse component-wise errors throughout loading.",
        ],
      },
      {
        heading: [
          "触觉仿真图像生成",
          "Rendering simulated tactile images",
        ],
        text: [
          "基于 Blender 搭建形变网格到触觉图像的批量渲染流程，完成接触表面提取、材质配置及参考表面 UV 坐标传递。不同形变状态使用一致的纹理映射，支持单样本预览与并行批量渲染。",
          "A Blender pipeline converts simulated deformation meshes into tactile images through contact-surface extraction, material assignment and UV transfer from a reference surface. Consistent texture mapping across deformation states supports individual-sample previews and parallel batch rendering.",
        ],
      },
    ],
  },
  {
    id: "haptic",
    lead: [
      "以低成本、可灵活安装的七自由度力反馈外骨骼为主端，构建与 Flexiv 机械臂的双边遥操作平台，集成主从运动映射、接触力反馈、柔性重力补偿及多模态示教采集。",
      "A low-cost, seven-degree-of-freedom haptic exoskeleton with configurable mounting serves as the master device for bilateral teleoperation of a Flexiv arm. The platform integrates motion retargeting, contact-force feedback, flexible-link gravity compensation and multimodal demonstration capture.",
    ],
    walkthrough: {
      heading: ["停止施力后，外骨骼为什么仍有输出力矩？", "Why can the exoskeleton still produce torque when the operator stops pushing?"],
      steps: [
        {
          label: ["从力信号定位撤力", "Locate the release in the force signal"],
          text: [
            "在同一段日志中对照原始力／力矩与补偿后的输入，定位操作者撤力的时间。手柄姿态变化会改变重力在传感器坐标系中的投影，因此仅凭原始某一轴是否回零，不能确定操作者是否仍在施力。",
            "The raw wrench and compensated input give a time reference for load removal. A change in handle orientation also changes the projection of gravity into the sensor frame, so a raw component can remain nonzero after the operator stops applying force.",
          ],
        },
        {
          label: ["沿控制指令追踪余量", "Trace the remaining torque command"],
          text: [
            "沿同一时间轴查看速度参考、位置反馈项和补偿力矩。主端仍需抵消自身重力，撤去外力后总力矩不必为零。值得追踪的是哪些分量仍沿原来的运动方向施加力矩，以及它们持续到何时。",
            "Velocity references, position-feedback torque and compensation terms can be inspected on the same timeline. Gravity support remains necessary after release. The diagnostic question is which terms still drive the joint in the previous direction and for how long.",
          ],
        },
        {
          label: ["对照关节实际运动", "Compare the measured joint response"],
          text: [
            "将指令变化与编码器记录的关节运动叠看，可区分指令仍在输出和指令变化后机构仍在运动两种情况。后一种现象能够缩小排查范围，单凭这条轨迹还不足以判定是结构柔顺性还是其他机械因素。",
            "Comparing the command with encoder motion distinguishes a continuing drive command from motion that persists after the command changes. The latter narrows the diagnosis, though the trace alone cannot separate structural compliance from other mechanical effects.",
          ],
        },
      ],
    },
    title: [
      "七自由度力反馈外骨骼与双边遥操作",
      "Bilateral teleoperation with a seven-degree-of-freedom haptic exoskeleton",
    ],
    figure: [
      "外骨骼主端与机械臂从端的双边遥操作示意",
      "Schematic of bilateral teleoperation between an exoskeleton and a robot arm",
    ],
    sections: [
      {
        heading: ["低成本结构与灵活安装", "Low-cost construction and configurable mounting"],
        text: [
          "外骨骼采用关节电机与打印结构件组合的低成本构型，可在铝型材支架上采用底部安装、顶部吊装或侧向安装。通过调整基座位置与朝向，适配不同工位的操作空间及手臂活动范围，便于按实验需求重新布置遥操作平台。",
          "The exoskeleton combines joint motors with 3D-printed structural components in a low-cost configuration. Its base supports bottom, overhead and side mounting on an aluminium-extrusion frame. Adjustable base placement and orientation accommodate different workstation layouts and arm workspaces, allowing the teleoperation setup to be reconfigured for different experiments."
        ]
      },
      {
        heading: [
          "主从位姿映射与力反馈",
          "Bilateral motion and force mapping",
        ],
        text: [
          "牵头平台搭建与真机联调，完成主端运动学建模、主从位姿映射、六维导纳控制与重力补偿。系统将手柄位姿转换为机械臂末端目标位姿，并通过外骨骼向操作者反馈从端接触力与力矩。",
          "Led platform development and hardware integration, including exoskeleton kinematics, master–slave pose mapping, six-dimensional admittance control and gravity compensation. Handle poses define target end-effector poses, while contact forces and torques at the robot are returned to the operator through the exoskeleton.",
        ],
      },
      {
        "heading": [
          "柔性建模与重力补偿",
          "Flexible-link modelling and gravity compensation"
        ],
        "text": [
          "针对外骨骼结构在自重与末端负载作用下的挠曲，建立准静态柔性模型，并利用多姿态力传感器数据标定柔度、安装旋转和测量零偏。运行时根据关节角与柔性参数估计传感器实际朝向，修正工具重力在传感器坐标系中的投影，完成六维力／力矩补偿。",
          "A quasi-static flexible-link model represents deflection under link weight and the end-effector payload. Force-sensor measurements across multiple poses calibrate compliance, mounting rotation and measurement bias. At runtime, joint angles and calibrated compliance estimate the sensor orientation, correcting the projection of tool weight into the sensor frame for six-axis force/torque compensation."
        ]
      },
      {
        heading: [
          "双指接触检测与抓力调节",
          "Dual-fingertip contact detection and grasp-force control",
        ],
        text: [
          "集成主端力反馈夹爪与从端千觉双指视触觉夹爪，开发夹爪开合控制、指尖接触检测与目标抓力调节，并将从端抓取力反馈至主端夹爪。",
          "Integrated a master-side haptic gripper with a slave-side Xense two-finger visuotactile gripper. Developed opening and closing control, fingertip contact detection and grasp-force regulation, with slave-side grasp forces rendered at the master gripper.",
        ],
      },
      {
        heading: [
          "多模态记录与完整性检查",
          "Multimodal recording and integrity checks",
        ],
        text: [
          "基于 Python 多进程与共享内存构建控制和采集框架，关联记录多视角 RGB-D、指尖触觉、六维力／力矩、夹爪及机械臂状态。图像由独立进程异步写入，配套完整性检查记录丢帧、写入错误和异常结束原因，支持故障追踪与数据筛查。",
          "A Python multiprocessing framework uses shared memory for control and acquisition, associating multi-view RGB-D, fingertip tactile images, six-axis force/torque, gripper state and arm state. Separate processes write images asynchronously. Integrity checks record dropped frames, write errors and abnormal termination to support fault diagnosis and dataset screening.",
        ],
      },
    ],
  },
  {
    id: "force",
    lead: [
      "参与 ForceTrace-CAFE 接触操作示教学习研究，负责视觉、力觉与位姿数据采集、工具载荷标定补偿，以及策略和对比基线的真机部署。实验覆盖擦拭、刮除与装配任务。",
      "Contributed to ForceTrace-CAFE through visual, force and pose data acquisition, tool-load calibration and compensation, and hardware deployment of the policy and comparison baselines. Experiments cover wiping, scraping and assembly.",
    ],
    walkthrough: {
      heading: ["沿着一次擦拭读懂接触力", "Reading the force trace of a single wipe"],
      steps: [
        {
          label: ["接触前的读数", "Before the first contact"],
          text: [
            "工具悬空时转动手柄，传感器就可能报告力和力矩变化。工具重量在各轴上的投影会变，质心到传感器原点的力臂还会引入力矩。先补偿这些量与传感器零偏，才能解释工具刚触及表面时的读数变化。",
            "Rotating the tool in free space can change the measured force and torque. Its weight projects onto different sensor axes, and the offset centre of mass creates a moment. Compensating for these terms and sensor bias makes the change at first contact interpretable.",
          ],
        },
        {
          label: ["划出擦拭区间", "Identify the interval on the surface"],
          text: [
            "沿对齐的图像、工具位姿和力信号标注接触、持续擦拭和抬离。这样可以在同一阶段比较两次示教的载荷，避免把一次仍在空中接近的轨迹与另一次已贴住表面的轨迹直接相减。",
            "Aligned images, poses and force readings mark contact onset, the sustained wipe and lift-off. Comparing loads within the same phase avoids pairing a tool still approaching in one trial with a tool already on the surface in another.",
          ],
        },
        {
          label: ["把同一问题带到真机", "Ask the same question on the robot"],
          text: [
            "策略及对比基线部署后，真机实验同时查看工具轨迹与接触力曲线。即使两种方法的路径很接近，持续接触段的载荷仍可说明它们是否以相近的力度执行擦拭。",
            "Hardware trials record the tool trajectory and contact-force profile for the deployed policy and its baselines. Even when two methods trace similar paths, loads during sustained contact show whether they apply comparable forces through the wipe.",
          ],
        },
      ],
    },
    title: [
      "ForceTrace-CAFE：多模态示教采集与真机部署",
      "ForceTrace-CAFE: multimodal demonstration capture and policy deployment",
    ],
    figure: [
      "手持示教工具记录运动轨迹与接触载荷示意",
      "Schematic of handheld demonstration capture with tool motion and contact load",
    ],
    sections: [
      {
        heading: [
          "手持示教的力、位姿与视觉测量",
          "Force, pose and visual measurements during handheld demonstrations",
        ],
        text: [
          "接入 RGB-D 相机、六维力／力矩传感器、双 Vive Tracker 和夹爪编码器，构建手持示教装置的多设备采集程序。根据跟踪数据恢复工具末端位姿，统一视觉、运动与受力数据的坐标表达，记录接触操作过程。",
          "Acquisition software integrates an RGB-D camera, a six-axis force/torque sensor, two Vive Trackers and a gripper encoder on the handheld demonstration device. Tracker measurements recover tool poses, and coordinate transformations place visual, motion and force data in a common frame for recording contact-rich manipulation.",
        ],
      },
      {
        heading: [
          "工具重力与传感器零偏补偿",
          "Tool gravity and force/torque sensor bias compensation",
        ],
        text: [
          "标定工具重量、质心相对传感器的偏置及传感器零偏，补偿工具在不同姿态下引入的重力和附加力矩。补偿后的六维力／力矩数据用于接触阶段标注、示教分析和策略执行对比。",
          "Calibration estimates tool weight, the centre-of-mass offset relative to the sensor and sensor bias. Compensation removes the orientation-dependent contributions of tool weight and its moment. The compensated wrench data support contact-phase annotation, demonstration analysis and comparisons of policy execution.",
        ],
      },
      {
        heading: [
          "接触阶段标注与多频数据组织",
          "Contact-phase annotation and multi-rate training data",
        ],
        text: [
          "图像、工具位姿、夹爪状态与补偿后的力信号沿同一时间轴对齐。依据图像与力信号的对应变化，示教序列划分为初次接触、持续接触和释放阶段。批处理程序按视觉与力觉策略各自需要的频率整理动作序列，并将配对的观测与动作导出为 HDF5 数据。",
          "Images, tool poses, gripper states and compensated force measurements share a common timeline. The aligned images and force signals support annotation of contact onset, sustained contact and release. Batch processing prepares action sequences at the rates required by the visual and force-based policies and exports the paired observations and actions to HDF5.",
        ],
      },
      {
        heading: [
          "策略的真机部署与对照实验",
          "Policy deployment and comparative hardware experiments",
        ],
        text: [
          "完成策略及对比基线的机器人部署，适配观测与动作接口，调试传感器采样、模型推理和动作序列执行的时序。在擦拭、刮除及装配实验中，结合工具轨迹与实测接触力比较各方法的执行表现。",
          "Hardware deployment adapts observation and action interfaces for the policy and comparison baselines and coordinates sensor sampling, inference and action-sequence execution. Wiping, scraping and assembly experiments compare execution using tool trajectories and measured contact forces.",
        ],
      },
    ],
    paper: {
      title: "Towards Physical Intelligence in Contact-Rich Manufacturing: A Visual-Force-Pose Demonstration and Phase-Aware Learning Framework",
      venue: "Robotics and Computer-Integrated Manufacturing",
      status: [
        "已投稿，第四作者",
        "Submitted, fourth author",
      ],
    },
  },
  {
    id: "hand",
    lead: [
      "开发 DexCap 数据手套到灵巧智能 DexHand021 的遥操作系统，完成指尖位姿重定向、关节控制接口、真机回放及触觉数据记录。",
      "Developed a DexCap-to-DexRobot DexHand021 teleoperation system with fingertip pose retargeting, joint control, hardware replay and tactile recording.",
    ],
    walkthrough: {
      heading: ["一次闭指动作，三个可对照的记录", "Three records of the same closing motion"],
      steps: [
        {
          label: ["手套给出的目标", "What the glove specifies"],
          text: [
            "从一段闭指记录开始，先把手套指尖位姿转换至机械手坐标系，再按指长差异调整运动尺度。这样得到的是机械手指尖应到达的位置和朝向，能够直接与求解器预览中的姿态比较。",
            "Start with a recorded finger closure. The glove poses are transformed into the robot hand’s frame and the motion is scaled for its finger lengths. The resulting fingertip positions and orientations provide explicit targets for comparison with the solver preview.",
          ],
        },
        {
          label: ["求解器生成的手姿", "What the solver can reproduce"],
          text: [
            "预览由求得的关节角生成。若闭合方向在预览里已经偏离手套目标，就可以先检查坐标对齐、尺度或指腹朝向约束。这一环节可以仅依靠记录完成，且不受重新做一遍手势造成的差异干扰。",
            "The preview reconstructs a hand pose from the solved joint angles. If the closing direction is already wrong there, coordinate alignment, scale and pad-orientation constraints can be examined from the recording without variation from a second performance of the gesture.",
          ],
        },
        {
          label: ["真机上的接触时刻", "When contact occurs on hardware"],
          text: [
            "在真机上回放同一关节序列，并将闭合指令与指尖触觉并排观察。关节目标描述的是期望手姿，触觉变化则提供指尖实际碰到物体的证据，两者结合才便于解释抓取过程。",
            "Replay the same joint sequence on the physical hand and inspect closure commands alongside fingertip tactile readings. The commands specify the intended pose. The tactile response supplies evidence of contact with the object during execution.",
          ],
        },
      ],
    },
    title: [
      "灵巧智能 DexHand021 的数据手套遥操作与触觉采集",
      "Glove teleoperation and tactile data collection for DexRobot’s DexHand021",
    ],
    figure: [
      "数据手套指尖与灵巧手指尖的运动映射示意",
      "Schematic of fingertip motion retargeting from a data glove to a dexterous hand",
    ],
    sections: [
      {
        heading: [
          "指尖位姿约束下的运动重定向",
          "Motion retargeting with fingertip pose constraints",
        ],
        text: [
          "解析手套测量数据，完成坐标对齐与运动尺度映射。结合 DexHand021 正运动学，在指尖位置与指腹朝向约束下求解目标关节角，适配人手和机械手的指长差异及关节活动范围。",
          "Glove measurements are decoded, transformed into the robot hand frame and rescaled to account for differences in finger length. An inverse-kinematics solver uses the DexHand021 forward model to satisfy fingertip-position and fingerpad-orientation constraints within the hand’s joint limits.",
        ],
      },
      {
        heading: [
          "控制接口与硬件回放",
          "Hardware control and trajectory replay",
        ],
        text: [
          "集成 DexHand021 控制接口，加入关节位置限制、速度限制和指令超时检测。实时逆运动学预览、离线轨迹转换与真机回放共用记录数据，用于核对运动映射与实际执行结果。",
          "The DexHand021 control interface enforces joint-position and velocity limits and detects command timeouts. Live inverse-kinematics previews, offline trajectory conversion and hardware replay use the same recorded data to compare retargeted motion with physical execution.",
        ],
      },
      {
        heading: [
          "手套输入、关节指令与触觉记录",
          "Glove, joint-command and tactile recording",
        ],
        text: [
          "关联保存手套原始测量、指尖位姿、关节指令及指尖触觉反馈，构建遥操作记录与回放工具。记录覆盖手指闭合、初次接触与抓取保持阶段，支持运动指令与接触状态的对照分析。",
          "Recording and replay tools associate raw glove measurements, fingertip poses, joint commands and tactile feedback. Records span finger closure, initial contact and grasp holding, supporting comparisons between commanded motion and observed contact states.",
        ],
      },
    ],
  },
  {
    id: "sim",
    lead: [
      "基于 Isaac Lab 搭建机械臂接触装配场景，集成千觉机器人 Xense SDK 实现双指触觉仿真，开发自动示教、位姿扰动与受阻恢复流程，并记录多模态仿真数据。",
      "Built contact-rich assembly tasks in Isaac Lab with the Xense Robotics SDK for tactile simulation at both fingertips. The implementation includes scripted demonstrations, initial-pose perturbations, recovery from obstructions and multimodal episode recording.",
    ],
    walkthrough: {
      heading: ["回看一次受阻的仿真插入", "Inspecting an obstructed insertion in simulation"],
      steps: [
        {
          label: ["从初始位姿看对准偏差", "Start with the alignment"],
          text: [
            "比较相同装配动作在不同工件初始位姿下的回放。在插入前查看工件相对夹爪的位姿及相机图像，可以判断偏差是否在接触之前就已经存在。",
            "Replay the same assembly routine with different initial part poses. Inspecting the part pose relative to the gripper and the camera views just before insertion shows whether a misalignment was already present before contact.",
          ],
        },
        {
          label: ["对照指尖与腕部观测", "Read fingertip and wrist observations together"],
          text: [
            "两侧触觉观测描述各指尖与被夹工件的局部接触，腕部六维力／力矩描述经腕部传递的合力与合力矩。对照工件运动和插入指令，才能判断一次触觉变化发生在持件、推进还是回撤阶段。",
            "The two tactile observations describe local fingertip contact with the grasped part. The wrist wrench describes the net force and moment transmitted at the wrist. Part motion and insertion commands place a change in either signal in the hold, advance or withdrawal phase.",
          ],
        },
        {
          label: ["在回合记录中找恢复动作", "Find the recovery in the recorded episode"],
          text: [
            "检测到受阻后，示教程序按任务状态选择回撤、重新对位或重抓。恢复前后的动作与观测连续保存。回放时既能定位新的动作指令从哪一步开始，也能观察工件在指令改变后如何运动。",
            "After an obstruction is detected, the routine withdraws, realigns or regrasps according to the task state. Keeping actions and observations on both sides of the transition makes it possible to identify the change in command and follow the subsequent part motion.",
          ],
        },
      ],
    },
    title: [
      "Isaac Lab 中的装配示教与触觉仿真",
      "Assembly demonstrations and tactile simulation in Isaac Lab",
    ],
    figure: [
      "双指触觉夹爪对准并插入工件的仿真示意",
      "Schematic of part alignment and insertion with a simulated tactile gripper",
    ],
    sections: [
      {
        heading: [
          "装配工位与触觉传感仿真",
          "Assembly workcell and tactile sensor simulation",
        ],
        text: [
          "集成机械臂、双指触觉夹爪与装配工件，配置工位及传感器。通过 Xense SDK 获取两侧指尖的模拟触觉响应，并关联机器人和工件状态，记录抓取与插入过程中的接触变化。",
          "The workcell integrates a robot arm, a two-finger tactile gripper, assembly parts and sensors. The Xense SDK provides simulated tactile responses at both fingertips, recorded alongside robot and workpiece states to capture changes in contact during grasping and insertion.",
        ],
      },
      {
        heading: [
          "装配动作序列与自动示教",
          "Automated assembly demonstrations",
        ],
        text: [
          "开发覆盖工件抓取、插入、按压及盒盖装配的自动示教流程，将操作组织为拾取、搬运、对位和压合等阶段。各阶段记录动作与观测，支持在不同工件初始位姿下重复执行和回放。",
          "Scripted demonstrations cover part grasping, insertion, pressing and lid assembly, with stages for pickup, transport, alignment and pressing into place. Actions and observations are recorded at each stage for repeated execution and replay under different initial part poses.",
        ],
      },
      {
        heading: [
          "位姿扰动与接触受阻恢复",
          "Pose perturbations and recovery from obstructed contact",
        ],
        text: [
          "对工件初始位姿施加扰动，可在仿真中引入不同程度的对位偏差。检测到受阻后，控制器根据任务状态回撤、重新对准或重抓，再继续装配。示教序列保留受阻前后的动作和触觉观测，可据此回看接触变化与纠偏过程。",
          "Perturbations to the initial part pose introduce variations in alignment. When the controller detects an obstruction, it retracts, realigns or regrasps the part according to the task state before resuming assembly. The demonstration retains actions and tactile observations before and after the obstruction so that changes in contact can be examined alongside the recovery motion.",
        ],
      },
      {
        heading: [
          "多模态记录与动作观测配对",
          "Multimodal recording and action–observation alignment",
        ],
        text: [
          "每个仿真回合单独保存为 HDF5 记录，包含双相机图像、机器人状态与动作、腕部六维力／力矩以及双指触觉。时间戳、坐标系和动作与观测的配对遵循统一约定。批量采集支持过程预览、记录完整性检查和异常回合隔离，原始记录可进一步转换为训练数据格式。",
          "Each simulated episode has an HDF5 record containing two camera views, robot states and actions, wrist force/torque measurements and tactile observations from both fingers. The records use consistent conventions for timestamps, coordinate frames and action–observation pairing. Batch collection supports previews, integrity checks and isolation of anomalous episodes before conversion to training formats.",
        ],
      },
    ],
  },
  {
    id: "kineteach",
    lead: [
      "参与 KineTeach 跨本体示教数据生成研究，负责真实示教采集、三维资产构建和场景渲染，并参与轨迹增强与运动学重定向，生成用于模仿学习的视觉、状态和动作数据。",
      "Contributed to KineTeach through real-world demonstration capture, 3D asset construction and scene rendering, with additional contributions to trajectory augmentation and kinematic retargeting. The workflow generates visual observations, states and actions for imitation learning.",
    ],
    walkthrough: {
      heading: ["同一时刻如何得到两幅对应的 RGB-D 图像？", "How does one instant yield two matching RGB-D views?"],
      steps: [
        {
          label: ["确定这一帧的物体位姿", "Place the object for this frame"],
          text: [
            "在真实示教视频里取一个时刻。SAM 2 给出物体在图像中的区域，FoundationPose 跟踪它的三维位置与朝向。相机外参把这个位姿转换到场景坐标系，使物体的位置能够与机器人轨迹对应。",
            "Take one instant in the real demonstration. SAM 2 identifies the object in the image, and FoundationPose tracks its 3D position and orientation. Camera extrinsics place that pose in the scene frame used for the robot trajectory.",
          ],
        },
        {
          label: ["放置目标机器人的各个连杆", "Pose the target robot"],
          text: [
            "重定向后的关节角描述目标机器人在该时刻的构型。依据 URDF 定义的关节关系，通过正运动学更新各连杆位姿，再与同一时刻的物体位姿组合，得到可供渲染的完整场景。",
            "Retargeted joint angles specify the target robot’s configuration at that instant. Forward kinematics uses the joint relationships in its URDF to place the links. Combining these with the object pose for the same instant gives a scene ready to render.",
          ],
        },
        {
          label: ["保留场景，更换观察位置", "Hold the scene fixed and change the camera"],
          text: [
            "固定相机从工作空间外观察，腕部相机随末端移动。两个视角渲染同一份场景状态，因此画面中的遮挡和尺度可以不同，却仍可与同一个机器人状态和动作配对。",
            "The fixed camera looks over the workspace, while the wrist camera follows the end effector. Both render the same scene state. Occlusion and apparent scale can differ across the two images while both remain paired with the same robot state and action.",
          ],
        },
      ],
    },
    title: [
      "KineTeach：跨本体示教回放与训练数据生成",
      "KineTeach: demonstration replay and training data across robot embodiments",
    ],
    figure: [
      "多视角场景重建与机器人示教轨迹回放示意",
      "Schematic of multi-view scene reconstruction and replay of a robot demonstration",
    ],
    sections: [
      {
        heading: [
          "真实示教采集与位姿跟踪",
          "Real-world demonstrations and object pose tracking",
        ],
        text: [
          "采集真实操作示教，使用 SAM 2 分割操作物体，并通过 FoundationPose 跟踪六自由度位姿。结合相机外参与机器人运动学，将物体位姿和示教轨迹转换到统一坐标系，为轨迹重定向与场景回放提供空间基准。",
          "Real-world demonstrations are processed with SAM 2 for object segmentation and FoundationPose for six-degree-of-freedom pose tracking. Camera extrinsics and robot kinematics transform object poses and demonstration trajectories into a common frame for retargeting and scene replay.",
        ],
      },
      {
        heading: [
          "跨本体重定向与 MuJoCo 数据生成",
          "Cross-embodiment retargeting and MuJoCo data generation",
        ],
        text: [
          "运动学重定向将示教动作映射至目标机器人的关节结构。MuJoCo 结合三维网格资产回放增强和重定向后的轨迹，沿各时间步生成视觉观测与语义标注，并关联对应的机器人状态和动作，形成用于模仿学习的训练序列。",
          "Kinematic retargeting maps demonstrated motion to the target robot’s joint structure. MuJoCo replays the augmented and retargeted trajectories with 3D mesh assets. Visual observations and semantic labels at each step are paired with robot states and actions to form training sequences for imitation learning.",
        ],
      },
      {
        heading: [
          "多视角采样与三维高斯表示",
          "Multi-view sampling and 3D Gaussian scene representation",
        ],
        text: [
          "三维高斯泼溅（3D Gaussian Splatting）分支在 SAPIEN 中采集多视角数据，并整理机器人连杆、夹爪、物体与背景的材质及 UV 坐标。逐帧回放时，根据 URDF 中的运动学模型和关节角计算各连杆位姿，并读取 FoundationPose 在同一时刻跟踪到的物体位姿。",
          "The 3D Gaussian Splatting workflow samples multiple views in SAPIEN and prepares mesh formats, materials and UV coordinates for robot links, grippers, objects and backgrounds. During replay, forward kinematics from the URDF supplies the robot link poses, while FoundationPose supplies the object poses for the corresponding demonstration frame.",
        ],
      },
      {
        heading: [
          "固定与腕部视角的 RGB-D 渲染",
          "RGB-D rendering from fixed and wrist-mounted cameras",
        ],
        text: [
          "开发固定相机与腕部相机的批量 RGB-D 渲染流程，沿同一示教轨迹生成全局工作空间与末端局部视角的观测。渲染支持颜色和场景位置扰动，输出图像与机器人状态、动作配对，并可转换为 LeRobot 格式。",
          "Batch RGB-D rendering produces workspace and end-effector views from fixed and wrist-mounted cameras along the same demonstration trajectory. Colour and scene-placement variations augment the rendered observations, which are paired with robot states and actions and can be exported in LeRobot format.",
        ],
      },
    ],
    paper: {
      title: "KineTeach for Robot-Free Real-to-Sim-to-Real Data Generation in Cross-Embodiment Robotic Manipulation",
      venue: "ICIRA 2026",
      status: [
        "已录用，第四作者",
        "Accepted, fourth author",
      ],
    },
  },
  {
    id: "mobile",
    lead: [
      "开展移动机器人导航与语音交互开发，包括法奥四舵轮底盘的 Nav2 路径规划与跟踪，以及灵巧智能导览机器人的 ROS 2 语音交互和多站任务管理。",
      "Development spans Nav2 path planning and tracking for a FAIRINO base with four steerable wheels, and ROS 2 speech interaction and multi-stop task management for DexRobot’s tour-guide robot.",
    ],
    walkthrough: {
      heading: ["从一条直线到可跟踪的绕障路径", "From a straight line to a trackable detour"],
      steps: [
        {
          label: ["先检查车体能否通过", "Check clearance for the vehicle"],
          text: [
            "起点和目标之间的直线提供最直接的候选路径。通行性判断还要考虑车体在地面上的轮廓。即使路线中心避开了障碍，车体边缘仍可能与之相交。",
            "The line between start and goal is the most direct candidate. Its clearance has to account for the vehicle footprint. An obstacle can intersect the side of the chassis even when it never crosses the path centreline.",
          ],
        },
        {
          label: ["把绕行结果交给跟踪器", "Turn a detour into tracking references"],
          text: [
            "直线受阻时，Smac 从地图上搜索绕行路线。路径简化与重采样将疏密不同的路径点整理为间距较均匀的序列，全向前视控制器据此选择前方参考点并计算底盘运动指令。",
            "If the direct path is obstructed, Smac searches the map for a detour. Simplification and resampling produce waypoints at more regular intervals. The omnidirectional controller selects a lookahead point on that sequence to compute base motion commands.",
          ],
        },
        {
          label: ["让障碍在执行途中出现", "Introduce an obstruction during tracking"],
          text: [
            "离线检查可以在已有路线中加入障碍，再观察规划分支是否切换、输出路径是否更新，以及反馈异常时控制器是否停止发出运动指令。这些记录检验了软件逻辑，实际舵轮的跟踪误差需要实车测量。",
            "An offline check can introduce an obstacle on an existing route and inspect the change in planning branch and output path. A separate feedback fault checks whether motion commands cease. These checks exercise the software logic. Wheel tracking error requires measurements on the physical base.",
          ],
        },
      ],
    },
    title: [
      "移动机器人导航与语音交互",
      "Mobile robot navigation and voice interaction",
    ],
    figure: [
      "四舵轮移动底盘绕过障碍物的规划路径示意",
      "Schematic of a path around an obstacle for a four-wheel-steering base",
    ],
    sections: [
      {
        heading: [
          "四舵轮底盘的 Nav2 路径规划",
          "Nav2 path planning for a four-wheel-steering base",
        ],
        text: [
          "法奥四舵轮底盘的 Nav2 规划器优先检查起点至目标点的直线路径。直线受阻时，Smac 规划器搜索绕障路线。路径经简化和重采样后，全向前视跟踪器沿间距较均匀的路径点计算底盘运动指令。",
          "The Nav2 planner for FAIRINO’s four-wheel-steering base first tests the straight path from start to goal. If an obstacle blocks that path, the Smac planner searches for a detour. Simplification and resampling provide regularly spaced waypoints from which an omnidirectional lookahead controller computes base motion commands.",
        ],
      },
      {
        heading: [
          "全向跟踪与障碍重规划",
          "Omnidirectional tracking and obstacle-triggered replanning",
        ],
        text: [
          "跟踪控制器协调各舵轮转向，在接近终点时减速，并依据底盘足迹检查碰撞风险。新障碍阻断路径时触发重规划，反馈异常时停止输出运动指令。软件与离线测试覆盖规划和控制分支的触发条件、路径输出与异常处理。",
          "The tracking controller coordinates wheel steering, decelerates near the goal and checks for collisions using the chassis footprint. A newly obstructed path triggers replanning, and abnormal feedback inhibits motion commands. Software and offline tests covered planning and control branch conditions, the resulting paths and fault handling.",
        ],
      },
      {
        heading: [
          "导览机器人的 ROS 2 语音交互",
          "ROS 2 speech interaction for a guide robot",
        ],
        text: [
          "开发 ROS 2 语音交互模块，集成音频预处理、语音识别、意图理解与语音播报。通过状态机管理唤醒、监听、播报和用户打断，在播报结束或中止后恢复监听。",
          "A ROS 2 speech interface integrates audio preprocessing, speech recognition, intent interpretation and spoken responses. A state machine manages wake-up, listening, playback and user interruptions, returning to listening when playback ends or is interrupted.",
        ],
      },
      {
        heading: [
          "多站导览与任务中断处理",
          "Multi-stop tours and task interruption",
        ],
        text: [
          "基于 LangGraph 组织问答、对话与导航任务，支持单点导航、多站导览、到站讲解及站点切换。任务流程处理用户取消、超时返回和低电量事件，协调导航执行状态与语音播报。",
          "LangGraph organises question answering, dialogue and navigation, supporting single-destination navigation, multi-stop tours, narration on arrival and transitions between stops. Task handling coordinates navigation and speech during user cancellation, return on timeout and low-battery events.",
        ],
      },
    ],
  },
];
