"use client";

import { useCallback, useState } from "react";
import { Alert, Button, Input, Modal, Select, Space } from "antd";
import { PlaybackControls, usePlayback } from "./playback";
import styles from "./demo.module.css";

export const flowLanguage = "science-flow";

type Stage = { title: string; detail: string; next: number[] };
type Flow = { title: string; parameter: string; options: string[]; stages: Stage[] };

export const emptyFlow: Flow = {
  title: "", parameter: "", options: ["默认"], stages: [{ title: "", detail: "", next: [-1] }],
};

export const exampleFlow: Flow = {
  title: "排队系统如何应对满员",
  parameter: "满员策略",
  options: ["等待空位", "离开队列"],
  stages: [
    { title: "顾客到达", detail: "柜台忙，等候区也已满。", next: [1, 3] },
    { title: "原地等待", detail: "顾客留在入口，直到有人离队。", next: [2, 2] },
    { title: "进入队列", detail: "等候区空出一席，顾客加入队伍。", next: [-1, -1] },
    { title: "顾客离开", detail: "顾客没有加入队伍。", next: [-1, -1] },
  ],
};

export function parseFlow(text: string): Flow | undefined {
  try {
    const flow = JSON.parse(text) as Flow;
    const label = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
    if (!flow || !label(flow.title, 100) || !Array.isArray(flow.options) || flow.options.length < 1 || flow.options.length > 4
      || !flow.options.every(option => label(option, 50)) || new Set(flow.options).size !== flow.options.length
      || typeof flow.parameter !== "string" || flow.parameter.length > 50
      || (flow.options.length > 1 && !label(flow.parameter, 50))
      || !Array.isArray(flow.stages) || flow.stages.length < 1 || flow.stages.length > 24
      || !flow.stages.every(stage => stage && label(stage.title, 100) && typeof stage.detail === "string" && stage.detail.length <= 500
        && Array.isArray(stage.next) && stage.next.length === flow.options.length
        && stage.next.every(index => Number.isInteger(index) && index >= -1 && index < flow.stages.length))) return undefined;
    return flow;
  } catch { return undefined; }
}

export function FlowPlayer({ flow }: { flow: Flow }) {
  const [choice, setChoice] = useState(0);
  const [state, setState] = useState({ index: 0, steps: 0 });
  const stage = flow.stages[state.index];
  const next = stage.next[choice];
  const finished = next === -1;
  const step = useCallback(() => setState(current => {
    const index = flow.stages[current.index].next[choice];
    return index < 0 ? current : { index, steps: current.steps + 1 };
  }), [flow, choice]);
  const playback = usePlayback(finished, step);
  function reset() {
    playback.setPlaying(false);
    setState({ index: 0, steps: 0 });
  }
  return <section className={styles.demo} aria-label={flow.title}>
    <strong className={styles.title}>{flow.title}</strong>
    {flow.options.length > 1 && <Space wrap>
      <span>{flow.parameter}</span>
      <Select aria-label={flow.parameter} value={choice} options={flow.options.map((label, value) => ({ label, value }))}
        onChange={value => { setChoice(value); playback.setPlaying(false); }} />
    </Space>}
    <ol className={styles.flowStages} aria-label="流程状态">
      {flow.stages.map((item, index) => <li key={index} aria-current={index === state.index ? "step" : undefined}>{item.title}</li>)}
    </ol>
    <div className={styles.status} aria-live="polite">
      <strong>{stage.title}</strong>
      {stage.detail && <p>{stage.detail}</p>}
      <p>{finished ? "流程结束" : `下一步：${flow.stages[next].title}`}</p>
    </div>
    <PlaybackControls playback={playback} finished={finished} started={state.steps > 0} step={step} reset={reset} />
  </section>;
}

