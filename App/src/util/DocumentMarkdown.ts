import { marked, Token, Tokens } from "marked";
import { Descendant } from "slate";
import { CustomText } from "../../slate";
import { parseDocument } from "./DocumentContent";
import { isDocumentUrl } from "./DocumentUrl";

function inline(tokens: Token[] = []): CustomText[] {
  const result: CustomText[] = [];
  for (const token of tokens) {
    if (token.type === "strong" || token.type === "em" || token.type === "codespan") {
      const mark = token.type === "strong" ? "bold" : token.type === "em" ? "italic" : "code";
      const children = token.type === "codespan" ? [{ text: (token as Tokens.Codespan).text }] : inline((token as Tokens.Strong).tokens);
      result.push(...children.map((leaf) => ({ ...leaf, [mark]: true })));
    } else if (token.type === "link") {
      const link = token as Tokens.Link;
      result.push(...inline(link.tokens).map((leaf) => ({ ...leaf, ...(isDocumentUrl(link.href) ? { url: link.href } : {}) })));
    } else if (token.type === "br") result.push({ text: "\n" });
    else result.push({ text: "text" in token ? String(token.text) : token.raw });
  }
  return result.length ? result : [{ text: "" }];
}
export function fromMarkdown(source: string, lookup?: (name: string) => { documentId: string; name: string } | undefined): Descendant[] {
  const blocks: unknown[] = [];
  // A reference is deliberately an immutable document ID, so renaming notes never breaks links.
  const sections = source.split(/(^!\[\[[^\]\n]+\]\]$)/m);
  for (const section of sections) {
    const reference = section.match(/^!\[\[([^\]|\n]+)(?:\|([^\]\n]*))?\]\]$/);
    if (reference) {
      const target = /^[a-fA-F0-9]{32}$/.test(reference[1]) ? { documentId: reference[1], name: reference[2] || "引用文档" } : lookup?.(reference[1].trim());
      if (!target) throw new Error(`无法唯一找到“${reference[1]}”，请在富文本中通过“嵌入文档”选择`);
      blocks.push({ type: "document-reference", documentId: target.documentId, name: reference[2] || target.name, children: [{ text: "" }] }); continue;
    }
    for (const token of marked.lexer(section, { gfm: true })) {
      if (token.type === "space") continue;
      if (token.type === "heading") blocks.push({ type: "heading", level: (token as Tokens.Heading).depth, children: inline((token as Tokens.Heading).tokens) });
      else if (token.type === "code") blocks.push({ type: "code-block", language: (token as Tokens.Code).lang || "", children: [{ text: (token as Tokens.Code).text }] });
      else if (token.type === "list") {
        const list = token as Tokens.List;
        if (list.items.some((item) => item.tokens.some((child) => child.type === "list"))) throw new Error("暂不支持嵌套列表，请先调整为单层列表后切换富文本");
        blocks.push({ type: list.ordered ? "numbered-list" : "bulleted-list", children: list.items.map((item) => ({ type: "list-item", children: inline(marked.Lexer.lexInline(item.text)) })) });
      } else if (token.type === "blockquote") blocks.push({ type: "block-quote", children: inline(marked.Lexer.lexInline((token as Tokens.Blockquote).text)) });
      else if (token.type === "paragraph") {
        const paragraph = token as Tokens.Paragraph;
        const image = paragraph.tokens.length === 1 && paragraph.tokens[0].type === "image" ? paragraph.tokens[0] as Tokens.Image : undefined;
        const attachment = paragraph.text.match(/^\[附件：([^\]]*)\]\(([^\s)]+)\)$/);
        if (image && isDocumentUrl(image.href)) blocks.push({ type: "image", url: image.href, name: image.text || "图片", children: [{ text: "" }] });
        else if (attachment && isDocumentUrl(attachment[2])) blocks.push({ type: "attachment", url: attachment[2], name: attachment[1] || "附件", children: [{ text: "" }] });
        else blocks.push({ type: "paragraph", children: inline(paragraph.tokens) });
      } else if (token.raw.trim()) blocks.push({ type: "paragraph", children: [{ text: token.raw.trimEnd() }] });
    }
  }
  return parseDocument(JSON.stringify(blocks.length ? blocks : [{ type: "paragraph", children: [{ text: "" }] }]));
}
function leaves(children: CustomText[]): string {
  return children.map((leaf) => {
    let value = leaf.text.replace(/([\\*_`\[\]#>+.!()|~-])/g, "\\$1");
    if (leaf.code) {
      const fence = "`".repeat(Math.max(1, ...Array.from(leaf.text.matchAll(/`+/g), (match) => match[0].length + 1)));
      value = fence + (leaf.text.includes("`") ? " " : "") + leaf.text + (leaf.text.includes("`") ? " " : "") + fence;
    }
    if (leaf.bold) value = "**" + value + "**";
    if (leaf.italic) value = "*" + value + "*";
    if (leaf.underline) throw new Error("Markdown 不支持当前下划线格式，请先取消下划线再切换，以免丢失格式");
    if (leaf.url && isDocumentUrl(leaf.url)) value = "[" + value + "](" + leaf.url + ")";
    return value;
  }).join("");
}
export function toMarkdown(value: Descendant[]): string {
  return value.map((node) => {
    if (!("type" in node)) return node.text;
    if (node.align && node.align !== "left") throw new Error("Markdown 不支持当前对齐格式，请先改为左对齐再切换，以免丢失格式");
    if (node.type === "document-reference") return "![[" + node.documentId + "|" + node.name.replace(/[\]\n]/g, "") + "]]";
    if (node.type === "image") return "![" + node.name.replace(/[\[\]\n]/g, "") + "](" + node.url + ")";
    if (node.type === "attachment") return "[附件：" + node.name.replace(/[\[\]\n]/g, "") + "](" + node.url + ")";
    if (node.type === "code-block") {
      const text = node.children.map((leaf) => leaf.text).join("");
      const fence = "`".repeat(Math.max(3, ...Array.from(text.matchAll(/`+/g), (match) => match[0].length + 1)));
      return fence + (node.language || "") + "\n" + text + "\n" + fence;
    }
    if (node.type === "bulleted-list" || node.type === "numbered-list") return node.children.map((item, index) => (node.type === "numbered-list" ? (index + 1) + ". " : "- ") + leaves(item.children)).join("\n");
    const text = leaves(node.children as CustomText[]);
    return node.type === "heading" ? "#".repeat(node.level) + " " + text : node.type === "block-quote" ? text.split("\n").map((line) => "> " + line).join("\n") : text;
  }).join("\n\n");
}
