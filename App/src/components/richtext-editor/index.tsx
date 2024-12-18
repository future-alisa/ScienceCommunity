"use client";
import { Button, Space } from "antd";
import { useCallback, useState } from "react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact } from "slate-react";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const MyEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const [initialValue, setInitialValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "欢迎来到 SlateJS 世界！这是一个简单的示例文章。" }],
    },
    {
      type: "heading",
      level: 1,
      children: [{ text: "第一部分：介绍" }],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      children: [{ text: "主要特点" }],
    },
    {
      type: "list",
      children: [
        {
          type: "list-item",
          children: [{ text: "灵活的文档模型" }],
        },
        {
          type: "list-item",
          children: [{ text: "丰富的插件系统" }],
        },
        {
          type: "list-item",
          children: [{ text: "强大的扩展性" }],
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。",
        },
      ],
    },
    {
      type: "block-quote",
      children: [{ text: "A wise quote." }],
    },
  ]);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const renderElement = (props: any) => {
    console.log(props.element);
    const style = { textAlign: props.element.align };
    switch (props.element.type) {
      case "heading":
        if (props.element.level == 1) {
          return (
            <h1 style={style} {...props.attributes}>
              {props.children}
            </h1>
          );
        } else if (props.element.level == 2) {
          return (
            <h2 style={style} {...props.attributes}>
              {props.children}
            </h2>
          );
        } else {
          return (
            <h3 style={style} {...props.attributes}>
              {props.children}
            </h3>
          );
        }
      case "bulleted-list":
        return (
          <ul style={style} {...props.attributes}>
            {props.children}
          </ul>
        );
      case "list-item":
        return (
          <li style={style} {...props.attributes}>
            {props.children}
          </li>
        );
      case "numbered-list":
        return (
          <ol style={style} {...props.attributes}>
            {props.children}
          </ol>
        );
      case "block-quote":
        return (
          <blockquote style={style} {...props.attributes}>
            {props.children}
          </blockquote>
        );
      default:
        return (
          <p style={style} {...props.attributes}>
            {props.children}
          </p>
        );
    }
  };
  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.code) {
      children = <code>{children}</code>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  };

  const LIST_TYPES = ["numbered-list", "bulleted-list"];
  const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
  const handleChange = (e: any) => {
    console.log(e);
  };

  const toggleBlock = (editor: any, format: string) => {
    const isActive = isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    });
    let newProperties: Partial<SlateElement>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      };
    } else {
      newProperties = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
      };
    }
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (editor, format, blockType = "type") => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n[blockType] === format,
      })
    );

    return !!match;
  };

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  return (
    <div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={(e) => {
          handleChange(e);
          console.log(editor.children);
        }}
      >
        <Space>
          <BoldOutlined onClick={() => toggleMark(editor, "bold")} />
          <ItalicOutlined onClick={() => toggleMark(editor, "italic")} />
          <UnderlineOutlined onClick={() => toggleMark(editor, "underline")} />
          <OrderedListOutlined
            onClick={() => toggleBlock(editor, "numbered-list")}
          />
          <UnorderedListOutlined
            onClick={() => toggleBlock(editor, "bulleted-list")}
          />
          <AlignLeftOutlined onClick={() => toggleBlock(editor, "left")} />
          <AlignCenterOutlined onClick={() => toggleBlock(editor, "center")} />
          <AlignRightOutlined onClick={() => toggleBlock(editor, "right")} />
        </Space>
        <Editable
          readOnly={false}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }
          }}
        />
      </Slate>
    </div>
  );
};

export { MyEditor };
