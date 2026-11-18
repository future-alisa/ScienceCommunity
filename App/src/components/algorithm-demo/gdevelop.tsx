"use client";

import { useId, useState } from "react";
import { Alert, Button, Input, Modal, Space } from "antd";
import styles from "./demo.module.css";

export const gdevelopLanguage = "science-gdevelop";

const hostedOrigin = "https://games.gdevelop-app.com";
const exportOrigins = (process.env.NEXT_PUBLIC_GDEVELOP_EXPORT_ORIGINS || "")
  .split(",").map(origin => origin.trim());

export function gdevelopUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return undefined;
    if (url.origin === hostedOrigin && /^\/game-[a-f0-9-]{36}\/index\.html$/i.test(url.pathname)) return url.href;
    if (url.origin !== hostedOrigin && exportOrigins.includes(url.origin) && url.pathname.endsWith("/index.html")) return url.href;
  } catch { /* Invalid URL. */ }
  return undefined;
}

export function GDevelopPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  return <section className={styles.demo} aria-label="GDevelop 交互作品">
    <strong className={styles.title}>GDevelop 交互作品</strong>
    <Space wrap>
      <Button htmlType="button" onClick={() => setPlaying(!playing)}>{playing ? "关闭演示" : "运行演示"}</Button>
      <a href={url} target="_blank" rel="noopener noreferrer">在新标签页打开</a>
    </Space>
    {playing && <iframe className={styles.frame} title="GDevelop 交互作品" src={url}
      sandbox={new URL(url).origin === hostedOrigin ? "allow-scripts allow-same-origin" : "allow-scripts"} allow="fullscreen" referrerPolicy="no-referrer" />}
  </section>;
}

export function GDevelopDialog({ open, initialUrl = "", onClose, onSave }: {
  open: boolean; initialUrl?: string; onClose: () => void; onSave: (url: string) => void;
}) {
  return <Modal open={open} title="GDevelop 作品" footer={null} onCancel={onClose} destroyOnClose width={760}>
    <GDevelopFields initialUrl={initialUrl} onSave={onSave} />
  </Modal>;
}

function GDevelopFields({ initialUrl, onSave }: { initialUrl: string; onSave: (url: string) => void }) {
  const [input, setInput] = useState(initialUrl);
  const url = gdevelopUrl(input);
  const fieldId = useId();
  return <Space direction="vertical" style={{ width: "100%" }}>
    <label htmlFor={fieldId}>作品的独立播放地址</label>
    <Input id={fieldId} value={input} onChange={event => setInput(event.target.value)}
      placeholder="https://games.gdevelop-app.com/game-…/index.html" />
    {input && !url && <Alert type="warning" message="请输入 GDevelop 独立播放链接，或社区已配置的 Web 导出地址。" />}
    {url && <GDevelopPlayer key={url} url={url} />}
    <Button htmlType="button" type="primary" disabled={!url} onClick={() => { if (url) onSave(url); }}>
      {initialUrl ? "保存链接" : "插入作品"}
    </Button>
  </Space>;
}
