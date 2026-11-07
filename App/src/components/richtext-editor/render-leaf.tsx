import { RenderLeafProps } from "slate-react";
import { isDocumentUrl } from "@/util/DocumentUrl";

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.url && isDocumentUrl(leaf.url)) children = <a href={leaf.url} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <span {...attributes}>{children}</span>;
};

export const RenderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;
