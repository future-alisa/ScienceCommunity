"use client";

import { useCallback, useState } from "react";
import { Select, Space } from "antd";
import { advanceDining, forkPair, initialDining, Strategy } from "./dining";
import { PlaybackControls, usePlayback } from "./playback";
import styles from "./demo.module.css";

const phaseLabels = {
  first: "等待第一把叉子",
  second: "等待第二把叉子",
  eating: "进餐中",
  done: "已吃完",
};

export default function DiningDemo() {
  const [strategy, setStrategy] = useState<Strategy>("left-first");
  const [state, setState] = useState(() => initialDining());
  const dinerCount = state.phases.length;
  const finished = state.status !== "running";

  const step = useCallback(() => setState(current => advanceDining(current, strategy)), [strategy]);
  const playback = usePlayback(finished, step);

  function reset(count = dinerCount) {
    playback.setPlaying(false);
    setState(initialDining(count));
  }

  function position(index: number, radius: number) {
    const angle = 2 * Math.PI * index / dinerCount - Math.PI / 2;
    return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
  }

  function placement(index: number, radius: number) {
    const { x, y } = position(index, radius);
    return { left: `${x}%`, top: `${y}%` };
  }

  return <section className={styles.demo} aria-label="哲学家进餐交互演示">
    <strong className={styles.title}>哲学家进餐</strong>
    <Space wrap>
      <label>人数 <Select aria-label="哲学家人数" value={dinerCount} onChange={reset}
        options={[3, 4, 5, 6, 7].map(value => ({ value, label: String(value) }))} /></label>
      <Select aria-label="取叉策略" value={strategy} onChange={(value: Strategy) => {
        setStrategy(value);
        reset();
      }} options={[
        { value: "left-first", label: "所有人先拿左叉" },
        { value: "ordered", label: "先拿编号较小的叉子" },
      ]} />
    </Space>
    <div className={styles.table} aria-label="圆桌座位与叉子，虚线连接正在等待的座位与被占用的叉子">
      <div className={styles.tableSurface} aria-hidden="true" />
      {state.phases.map((phase, index) => {
        if (phase === "eating" || phase === "done") return null;
        const fork = forkPair(index, dinerCount, strategy)[phase === "second" ? 1 : 0];
        if (state.owners[fork] === null) return null;
        const start = position(index, 39);
        const end = position(fork - 0.5, 21);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        return <div key={index} className={styles.waitLine} aria-hidden="true" style={{
          left: `${start.x}%`, top: `${start.y}%`, width: `${Math.hypot(dx, dy)}%`,
          transform: `rotate(${Math.atan2(dy, dx)}rad)`,
        }} />;
      })}
      {state.phases.map((phase, index) => <div key={index} className={styles.seat} data-phase={phase} style={placement(index, 39)}>
        <strong>{index + 1} 号</strong>
        <span>{phaseLabels[phase]}</span>
      </div>)}
      {state.owners.map((owner, index) => <div key={index} className={styles.fork}
        data-held={owner !== null} style={placement(index - 0.5, 21)}>
        <strong>叉 {index + 1}</strong>
        <span>{owner === null ? "空闲" : `${owner + 1} 号持有`}</span>
      </div>)}
    </div>
    <p className={styles.status} aria-live="polite"><strong>{state.status === "deadlock" ? "死锁" : state.status === "complete" ? "本轮完成" : `第 ${state.step} 步`}</strong> · {state.event}</p>
    <PlaybackControls playback={playback} finished={finished} started={state.step > 0} step={step} reset={() => reset()} />
  </section>;
}
