"use client";

import { notFound } from "next/navigation";
import type { Descendant } from "slate";
import { MyEditor } from "@/components/richtext-editor";
import InsertTools from "@/components/richtext-editor/insert-tools";
import { AutoRunPlaygrounds, encodePlayground, javascriptDemoLanguage } from "@/components/algorithm-demo/javascript-demo";

import { diningExample, diningSolutionExample } from "./dining-example";

const comparisonSource = encodePlayground(diningExample);
const solutionSource = encodePlayground(diningSolutionExample);
const bundledExamples = [comparisonSource, solutionSource];

const sample: Descendant[] = [
  { type: "heading", level: 1, children: [{ text: "哲学家进餐 · 代码 Playground" }] },
  { type: "paragraph", children: [{ text: "先点「单步」观察循环等待，再对照下方的解法。需要修改时点「显示代码」，编辑后点「重新运行」。试用页的编辑只在当前页面生效。" }] },
  { type: "code-block", language: javascriptDemoLanguage, children: [{ text: comparisonSource }] },
  { type: "heading", level: 2, children: [{ text: "用统一的取筷顺序避免死锁" }] },
  { type: "paragraph", children: [{ text: "给每根筷子编号。所有人先取两根相邻筷子中编号较小的那根，再取编号较大的那根。五人时，5 号先拿 1 号筷子，再拿 5 号筷子。对照圆桌下方的顺序表，观察 5 号等待期间谁能继续。" }] },
  { type: "code-block", language: javascriptDemoLanguage, children: [{ text: solutionSource }] },
  { type: "paragraph", children: [{ text: "如果有人已经拿着一根筷子，他等待的下一根编号一定更大。沿着等待关系追下去，编号必须不断增大，因而无法绕回起点。这就消除了循环等待。" }] },
];

export default function JavaScriptDemoPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 16px" }}>
    <AutoRunPlaygrounds.Provider value={bundledExamples}>
      <MyEditor initialValue={sample} tools={<InsertTools />} />
    </AutoRunPlaygrounds.Provider>
  </main>;
}
