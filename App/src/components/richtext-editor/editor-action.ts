import { Editor, Transforms, Element as SlateElement, Range, Path } from "slate";
import { BulletedListElement, NumberedListElement } from "../../../slate";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

type BlockFormat =
  | "heading"
  | "bulleted-list"
  | "numbered-list"
  | "list-item"
  | "block-quote"
  | "paragraph"
  | "left"
  | "center"
  | "right"
  | "justify";
type MarkFormat = "bold" | "italic" | "underline" | "code";

const toggleBlock = (editor: Editor, format: BlockFormat, level?: number) => {
  const isTextAlign = TEXT_ALIGN_TYPES.includes(format);
  const isList = LIST_TYPES.includes(format);

  const isActive = isBlockActive(
    editor,
    format,
    isTextAlign ? "align" : "type",
    level
  );

  if (isTextAlign) {
    Transforms.setNodes<SlateElement>(editor, {
      align: format as any,
    });
    return;
  }

  // 1. 先清理旧的列表包装
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as string),
    split: true,
  });

  // 2. 设定新的节点类型
  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : (format as any),
    ...(format === "heading" ? { level: isActive ? undefined : level } : {}),
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: BulletedListElement | NumberedListElement = {
      type: format as any,
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  }
};
const toggleMark = (editor: Editor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: Editor,
  format: string,
  blockType = "type",
  level?: number
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (Editor.isEditor(n) || !SlateElement.isElement(n)) return false;

        // 1. 判断对齐 (align) 或普通类型 (type)
        const isBasicMatch = n[blockType as keyof SlateElement] === format;

        // 3. 标题特殊逻辑：不但 type 要对，level 也要对
        if (format === "heading" && level !== undefined) {
          return n.type === "heading" && n.level === level;
        }

        return isBasicMatch;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Return true when Enter is handled here; ordinary paragraphs use Slate's default.
const handleDocumentEnter = (editor: Editor, exitCode = false): boolean => {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) return false;
  const [entry] = Array.from(Editor.nodes(editor, { mode: "lowest", match: (node) =>
    SlateElement.isElement(node) && ["list-item", "heading", "block-quote", "code-block"].includes(node.type) }));
  if (!entry || !SlateElement.isElement(entry[0])) return false;
  if (entry[0].type === "code-block") {
    if (exitCode) Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] }, { at: Path.next(entry[1]), select: true });
    else editor.insertText("\n");
    return true;
  }
  if (entry[0].type === "list-item") {
    if (Editor.string(editor, entry[1]) !== "") return false;
    const format = isBlockActive(editor, "numbered-list") ? "numbered-list" : "bulleted-list";
    toggleBlock(editor, format);
    return true;
  }
  Editor.withoutNormalizing(editor, () => {
    editor.insertBreak();
    Transforms.setNodes(editor, { type: "paragraph" });
  });
  return true;
};
export { isBlockActive, isMarkActive, toggleBlock, toggleMark, handleDocumentEnter };
