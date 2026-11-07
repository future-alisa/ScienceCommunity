import { RenderElementProps } from "slate-react";
import { useReadOnly, useSlateStatic, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { DocumentEmbed } from "./document-embed";
import { isDocumentUrl } from "@/util/DocumentUrl";
import { createElement } from "react";
import { useStorageUrl } from "@/components/storage-image";

export const RenderElement = (props: RenderElementProps) => {
  const readOnly = useReadOnly();
  const editor = useSlateStatic();
  const element = props.element;
  const assetUrl = useStorageUrl(element.type === "image" || element.type === "attachment" ? element.url : "");
  if (element.type === "heading") return createElement(`h${element.level}`, { ...props.attributes, style: { textAlign: element.align } }, props.children);
  if (element.type === "image" || element.type === "attachment" || element.type === "document-reference") return <div {...props.attributes}>
    <div contentEditable={false} className="document-asset">
      {!readOnly && <button type="button" className="document-asset-remove" aria-label={`移除${element.name}`} onClick={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}>移除</button>}
      {element.type === "document-reference" ? <DocumentEmbed documentId={element.documentId} name={element.name} /> : isDocumentUrl(element.url) ? element.type === "image"
        ? <figure><img src={assetUrl || undefined} alt={element.name} loading="lazy" /><figcaption>{element.name}{!assetUrl && "（附件不可访问或正在加载）"}</figcaption></figure>
        : <div><a className="document-attachment" href={assetUrl || undefined} target="_blank" rel="noopener noreferrer" download>↧ {element.name}{!assetUrl && "（附件不可访问或正在加载）"}</a>
          {assetUrl && /\.pdf(?:$|[?#])/i.test(element.url) && <object className="document-pdf" data={assetUrl} type="application/pdf" aria-label={element.name}><p>浏览器无法内嵌此 PDF，请通过上方链接打开。</p></object>}
        </div> : <p>附件地址无效</p>}
    </div>{props.children}
  </div>;
  if (element.type === "code-block") return <pre {...props.attributes} className="document-code"><code data-language={element.language || "text"}>{props.children}</code></pre>;
  const textAlignStyle = { textAlign: props.element.align };

  const listStyle = {
    ...textAlignStyle,
    paddingLeft: "1em",
    margin: "0.2em 0",
  };

  switch (props.element.type as string) {
    case "heading":
      if (props.element.type === "heading" && props.element.level == 1) {
        return (
          <h1 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h1>
        );
      } else if (props.element.type === "heading" && props.element.level == 2) {
        return (
          <h2 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h2>
        );
      } else {
        return (
          <h3 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h3>
        );
      }
    case "list":
    case "bulleted-list":
      return (
        <ul style={listStyle} {...props.attributes}>
          {props.children}
        </ul>
      );
    case "list-item":
      return (
        <li style={listStyle} {...props.attributes}>
          {props.children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={listStyle} {...props.attributes}>
          {props.children}
        </ol>
      );
    case "block-quote":
      return (
        <blockquote style={textAlignStyle} {...props.attributes}>
          {props.children}
        </blockquote>
      );
    default:
      return (
        <p style={textAlignStyle} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};
