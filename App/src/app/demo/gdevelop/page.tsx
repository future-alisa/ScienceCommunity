import { notFound } from "next/navigation";
import type { Descendant } from "slate";
import DocumentReader from "@/components/document-reader";

const content: Descendant[] = [
  { type: "heading", level: 1, children: [{ text: "在文档里运行 GDevelop 作品" }] },
  { type: "paragraph", children: [{ text: "点「运行演示」查看 GDevelop 官方的 3D Platformer 示例。托管作品可能跳转到发布页，可用「在新标签页打开」继续试玩。" }] },
  { type: "code-block", language: "science-gdevelop", children: [{ text: "https://games.gdevelop-app.com/game-70f68d73-466a-4aa5-b061-d46686fe93ac/index.html" }] },
  { type: "heading", level: 2, children: [{ text: "如何嵌入自己的作品" }] },
  { type: "paragraph", children: [{ text: "在 GDevelop 中编辑场景和事件，发布作品后取得独立播放地址。在社区富文本工具栏选择「插入交互演示 → 嵌入 GDevelop 作品」，粘贴地址并试运行。已经插入的作品可用「编辑作品链接」替换地址。" }] },
];

export default function GDevelopDemo() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
    <DocumentReader value={content} />
    <a href="https://gdevelop.io/game-example/free/simple-platformer" target="_blank" rel="noopener noreferrer">
      打开 GDevelop 官方可编辑模板
    </a>
  </main>;
}
