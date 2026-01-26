import { Editor, Transforms, Element as SlateElement } from "slate";
import { BulletedListElement, NumberedListElement } from "../../../slate";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

type BlockFormat =
  | "heading"
  | "bulleted-list"
  | "numbered-list"
  | "list-item"
  | "block-quote"
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

        // 2. 列表特殊逻辑：只要在 li 里，对应的 ul/ol 就算激活
        const isListMatch =
          LIST_TYPES.includes(format) && n.type === "list-item";

        // 3. 标题特殊逻辑：不但 type 要对，level 也要对
        if (format === "heading" && level !== undefined) {
          return n.type === "heading" && n.level === level;
        }

        return isBasicMatch || isListMatch;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export { isBlockActive, isMarkActive, toggleBlock, toggleMark };
