import { Descendant } from "slate";
import { isDocumentUrl } from "./DocumentUrl";
export const MAX_DOCUMENT_BYTES = 1024 * 1024;
export const emptyDocument: Descendant[] = [{ type: "paragraph", children: [{ text: "" }] }];
export function parseDocument(content: string): Descendant[] {
  if (new TextEncoder().encode(content).length > MAX_DOCUMENT_BYTES) throw new Error("文档正文不能超过1MB");
  const value: unknown = JSON.parse(content);
  function valid(node: unknown, text: boolean, depth: number): boolean {
    if (depth > 50 || !node || typeof node !== "object" || Array.isArray(node)) return false;
    const item = node as Record<string, unknown>;
    if (text) return typeof item.text === "string" && !("children" in item) && !("type" in item)
      && ["bold", "italic", "underline", "code"].every((mark) => !(mark in item) || typeof item[mark] === "boolean")
      && (!("url" in item) || isDocumentUrl(item.url));
    if ("text" in item) return false;
    if (item.type === "list") item.type = "bulleted-list";
    if (["image", "attachment", "document-reference"].includes(String(item.type))) {
      if (typeof item.name !== "string" || item.name.length > 255 || !Array.isArray(item.children) || item.children.length !== 1 || !valid(item.children[0], true, depth + 1) || (item.children[0] as { text: string }).text !== "") return false;
      return item.type === "document-reference" ? typeof item.documentId === "string" && /^[a-fA-F0-9]{32}$/.test(item.documentId) : isDocumentUrl(item.url);
    }
    if (!["paragraph", "heading", "block-quote", "code-block", "bulleted-list", "numbered-list"].includes(String(item.type)) && !(depth > 0 && item.type === "list-item")) return false;
    if (item.type === "code-block" && "language" in item && (typeof item.language !== "string" || !/^[\w+-]{0,32}$/.test(item.language))) return false;
    if ("align" in item && !["left", "center", "right", "justify"].includes(String(item.align))) return false;
    if (item.type === "heading" && ![1, 2, 3, 4, 5, 6].includes(item.level as number)) return false;
    const list = item.type === "bulleted-list" || item.type === "numbered-list";
    return Array.isArray(item.children) && item.children.length > 0 && item.children.every((child) =>
      (!list || (child && typeof child === "object" && child.type === "list-item")) && valid(child, !list, depth + 1));
  }
  if (!Array.isArray(value) || !value.length || !value.every((node) => valid(node, false, 0))) throw new Error("文档内容格式无效，无法打开编辑器");
  return value as Descendant[];
}