export function FlowEditor({ initial, onClose, onSave }: { initial?: Flow; onClose: () => void; onSave: (flow: Flow) => void }) {
  const [flow, setFlow] = useState(initial ?? emptyFlow);
  const [preview, setPreview] = useState<Flow>();
  const valid = parseFlow(JSON.stringify(flow));

  function updateStage(index: number, patch: Partial<Stage>) {
    setFlow(current => ({ ...current, stages: current.stages.map((stage, i) => i === index ? { ...stage, ...patch } : stage) }));
  }

  return <Modal open title={initial ? "编辑流程演示" : "制作流程演示"} width={780}
    onCancel={onClose} okText="应用到文档" okButtonProps={{ disabled: !valid }}
    onOk={() => { if (valid) onSave(valid); }}>
    <Space direction="vertical" style={{ width: "100%" }}>
      <label>演示名称<Input value={flow.title} maxLength={100} onChange={event => setFlow({ ...flow, title: event.target.value })} /></label>
      <label>分支参数名称<Input value={flow.parameter} maxLength={50} placeholder="例如：满员策略" onChange={event => setFlow({ ...flow, parameter: event.target.value })} /></label>
      {flow.options.map((option, index) => <Space key={index} wrap>
        <label>参数选项 {index + 1}<Input value={option} maxLength={50}
          onChange={event => setFlow({ ...flow, options: flow.options.map((item, i) => i === index ? event.target.value : item) })} /></label>
        {index > 0 && <Button htmlType="button" onClick={() => setFlow({
          ...flow, options: flow.options.filter((_, i) => i !== index),
          stages: flow.stages.map(stage => ({ ...stage, next: stage.next.filter((_, i) => i !== index) })),
        })}>删除选项</Button>}
      </Space>)}
      <Button htmlType="button" disabled={flow.options.length === 4} onClick={() => setFlow({
        ...flow, options: [...flow.options, ""],
        stages: flow.stages.map(stage => ({ ...stage, next: [...stage.next, -1] })),
      })}>添加分支选项</Button>
      <p>第一条状态是起点。为每个选项选一个下一步，也可以选择结束。</p>
      {flow.stages.map((stage, index) => <fieldset key={index} className={styles.stageEditor}>
        <legend>状态 {index + 1}</legend>
        <Space direction="vertical" style={{ width: "100%" }}>
          <label>状态名称<Input value={stage.title} maxLength={100} onChange={event => updateStage(index, { title: event.target.value })} /></label>
          <label>说明<Input.TextArea value={stage.detail} maxLength={500} onChange={event => updateStage(index, { detail: event.target.value })} /></label>
          {flow.options.map((option, i) => <label key={i}>
            {option || `选项 ${i + 1}`}的下一步{" "}
            <Select aria-label={`状态 ${index + 1} 的选项 ${i + 1} 下一步`} value={stage.next[i]}
              style={{ minWidth: 150 }} options={[{ value: -1, label: "结束" }, ...flow.stages.map((item, value) => ({ value, label: item.title || `状态 ${value + 1}` }))]}
              onChange={value => updateStage(index, { next: stage.next.map((next, j) => j === i ? value : next) })} />
          </label>)}
          {index > 0 && <Button htmlType="button" onClick={() => setFlow({
            ...flow, stages: flow.stages.filter((_, i) => i !== index).map(item => ({
              ...item, next: item.next.map(next => next === index ? -1 : next > index ? next - 1 : next),
            })),
          })}>删除状态</Button>}
        </Space>
      </fieldset>)}
      <Space wrap>
        <Button htmlType="button" disabled={flow.stages.length === 24} onClick={() => setFlow({
          ...flow, stages: [...flow.stages, { title: "", detail: "", next: flow.options.map(() => -1) }],
        })}>添加状态</Button>
        <Button htmlType="button" disabled={!valid} onClick={() => setPreview(valid)}>更新预览</Button>
      </Space>
      {!valid && <Alert type="info" message="填写演示名称和所有状态名称。使用多个分支时，请填写参数名称和各不相同的选项。" />}
      {preview && <FlowPlayer key={JSON.stringify(preview)} flow={preview} />}
    </Space>
  </Modal>;
}
