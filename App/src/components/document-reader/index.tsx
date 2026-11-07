"use client";
import { useRef, useState } from "react";
import { Descendant, Node } from "slate";
import { MyEditor } from "@/components/richtext-editor";
import styles from "./reader.module.css";

export default function DocumentReader({ value }: { value: Descendant[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const headings = value.filter(node => "type" in node && node.type === "heading");
  const level = Math.min(...headings.map(node => node.type === "heading" ? node.level : 6));
  const chapters = headings.map((node,index) => ({ node, index })).filter(item => item.node.type === "heading" && item.node.level === level);
  return <div className={styles.layout}>
    {chapters.length > 1 && <nav aria-label="章节目录" className={styles.toc}>
      <h2>章节目录</h2>
      {chapters.map(({ node, index }) => <button key={index} type="button" aria-current={active === index ? "location" : undefined} onClick={() => {
        setActive(index);
        const heading = root.current?.querySelector("[data-slate-editor]")?.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6")[index];
        heading?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}>{Node.string(node) || "未命名章节"}</button>)}
    </nav>}
    <div className={styles.body} ref={root}><MyEditor initialValue={value} readOnly /></div>
  </div>;
}
