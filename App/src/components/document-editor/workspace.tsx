"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Segmented, Space, message } from "antd";
import { Descendant, Node } from "slate";
import { MyEditor } from "@/components/richtext-editor";
import { EmbedPathContext } from "@/components/richtext-editor/document-embed";
import InsertTools from "@/components/richtext-editor/insert-tools";
import { fromMarkdown, toMarkdown } from "@/util/DocumentMarkdown";
import styles from "./workspace.module.css";
import DocumentService from "@/services/DocumentService";
import { s3 } from "@/services/S3Service";
import { clipboardImages } from "@/components/richtext-editor/paste-images";
import { Document } from "@/model/Document";
interface Props { value: Descendant[]; onChange: (value: Descendant[]) => void; onError: (error: string) => void; communityId?: string; documentId?: string; disabled?: boolean; preview?: boolean; }
export function DocumentWorkspace({ value, onChange, onError, communityId, documentId, disabled = false, preview = false }: Props) {
  const [mode, setMode] = useState<"rich" | "source" | "split">("rich");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [pasting, setPasting] = useState(false);
  const pasteVersion = useRef(0);
  const pasteBusy = useRef(false);
  useEffect(() => { pasteVersion.current++; setPasting(false); pasteBusy.current = false; return () => { pasteVersion.current++; }; }, [communityId, mode, disabled, preview]);
  useEffect(() => { if (!fullscreen) return; const previous = window.document.body.style.overflow; window.document.body.style.overflow = "hidden"; return () => { window.document.body.style.overflow = previous; }; }, [fullscreen]);
  const [documents, setDocuments] = useState<Document[]>([]);
  useEffect(() => { let active = true; setDocuments([]); if (communityId) DocumentService.getDocumentByTypeAndCommunity(communityId).then((docs) => { if (active) setDocuments(docs.filter((doc) => doc.documentId !== documentId)); }).catch(() => {}); return () => { active = false; }; }, [communityId, documentId]);
  const root = useRef<HTMLDivElement>(null);
  const headings = useMemo(() => value.filter((node) => "type" in node && node.type === "heading").map((node) => Node.string(node)), [value]);
  function changeMode(next: typeof mode) {
    if (mode === "rich" && next !== "rich") {
      try { setSource(toMarkdown(value)); } catch (error) { message.warning(error instanceof Error ? error.message : "无法切换"); return; }
    }
    if (next === "rich" && error) { message.warning("请先修正 Markdown 中提示的问题再切换"); return; }
    if (next === "rich") setRevision((n) => n + 1);
    setMode(next);
  }
  function editSource(text: string) {
    setSource(text);
    try { const parsed = fromMarkdown(text, (name) => { const matches = documents.filter((doc) => doc.documentName === name); return matches.length === 1 ? { documentId: matches[0].documentId, name: matches[0].documentName } : undefined; }); setError(""); onError(""); onChange(parsed); }
    catch (exception) { const reason = exception instanceof Error ? exception.message : "Markdown 格式无效"; setError(reason); onError(reason); }
  }
  const tools = <InsertTools communityId={communityId} documentId={documentId} />;
  return <div ref={root} className={`${styles.workspace} ${fullscreen ? styles.fullscreen : ""}`}>
    <div className={styles.topbar}>
      <Segmented aria-label="编辑模式" disabled={disabled || preview} value={mode} onChange={(value) => changeMode(value as typeof mode)} options={[{value:"rich",label:"富文本"},{value:"source",label:"Markdown"},{value:"split",label:"分栏预览"}]} />
      <Space><span className={styles.hint}>专注书写，连接知识</span><Button type="text" onClick={() => setFullscreen((value) => !value)}>{fullscreen ? "退出专注" : "专注模式"}</Button></Space>
    </div>
    {error && <Alert type="error" showIcon message={error} />}
    <div className={styles.layout}>
      <div className={styles.main}>
        <EmbedPathContext.Provider value={documentId ? [documentId] : []}>
          {mode === "rich" ? <MyEditor key={revision} initialValue={value} communityId={communityId} readOnly={disabled || preview} onChange={onChange} tools={tools} />
            : <div className={mode === "split" ? styles.split : ""}>
              <div className={styles.sourcePane}>
                <div className={styles.paneLabel}>MARKDOWN · 支持标题、列表、引用、代码、图片与 ![[文档名称]]</div>
                <textarea aria-label="Markdown 源码" value={source} onChange={(event) => editSource(event.target.value)} spellCheck={false} disabled={disabled || preview} readOnly={pasting}
                  onPaste={(event) => {
                    if (disabled || preview) return;
                    const files = clipboardImages(event.clipboardData);
                    if (!files.length) return;
                    event.preventDefault();
                    if (!communityId) { message.warning("请先选择目标社区，再粘贴图片"); return; }
                    if (pasteBusy.current) { message.info("图片正在上传，请稍候再粘贴"); return; }
                    pasteBusy.current = true; setPasting(true);
                    const version = pasteVersion.current;
                    const start = event.currentTarget.selectionStart, end = event.currentTarget.selectionEnd;
                    const dismiss = message.loading("正在上传粘贴的图片…", 0);
                    void (async () => {
                      const images: Descendant[] = [];
                      try {
                        for (const file of files) {
                          if (version !== pasteVersion.current) break;
                          if (file.size > 20 * 1024 * 1024) { message.warning("图片不能超过20MB"); continue; }
                          try {
                            const url = await s3.upload(file, communityId);
                            images.push({ type: "image", url, name: (file.name || "粘贴图片.png").slice(0,255), children: [{ text: "" }] });
                          } catch (error) { if (version === pasteVersion.current) message.error(error instanceof Error ? error.message : "图片上传失败"); }
                        }
                        if (version === pasteVersion.current && images.length) editSource(source.slice(0,start) + "\n\n" + toMarkdown(images) + "\n\n" + source.slice(end));
                      } finally {
                        dismiss();
                        if (version === pasteVersion.current) { pasteBusy.current = false; setPasting(false); }
                      }
                    })();
                  }} placeholder="# 从一个标题开始\n\n在这里自由书写…" />
              </div>
              {mode === "split" && <div className={styles.previewPane}><div className={styles.paneLabel}>阅读预览</div><MyEditor key={JSON.stringify(value)} initialValue={value} readOnly /></div>}
            </div>}
        </EmbedPathContext.Provider>
      </div>
      {headings.length > 0 && mode !== "source" && <aside className={styles.outline}><span>本文目录</span>{headings.map((heading, index) => <button key={index} type="button" onClick={() => root.current?.querySelector("[data-slate-editor]")?.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6")[index]?.scrollIntoView({ behavior:"smooth", block:"center" })}>{heading || "未命名标题"}</button>)}</aside>}
    </div>
    <div className={styles.footer}>正文统一保存为结构化文档 · 图片与附件独立存储 · Ctrl / ⌘ S 保存</div>
  </div>;
}
