import { RenderLeafProps, useReadOnly } from "slate-react";
import { formatMarkdownLeaf } from "./markdown-format";

export function RenderLeaf({ attributes, children, leaf }: RenderLeafProps) {
  const readOnly = useReadOnly();
  return <span {...attributes}>{formatMarkdownLeaf(leaf, children, readOnly)}</span>;
}
