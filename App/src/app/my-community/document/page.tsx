"use client";
import styles from "@/app/my-community/document/post.module.css";
import { MyEditor } from "@/components/richtext-editor";
import { Button } from "antd";
import { useState } from "react";
import { Descendant } from "slate";

export default function Page() {
  const [value, setValue] = useState<Descendant[]>([
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
  const onChange = (value: Descendant[]) => {
    setValue(value);
  };
  return (
    <div>
      <Button type="primary">发布</Button>
      <MyEditor initialValue={value} onChange={onChange} />;
    </div>
  );
}
