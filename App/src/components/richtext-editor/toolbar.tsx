import { useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, OrderedListOutlined, UnorderedListOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, UndoOutlined, RedoOutlined, CodeOutlined } from "@ant-design/icons";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./editor-action";
import styles from "./richtext-editor.module.css";
export default function Toolbar() {
  const editor = useSlate();
  const block = (label: string, format: Parameters<typeof toggleBlock>[1], children: React.ReactNode, level?: number) =>
    <button type="button" title={label} aria-label={label} aria-pressed={isBlockActive(editor, format, ["left", "center", "right"].includes(format) ? "align" : "type", level)}
      onMouseDown={(event) => event.preventDefault()} onClick={() => toggleBlock(editor, format, level)}>{children}</button>;
  const mark = (label: string, format: Parameters<typeof toggleMark>[1], children: React.ReactNode) =>
    <button type="button" title={label} aria-label={label} aria-pressed={isMarkActive(editor, format)} onMouseDown={(event) => event.preventDefault()} onClick={() => toggleMark(editor, format)}>{children}</button>;
  return <div className={styles.toolbar} role="toolbar" aria-label="文档格式工具">
    <button type="button" title="撤销（Ctrl / ⌘ Z）" aria-label="撤销" disabled={!editor.history.undos.length} onMouseDown={(e) => e.preventDefault()} onClick={() => HistoryEditor.undo(editor)}><UndoOutlined /></button>
    <button type="button" title="重做（Ctrl / ⌘ Shift Z）" aria-label="重做" disabled={!editor.history.redos.length} onMouseDown={(e) => e.preventDefault()} onClick={() => HistoryEditor.redo(editor)}><RedoOutlined /></button>
    <span className={styles.divider} />
    {block("正文", "paragraph", "正文")}{[1, 2, 3].map((level) => <span key={level}>{block(`${level}级标题`, "heading", `H${level}`, level)}</span>)}
    <span className={styles.divider} />
    {mark("加粗（Ctrl / ⌘ B）", "bold", <BoldOutlined />)}{mark("斜体（Ctrl / ⌘ I）", "italic", <ItalicOutlined />)}{mark("下划线（Ctrl / ⌘ U）", "underline", <UnderlineOutlined />)}{mark("行内代码", "code", <CodeOutlined />)}
    <span className={styles.divider} />
    {block("引用", "block-quote", "❝")}{block("有序列表", "numbered-list", <OrderedListOutlined />)}{block("无序列表", "bulleted-list", <UnorderedListOutlined />)}
    <span className={styles.divider} />
    {block("左对齐", "left", <AlignLeftOutlined />)}{block("居中", "center", <AlignCenterOutlined />)}{block("右对齐", "right", <AlignRightOutlined />)}
  </div>;
}
