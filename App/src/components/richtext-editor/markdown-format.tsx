import { Fragment, ReactNode } from "react";
import katex from "katex";
import type { CustomText } from "../../../slate";
import { inline, parseMarkdownTable } from "@/util/DocumentMarkdown";
import { readMath } from "@/util/MarkdownMath";
import { isDocumentUrl } from "@/util/DocumentUrl";

export function Formula({ source, display = false }: { source: string; display?: boolean }) {
  try {
    if (source.length > 4096) return <code title="公式过长">{source}</code>;
    const html = katex.renderToString(source, { displayMode: display, trust: false, strict: "ignore", maxExpand: 1000, maxSize: 20 });
    return <span className={display ? "document-math-display" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code title="公式无法解析">{source}</code>;
  }
}

export function renderInlineMath(text: string): ReactNode[] | undefined {
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of Array.from(text.matchAll(/\\[^\n]|\$/g))) {
    const start = match.index ?? 0;
    if (start < cursor || (match[0] !== "\\(" && match[0] !== "$")) continue;
    if (match[0] === "$" && (text[start - 1] === "$" || text[start + 1] === "$")) continue;
    const math = readMath(text.slice(start, start + 4096));
    if (!math) continue;
    parts.push(text.slice(cursor, start), <Formula key={start} source={math.formula} />);
    cursor = start + math.raw.length;
  }
  if (cursor) return [...parts, text.slice(cursor)];
}

export function formatMarkdownLeaf(leaf: CustomText, content: ReactNode, renderMath: boolean) {
  if (renderMath && leaf.math !== false && !leaf.code) {
    const block = readMath(leaf.text, true);
    const math = block?.raw === leaf.text ? <Formula source={block.formula} display /> : renderInlineMath(leaf.text);
    if (math) content = <><span hidden aria-hidden="true">{content}</span><span contentEditable={false}>{math}</span></>;
  }
  if (leaf.bold) content = <strong>{content}</strong>;
  if (leaf.code) content = <code>{content}</code>;
  if (leaf.italic) content = <em>{content}</em>;
  if (leaf.underline) content = <u>{content}</u>;
  if (leaf.strike) content = <del>{content}</del>;
  if (leaf.url && isDocumentUrl(leaf.url)) content = <a href={leaf.url} target="_blank" rel="noopener noreferrer">{content}</a>;
  return content;
}

export function MarkdownTable({ source }: { source: string }) {
  const table = parseMarkdownTable(source);
  if (!table) return <pre>{source}</pre>;
  const cell = (item: typeof table.header[number]) => inline(item.tokens).map((leaf, index) => (
    <Fragment key={index}>{formatMarkdownLeaf(leaf, leaf.text, true)}</Fragment>
  ));
  return <div className="document-table-scroll" role="region" aria-label="文档表格" tabIndex={0}>
    <table>
      <thead><tr>{table.header.map((item, index) => <th key={index} scope="col" style={{ textAlign: table.align[index] ?? undefined }}>{cell(item)}</th>)}</tr></thead>
      <tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((item, column) => <td key={column} style={{ textAlign: table.align[column] ?? undefined }}>{cell(item)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
