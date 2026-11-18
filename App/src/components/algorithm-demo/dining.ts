export type Strategy = "left-first" | "ordered";
type Phase = "first" | "second" | "eating" | "done";

export function initialDining(dinerCount = 5) {
  return {
    owners: Array<number | null>(dinerCount).fill(null),
    phases: Array<Phase>(dinerCount).fill("first"),
    next: 0,
    step: 0,
    status: "running" as "running" | "deadlock" | "complete",
    event: `${dinerCount} 位哲学家各需两把相邻的叉子，每人吃一轮。`,
  };
}

export function forkPair(diner: number, count: number, strategy: Strategy) {
  const adjacent = (diner + 1) % count;
  return strategy === "ordered"
    ? [Math.min(diner, adjacent), Math.max(diner, adjacent)]
    : [diner, adjacent];
}

export function advanceDining(state: ReturnType<typeof initialDining>, strategy: Strategy) {
  if (state.status !== "running") return state;
  const dinerCount = state.phases.length;
  const owners = [...state.owners];
  const phases = [...state.phases];

  for (let offset = 0; offset < dinerCount; offset++) {
    const diner = (state.next + offset) % dinerCount;
    const phase = phases[diner];
    if (phase === "done") continue;
    const [first, second] = forkPair(diner, dinerCount, strategy);

    let event;
    if (phase === "eating") {
      owners[first] = owners[second] = null;
      phases[diner] = "done";
      event = `哲学家 ${diner + 1} 吃完，放回两把叉子。`;
    } else {
      const fork = phase === "first" ? first : second;
      if (owners[fork] !== null) continue;
      owners[fork] = diner;
      phases[diner] = phase === "first" ? "second" : "eating";
      event = `哲学家 ${diner + 1} 拿起叉子 ${fork + 1}${phase === "second" ? "，开始进餐" : ""}。`;
    }
    return {
      owners, phases, next: (diner + 1) % dinerCount, step: state.step + 1, event,
      status: phases.every(value => value === "done") ? "complete" as const : "running" as const,
    };
  }

  return { ...state, status: "deadlock" as const, event: "所有尚未吃完的哲学家都在等待，且无人能释放叉子。" };
}
