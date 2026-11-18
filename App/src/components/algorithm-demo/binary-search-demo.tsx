"use client";
import { useCallback, useState } from "react";
import { InputNumber, Space } from "antd";
import { PlaybackControls, usePlayback } from "./playback";
import styles from "./demo.module.css";

export const defaultValues = [2, 5, 9, 14, 19, 26, 32, 38, 45, 51, 60, 72];
export const defaultTarget = 51;

export default function BinarySearchDemo({ values = defaultValues, initialTarget = defaultTarget }: { values?: number[]; initialTarget?: number }) {
  const initial = { low: 0, high: values.length - 1, mid: -1, comparisons: 0 };
  const [target, setTarget] = useState(initialTarget);
  const [state, setState] = useState(initial);
  const found = state.mid >= 0 && values[state.mid] === target;
  const finished = found || state.low > state.high;
  const step = useCallback(() => setState(current => {
    if (current.low > current.high || values[current.mid] === target) return current;
    const mid = Math.floor((current.low + current.high) / 2);
    return {
      low: values[mid] < target ? mid + 1 : current.low,
      high: values[mid] > target ? mid - 1 : current.high,
      mid,
      comparisons: current.comparisons + 1,
    };
  }), [target, values]);
  const playback = usePlayback(finished, step);
  function reset() {
    playback.setPlaying(false);
    setState(initial);
  }

  return <section className={styles.demo} aria-label="二分查找交互演示">
    <strong className={styles.title}>二分查找</strong>
    <Space wrap><label>查找目标 <InputNumber aria-label="查找目标" value={target} precision={0}
      onChange={value => { if (value !== null) { setTarget(value); reset(); } }} /></label></Space>
    <div className={styles.array} aria-label="有序数组">
      {values.map((value, index) => <div key={value} className={styles.cell}
        data-state={index === state.mid ? "current" : index < state.low || index > state.high || found ? "discarded" : "candidate"}
        aria-label={index === state.mid ? `刚比较 ${value}` : undefined}>{value}</div>)}
    </div>
    <p className={styles.status} aria-live="polite">{found ? `找到 ${target}，共比较 ${state.comparisons} 次。`
      : finished ? `数组中没有 ${target}，共比较 ${state.comparisons} 次。`
      : state.mid < 0 ? "单步比较中间值，观察搜索范围如何变化。"
      : `比较 ${values[state.mid]} 后，搜索范围缩小到 ${values[state.low]} 至 ${values[state.high]}。`}</p>
    <PlaybackControls playback={playback} finished={finished} started={state.comparisons > 0} step={step} reset={reset} />
  </section>;
}
