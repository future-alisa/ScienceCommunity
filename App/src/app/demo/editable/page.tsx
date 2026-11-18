"use client";

import { notFound } from "next/navigation";
import type { Descendant } from "slate";
import { MyEditor } from "@/components/richtext-editor";
import { exampleFlow, flowLanguage } from "@/components/algorithm-demo/flow";
import InsertTools from "@/components/richtext-editor/insert-tools";

const sample: Descendant[] = [
  { type: "paragraph", children: [{ text: "点击「编辑流程」修改下方示例，或通过「插入交互演示 → 制作流程演示」从空白开始。这个试用页的编辑只在当前页面中生效。" }] },
  { type: "code-block", language: flowLanguage, children: [{ text: JSON.stringify(exampleFlow) }] },
];

export default function EditableDemo() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
    <h1>可编辑的交互文档</h1>
    <MyEditor initialValue={sample} tools={<InsertTools />} />
  </main>;
}
