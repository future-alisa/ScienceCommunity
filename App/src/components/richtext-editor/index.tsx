"use client";
import { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const renderElement = (props: any) => {
  console.log(props.element);
  switch (props.element.type) {
    case "heading":
      if (props.element.level == 1) {
        return <h1 {...props.attributes}>{props.children}</h1>;
      } else if (props.element.level == 2) {
        return <h2 {...props.attributes}>{props.children}</h2>;
      } else {
        return <h3 {...props.attributes}>{props.children}</h3>;
      }
    case "list":
      return <ul {...props.attributes}>{props.children}</ul>;
    case "list-item":
      return <li {...props.attributes}>{props.children}</li>;
    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
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
  ]);

  return (
    <div>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          readOnly
          renderElement={renderElement}
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
