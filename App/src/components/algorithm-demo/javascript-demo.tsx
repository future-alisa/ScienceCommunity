"use client";

import { createContext, useContext, useId, useState } from "react";
import { Button, Input, Space, Tabs } from "antd";
import styles from "./demo.module.css";

export const javascriptDemoLanguage = "science-js";
const maxSourceLength = 24000;

// Opt in only with the exact source of a bundled example.
export const AutoRunPlaygrounds = createContext<readonly string[]>([]);

export type Playground = { html: string; css: string; javascript: string };
const marker = "/* science-playground:v1 */\n";

export function encodePlayground(files: Playground) {
  return marker + JSON.stringify(files);
}

function decodePlayground(source: string): Playground {
  if (source.startsWith(marker)) {
    try {
      const files = JSON.parse(source.slice(marker.length));
      if (typeof files.html === "string" && typeof files.css === "string"
        && typeof files.javascript === "string") return files;
    } catch { /* Preserve the source for editing. */ }
  }
  return { html: "", css: "", javascript: source };
}

function javascriptDemoDocument(source: string) {
  // Keep author content out of the HTML parser until inside the sandbox.
  const payload = JSON.stringify(decodePlayground(source)).replace(/</g, "\\u003c");
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{margin:0;padding:16px;font:15px system-ui;color:#172a20;background:#f4f8f5}
button,input,select{font:inherit} button{cursor:pointer}
#error{color:#9b2222;white-space:pre-wrap}
</style>
<body><main id="app"></main><pre id="error" role="alert" hidden></pre>
<script>
const showError = (message) => {
  const error = document.getElementById("error");
  error.textContent = String(message);
  error.hidden = false;
};
window.addEventListener("error", event => showError(event.message));
window.addEventListener("unhandledrejection", event => showError(event.reason));
const files = ${payload};
document.getElementById("app").innerHTML = files.html;
const style = document.createElement("style");
style.textContent = files.css;
document.head.appendChild(style);
const script = document.createElement("script");
script.textContent = files.javascript;
document.body.appendChild(script);
</script></body></html>`;
}

export function JavaScriptPlayer({ source }: { source: string }) {
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  if (!source.trim() || source.length > maxSourceLength) return <p>演示代码为空或超过 24,000 个字符。</p>;

  return <section className={styles.demo} aria-label="JavaScript 交互演示">
    <strong className={styles.title}>JavaScript 交互演示</strong>
    <Space wrap>
      <Button htmlType="button" type={running ? "default" : "primary"} onClick={() => setRunning(!running)}>
        {running ? "停止演示" : "运行演示"}
      </Button>
      {running && <Button htmlType="button" onClick={() => setRun(current => current + 1)}>重新运行</Button>}
    </Space>
    {running && <iframe key={run} className={styles.frame} title="JavaScript 演示画面"
      sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={javascriptDemoDocument(source)} />}
  </section>;
}

export function JavaScriptEditor({ source, onChange, onRemove }: {
  source: string;
  onChange: (source: string) => void;
  onRemove: () => void;
}) {
  const files = decodePlayground(source);
  const [showCode, setShowCode] = useState(false);
  const codePaneId = useId();
  const bundledExamples = useContext(AutoRunPlaygrounds);
  const [preview, setPreview] = useState<{ source: string; revision: number } | undefined>(
    () => bundledExamples.includes(source) ? { source, revision: 1 } : undefined,
  );
  const valid = Object.values(files).some(value => value.trim()) && source.length <= maxSourceLength;
  const tabs = [
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "javascript", label: "JavaScript" },
  ] as const;
  return <section className={styles.playgroundShell} aria-label="交互代码工作区">
    <header className={styles.playgroundHeader}>
      <strong>交互演示</strong>
      <Space wrap>
        <Button size="small" htmlType="button" aria-expanded={showCode} aria-controls={codePaneId}
          onClick={() => setShowCode(current => !current)}>{showCode ? "隐藏代码" : "显示代码"}</Button>
        <Button size="small" htmlType="button" type="primary" disabled={!valid}
          onClick={() => setPreview({ source, revision: (preview?.revision ?? 0) + 1 })}>{preview ? "重新运行" : "运行"}</Button>
        {preview && <Button size="small" htmlType="button" onClick={() => setPreview(undefined)}>停止</Button>}
        <Button size="small" type="text" htmlType="button" onClick={onRemove}>移除</Button>
      </Space>
    </header>
    <div className={styles.playground} data-show-code={showCode}>
      <div id={codePaneId} className={styles.codePane} hidden={!showCode} onKeyDown={event => event.stopPropagation()}
        onPaste={event => event.stopPropagation()}>
        <Tabs size="small" defaultActiveKey="javascript" items={tabs.map(({ key, label }) => ({
          key, label,
          children: <Input.TextArea aria-label={`${label} 源码`} spellCheck={false}
            className={styles.sourceEditor} value={files[key]}
            onChange={event => onChange(encodePlayground({ ...files, [key]: event.target.value }))} />,
        }))} />
      </div>
      <div className={styles.previewPane}>
        <div className={styles.previewHeader}>
          <strong>预览</strong>
          {preview && preview.source !== source && <small role="status">代码已修改</small>}
        </div>
        {preview ? <iframe key={preview.revision} className={styles.previewFrame} title="交互代码运行预览"
          sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={javascriptDemoDocument(preview.source)} />
          : <p className={styles.previewEmpty}>点击「运行」查看效果</p>}
      </div>
    </div>
    {source.length > maxSourceLength && <p role="alert" className={styles.sourceWarning}>代码超过 24,000 个字符，请缩短后再运行。</p>}
  </section>;
}
