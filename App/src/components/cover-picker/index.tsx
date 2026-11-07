"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Space, message } from "antd";
import StorageImage from "@/components/storage-image";
import { s3 } from "@/services/S3Service";
import styles from "./style.module.css";

export default function CoverPicker({ value = "", onChange, communityId, kind = "document", disabled = false, onBusyChange }:
  { value?: string; onChange?: (url: string) => void; communityId?: string; kind?: "document" | "community"; disabled?: boolean; onBusyChange?: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const generation = useRef(0);
  const callback = useRef(onBusyChange); callback.current = onBusyChange;
  useEffect(() => { generation.current++; return () => { generation.current++; callback.current?.(false); }; }, [communityId, kind]);
  return <div className={styles.picker}>
    <div className={styles.preview}>{value ? <StorageImage src={value} alt={kind === "community" ? "社区封面预览" : "资料封面预览"} /> : <span>添加一张封面，让内容更容易被发现</span>}</div>
    <Space wrap>
      <Button disabled={disabled || busy || (kind === "document" && !communityId)} loading={busy} onClick={() => input.current?.click()}>{value ? "更换封面" : "上传封面"}</Button>
      {value && <Button type="text" disabled={disabled || busy} onClick={() => onChange?.("")}>移除封面</Button>}
      <span className={styles.hint}>建议 1200 × 600 · PNG / JPG / WebP / GIF / AVIF · 最大 5MB</span>
    </Space>
    <input ref={input} hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={async event => {
      const file = event.target.files?.[0]; event.target.value = "";
      if (!file || disabled || busyRef.current) return;
      if (!["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"].includes(file.type)) { message.warning("请选择 PNG、JPG、WebP、GIF 或 AVIF 图片"); return; }
      if (!file.size || file.size > 5 * 1024 * 1024) { message.warning("封面图片不能为空且不能超过5MB"); return; }
      const version = generation.current;
      busyRef.current = true; setBusy(true); onBusyChange?.(true);
      try {
        const url = await s3.upload(file, communityId, kind + "-cover");
        if (version === generation.current) { onChange?.(url); message.success("封面已上传，保存后生效"); }
      } catch (error) { if (version === generation.current) message.error(error instanceof Error ? error.message : "封面上传失败"); }
      finally { busyRef.current = false; if (version === generation.current) { setBusy(false); callback.current?.(false); } }
    }} />
  </div>;
}
