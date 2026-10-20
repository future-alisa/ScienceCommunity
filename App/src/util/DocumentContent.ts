import { Descendant } from "slate";

export const emptyDocument: Descendant[] = [{ type: "paragraph", children: [{ text: "" }] }];
export function parseDocument(content: string): Descendant[] {
  const value: unknown = JSON.parse(content);
  function valid(node: unknown, depth: number): boolean {
    if (depth > 100 || !node || typeof node !== "object") return false;
    const item = node as Record<string, unknown>;
    if (typeof item.text === "string") return true;
    return typeof item.type === "string" && Array.isArray(item.children) && item.children.length > 0 && item.children.every((child) => valid(child, depth + 1));
  }
  if (!Array.isArray(value) || !value.length || !value.every((node) => valid(node, 0) && typeof node === "object" && "children" in node)) {
    throw new Error("文档内容格式无效，无法打开编辑器");
  }
  return value as Descendant[];
}
