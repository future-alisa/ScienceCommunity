"use client";
import { useState, useRef, useEffect } from "react";
import { message } from "antd";
import { s3 } from "@/services/S3Service";
import { clipboardImages, pasteImages } from "./paste-images";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { RenderElement } from "./render-element";
import { RenderLeaf } from "./render-leaf";
import { toggleMark, handleDocumentEnter } from "./editor-action";
import Toolbar from "./toolbar";
import styles from "./richtext-editor.module.css";
interface MyEditorProps {
  initialValue: Descendant[];
  onChange?: (value: Descendant[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  tools?: React.ReactNode;
  communityId?: string;
}
export function MyEditor({ initialValue, onChange, tools, communityId, readOnly = false, placeholder = "从一个问题、一个观点开始写作…" }: MyEditorProps) {
  const scope = useRef({ communityId, readOnly });
  scope.current = { communityId, readOnly };
  const mounted = useRef(true);
  const pasting = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [editor] = useState(() => {
    const editor = withHistory(withReact(createEditor()));
    const isVoid = editor.isVoid;
    editor.isVoid = (element) => ["image", "attachment", "document-reference"].includes(element.type) || isVoid(element);
    return editor;
  });
  return <div className={`${styles.editor} ${readOnly ? styles.readOnly : ""}`}>
    <Slate editor={editor} initialValue={initialValue} onChange={(value) => {
      if (editor.operations.some((operation) => operation.type !== "set_selection")) onChange?.(value);
    }}>
      {!readOnly && <><Toolbar />{tools && <div className={styles.insertTools}>{tools}</div>}</>}
      <Editable className={styles.content} aria-label={readOnly ? "文档正文" : "编辑文档正文"}
        style={{ minHeight: readOnly ? 0 : "clamp(520px, 65vh, 900px)" }}
        readOnly={readOnly} placeholder={placeholder} renderElement={RenderElement} renderLeaf={RenderLeaf} spellCheck
        onPaste={(event) => {
          if (readOnly) return;
          const files = clipboardImages(event.clipboardData);
          if (!files.length) return;
          event.preventDefault();
          if (!communityId) { message.warning("请先选择目标社区，再粘贴图片"); return true; }
          if (pasting.current) { message.info("图片正在上传，请稍候再粘贴"); return true; }
          pasting.current = true;
          const dismiss = message.loading("正在上传粘贴的图片…", 0);
          void pasteImages(editor, files, file => s3.upload(file, communityId),
            () => mounted.current && !scope.current.readOnly && scope.current.communityId === communityId,
            text => { message.error(text); }).finally(() => { pasting.current = false; dismiss(); });
          return true;
        }}
        onKeyDown={(event) => {
          if (readOnly || event.nativeEvent.isComposing) return;
          if ((event.ctrlKey || event.metaKey) && ["b", "i", "u"].includes(event.key.toLowerCase())) {
            event.preventDefault();
            toggleMark(editor, ({ b: "bold", i: "italic", u: "underline" } as const)[event.key.toLowerCase() as "b" | "i" | "u"]);
          }
          if (event.key === "Enter" && !event.shiftKey) {
            if (handleDocumentEnter(editor, event.ctrlKey || event.metaKey)) event.preventDefault();
          }
        }} />
    </Slate>
  </div>;
}
