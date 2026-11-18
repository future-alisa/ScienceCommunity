"use client";
import { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Modal, Select, message } from "antd";
import { ReactEditor, useSlate } from "slate-react";
import { Transforms, Editor, Range, RangeRef } from "slate";
import { Document } from "@/model/Document";
import DocumentService from "@/services/DocumentService";
import { s3 } from "@/services/S3Service";
import { encodePlayground, javascriptDemoLanguage } from "@/components/algorithm-demo/javascript-demo";
import { FlowEditor, flowLanguage } from "@/components/algorithm-demo/flow";
import { demoLanguage, demos } from "@/components/algorithm-demo";
export default function InsertTools({ communityId, documentId }: { communityId?: string; documentId?: string }) {
  const editor = useSlate();
  const [flowOpen, setFlowOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState<string>();
  const [loading, setLoading] = useState(false);
  const selection = useRef<RangeRef | null>(null);
  useEffect(() => () => { selection.current?.unref(); }, []);
  function captureSelection() { selection.current?.unref(); selection.current = editor.selection ? Editor.rangeRef(editor, editor.selection, { affinity: "forward" }) : null; }
  const input = useRef<HTMLInputElement>(null);
  function insert(node: Parameters<typeof Transforms.insertNodes>[1]) {
    const range = selection.current?.unref(); selection.current = null;
    if (range) { try { Transforms.select(editor, range); } catch { Transforms.select(editor, Editor.end(editor, [])); } }
    else Transforms.select(editor, Editor.end(editor, []));
    Transforms.insertNodes(editor, node);
    Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] });
  }
  function insertDemo(language: string, text: string, range: Range | null) {
        const index = range ? Range.end(range).path[0] + 1 : editor.children.length;
        Transforms.insertNodes(editor, [
          { type: "code-block", language, children: [{ text }] },
          { type: "paragraph", children: [{ text: "" }] },
        ], { at: [index] });
        Transforms.select(editor, Editor.start(editor, [index + 1]));
        ReactEditor.focus(editor);
  }
  async function choose() {
    captureSelection(); setSelected(undefined); setOpen(true); setLoading(true);
    try { setDocuments((await DocumentService.getDocumentByTypeAndCommunity(communityId!)).filter((doc) => doc.documentId !== documentId)); }
    catch (error) { message.error(error instanceof Error ? error.message : "文档列表加载失败"); }
    finally { setLoading(false); }
  }
  return <>
    <Button size="small" disabled={!communityId || loading} onMouseDown={(e) => e.preventDefault()} onClick={() => { captureSelection(); input.current?.click(); }}>插入图片 / 附件</Button>
    <Button size="small" disabled={!communityId || loading} onMouseDown={(e) => e.preventDefault()} onClick={() => void choose()}>嵌入文档</Button>
    <Button size="small" onMouseDown={event => event.preventDefault()} onClick={() => {
      const starter = encodePlayground({
        html: '<button id="counter">点击：0</button>',
        css: "",
        javascript: 'const button = document.getElementById("counter");\nlet count = 0;\nbutton.onclick = () => { button.textContent = "点击：" + ++count; };',
      });
      insertDemo(javascriptDemoLanguage, starter, editor.selection);
    }}>插入交互代码</Button>
    <Dropdown trigger={["click"]} menu={{
      items: [{ key: "create-flow", label: "制作流程演示" }, ...demos.map(demo => ({ key: demo.id, label: demo.title }))],
      onClick: ({ key }) => {
        if (key === "create-flow") {
          captureSelection();
          setFlowOpen(true);
        } else insertDemo(demoLanguage, key, editor.selection);
      },
    }}>
      <Button size="small" onMouseDown={event => event.preventDefault()}>插入交互演示</Button>
    </Dropdown>
    {flowOpen && <FlowEditor onClose={() => {
      selection.current?.unref();
      selection.current = null;
      setFlowOpen(false);
    }} onSave={flow => {
      const range = selection.current?.unref() ?? null;
      selection.current = null;
      setFlowOpen(false);
      insertDemo(flowLanguage, JSON.stringify(flow), range);
    }} />}
    <input ref={input} type="file" hidden accept="image/png,image/jpeg,image/gif,image/webp,image/avif,.pdf,.txt,.md,.docx,.zip" onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
      if (file.size > 20 * 1024 * 1024) { message.warning("附件不能超过20MB"); return; }
      setLoading(true);
      try { const url = await s3.upload(file, communityId); insert({ type: file.type.startsWith("image/") ? "image" : "attachment", url, name: file.name.slice(0,255), children: [{ text: "" }] }); message.success("附件已插入，请保存文档"); }
      catch (error) { message.error(error instanceof Error ? error.message : "上传失败"); }
      finally { setLoading(false); }
    }} />
    {loading && <span>正在处理…</span>}
    <Modal title="嵌入社区文档" open={open} onCancel={() => setOpen(false)} okButtonProps={{ disabled: !selected }} onOk={() => {
      const document = documents.find((doc) => doc.documentId === selected);
      if (document) { insert({ type: "document-reference", documentId: document.documentId, name: document.documentName, children: [{ text: "" }] }); setOpen(false); }
    }}>
      <p>引用原文档的最新内容，阅读权限仍以原文档为准。</p>
      <Select style={{ width: "100%" }} showSearch optionFilterProp="label" value={selected} placeholder="选择要嵌入的文档" loading={loading} onChange={setSelected} options={documents.map((doc) => ({ value: doc.documentId, label: doc.documentName }))} />
    </Modal>
  </>;
}
