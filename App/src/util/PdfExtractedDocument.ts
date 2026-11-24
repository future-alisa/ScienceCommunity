import type { Descendant } from "slate";

// The two copies of this equation were checked against pages 3 and 93 of the source PDF.
const copiedEquation = [
  "Q", "k+1", "≈Π", "μk", "B", "^M", "nk", "k", ",π", "k",
  "Q", "k", ",π", "k+1", "=U", "Ck", "(Q", "k+1", ")",
];
const equation = String.raw`Q_{k+1} \approx \Pi_{\mu_k}\mathcal{B}_{M_k,\pi_k}^{n_k}Q_k,\qquad \pi_{k+1}=\mathcal{U}_{C_k}(Q_{k+1})`;
const roadmapTable = [
  "| 时代 | 主要不可行性 | 代表回应 | 新矛盾 |",
  "| --- | --- | --- | --- |",
  "| 精确规划 | 价值递推难以直接求解 | 策略迭代、价值迭代 | 模型与全状态扫描 |",
  "| 表格无模型 | P、R 未知 | MC、TD、SARSA、Q-learning | 样本量与探索 |",
  "| 函数逼近 | 状态动作表不可存储 | 半梯度 TD、策略梯度 | 致命三元组 |",
  "| 深度价值 | 相关样本与移动目标 | DQN 及其改进 | 过估计与分布外备份 |",
  "| 直接策略优化 | 连续动作 argmax 不可行 | Actor–Critic、TRPO、PPO、SAC | 方差、偏差与步长 |",
  "| 模型与离线 | 真实交互昂贵或禁止 | Dyna、MPC、CQL、IQL | 模型偏差与支撑外推 |",
  "| 开放系统 | 单智能体、已知奖励假设过强 | 多智能体、RLHF、约束 RL | 非平稳、错奖与安全 |",
].join("\n");
const chapterTable = [
  "| 原有瓶颈 | 核心改造 | 引入代价 |",
  "| --- | --- | --- |",
  "| 算法分类若以网络结构或历史名称组织，会掩盖可组合的机制与共同失败。 | 用 Bellman 备份的构成项建立统一坐标，再明确不属于 Bellman 求解的偏好与序列方法。 | 统一抽象会省略实现细节和理论条件；不能把“同框架”误读为“同保证”。 |",
].join("\n");

const roadmapRows = [
  "时代 主要不可行性 代表回应 新矛盾",
  "精确规划 价值递推难以直接求解 策略迭代、价值迭代 模型与全状态扫描",
  "表格无模型 P、R 未知 MC、TD、SARSA、Q-learning 样本量与探索",
  "函数逼近 状态动作表不可存储 半梯度 TD、策略梯度 致命三元组",
  "深度价值 相关样本与移动目标 DQN 及其改进 过估计与分布外备份",
  "直接策略优化 连续动作 argmax 不可行 Actor‒Critic、TRPO、PPO、SAC 方差、偏差与步长",
  "模型与离线 真实交互昂贵或禁止 Dyna、MPC、CQL、IQL 模型偏差与支撑外推",
  "开放系统 单智能体、已知奖励假设过强 多智能体、RLHF、约束 RL 非平稳、错奖与安全"
];
const chapterRows = [
  "原有瓶颈 核心改造 引入代价",
  "算法分类若以网络结构或历史名 用 Bellman 备份的构成项建立统一坐标, 统一抽象会省略实现细节和理论条",
  "称组织,会掩盖可组合的机制与 再明确不属于 Bellman 求解的偏好与序列 件;不能把“同框架”误读为“同",
  "共同失败。 方法。 保证”。"
];
const explanationLines = [
  "这个总式只负责定位:B 是备份,n 是自举深度,μ 是样本分布,Π 是函数逼近投影,U 是策略改进,",
  "k k",
  "C 是约束。它不是宣称所有算法共享同一个收敛定理;每章会说明其中哪些符号真实存在,哪些只是参",
  "照。"
];

function plainParagraph(node?: Descendant) {
  if (!node || !("type" in node) || node.type !== "paragraph" || node.children.length !== 1) return "";
  const leaf = node.children[0];
  return Object.keys(leaf).length === 1 ? leaf.text : "";
}

export function normalizePdfExtract(value: Descendant[]): Descendant[] {
  const intro = plainParagraph(value[0]);
  if (!intro.startsWith("本资料由用户提供的《从贝尔曼方程到现代强化学习》PDF 录入")) return value;

  const result: Descendant[] = [];
  let page = 0;
  for (let index = 0; index < value.length; index++) {
    const node = value[index];
    const text = plainParagraph(node);
    const marker = /^原 PDF 第 (\d+) 页$/.exec(text);
    if (marker) page = Number(marker[1]);
    if ((page === 3 || page === 93) && text === copiedEquation[0] && copiedEquation.every((part, offset) =>
      plainParagraph(value[index + offset]).replace(/\s/g, "") === part)) {
      result.push({ type: "code-block", language: "markdown-math", children: [{ text: "$$\n" + equation + "\n$$" }] });
      index += copiedEquation.length - 1;
      continue;
    }
    if (page === 3 && text === roadmapRows[0] && roadmapRows.every((row, offset) => plainParagraph(value[index + offset]) === row)) {
      result.push({ type: "code-block", language: "markdown-table", children: [{ text: roadmapTable }] });
      index += 7;
      continue;
    }
    if (page === 93 && text === chapterRows[0] && chapterRows.every((row, offset) => plainParagraph(value[index + offset]) === row)) {
      result.push({ type: "code-block", language: "markdown-table", children: [{ text: chapterTable }] });
      index += 3;
      continue;
    }

    if (page === 3 && text === explanationLines[0] && explanationLines.every((line, offset) => plainParagraph(value[index + offset]) === line)) {
      result.push({ type: "paragraph", children: [
        { text: "这个总式只负责定位：B 是备份，" }, { text: "$n_k$", math: true },
        { text: " 是自举深度，" }, { text: "$\\mu_k$", math: true },
        { text: " 是样本分布，Π 是函数逼近投影，U 是策略改进，C 是约束。它不是宣称所有算法共享同一个收敛定理；每章会说明其中哪些符号真实存在，哪些只是参照。" },
      ] });
      index += explanationLines.length - 1;
      continue;
    }

    // Keep inconclusive extraction intact, while avoiding a paragraph for every glyph.
    const fragments = [];
    for (let next = index; next < value.length; next++) {
      const fragment = plainParagraph(value[next]);
      if (!fragment.trim() || fragment.trim().length > 16 || /[\u3400-\u9fff]/.test(fragment)) break;
      fragments.push(fragment);
    }
    if (page && fragments.length >= 4 && fragments.some((fragment) => /[=≈∑πγμ^_]/.test(fragment))) {
      result.push({ type: "code-block", language: "pdf-extract", children: [{ text: fragments.join("\n") }] });
      index += fragments.length - 1;
    } else {
      result.push(node);
    }
  }
  return result;
}
