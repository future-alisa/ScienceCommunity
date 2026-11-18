import { RenderElementProps } from "slate-react";
import { useReadOnly, useSlateStatic, ReactEditor } from "slate-react";
import { Editor, Node, Transforms } from "slate";
import { DocumentEmbed } from "./document-embed";
import { isDocumentUrl } from "@/util/DocumentUrl";
import { createElement, useState } from "react";
import { useStorageUrl } from "@/components/storage-image";

import { GDevelopDialog, GDevelopPlayer, gdevelopLanguage, gdevelopUrl } from "@/components/algorithm-demo/gdevelop";
import { JavaScriptEditor, JavaScriptPlayer, javascriptDemoLanguage } from "@/components/algorithm-demo/javascript-demo";
import { FlowEditor, FlowPlayer, flowLanguage, parseFlow } from "@/components/algorithm-demo/flow";
import BinarySearchDemo from "@/components/algorithm-demo/binary-search-demo";
import { SearchConfigDialog } from "@/components/algorithm-demo/search-config-dialog";
import { resolveDemo } from "@/components/algorithm-demo";

export const RenderElement = (props: RenderElementProps) => {
  const [editingDemo, setEditingDemo] = useState(false);
  const [editingGDevelop, setEditingGDevelop] = useState(false);
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
  if (element.type === "code-block" && element.language === gdevelopLanguage) {
    const url = gdevelopUrl(Node.string(element));
    return <div {...props.attributes}>
      <div contentEditable={false}>
        {!readOnly && <>
          <button type="button" onClick={() => setEditingGDevelop(true)}>编辑作品链接</button>
          <button type="button" onClick={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}>移除作品</button>
          <GDevelopDialog open={editingGDevelop} initialUrl={url} onClose={() => setEditingGDevelop(false)} onSave={next => {
            const path = ReactEditor.findPath(editor, element);
            Editor.withoutNormalizing(editor, () => {
              Transforms.removeNodes(editor, { at: path });
              Transforms.insertNodes(editor, { ...element, children: [{ text: next }] }, { at: path });
            });
            setEditingGDevelop(false);
          }} />
        </>}
        {url ? <GDevelopPlayer key={url} url={url} /> : <p>GDevelop 作品链接无效。</p>}
      </div>
      {props.children}
    </div>;
  }
  if (element.type === "code-block" && element.language === javascriptDemoLanguage) {
    const source = Node.string(element);
    return <div {...props.attributes}>
      <div contentEditable={false}>
        {readOnly ? <JavaScriptPlayer key={source} source={source} /> : <JavaScriptEditor source={source}
          onRemove={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}
          onChange={next => {
            if (source === next) return;
            const path = [...ReactEditor.findPath(editor, element), 0];
            Editor.withoutNormalizing(editor, () => {
              if (source) editor.apply({ type: "remove_text", path, offset: 0, text: source });
              if (next) editor.apply({ type: "insert_text", path, offset: 0, text: next });
            });
          }} />}
      </div>
      {props.children}
    </div>;
  }
  if (element.type === "code-block" && element.language === flowLanguage) {
    const source = Node.string(element);
    const flow = parseFlow(source);
    return <div {...props.attributes}>
      <div contentEditable={false}>
        {!readOnly && <>
          <button type="button" onClick={() => setEditingDemo(true)}>编辑流程</button>
          <button type="button" onClick={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}>移除演示</button>
          {editingDemo && <FlowEditor initial={flow} onClose={() => setEditingDemo(false)} onSave={next => {
            const path = ReactEditor.findPath(editor, element);
            Editor.withoutNormalizing(editor, () => {
              Transforms.removeNodes(editor, { at: path });
              Transforms.insertNodes(editor, { ...element, children: [{ text: JSON.stringify(next) }] }, { at: path });
            });
            setEditingDemo(false);
          }} />}
        </>}
        {flow ? <FlowPlayer key={source} flow={flow} /> : <p>流程演示配置无效。</p>}
      </div>
      {props.children}
    </div>;
  }
  const demo = resolveDemo(element);
  if (demo) {
    return <div {...props.attributes}>
      <div contentEditable={false}>
        {!readOnly && <button type="button" className="document-asset-remove" onClick={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}>移除演示</button>}
        {demo.id === "binary-search" ? <>
          {!readOnly && <button type="button" onClick={() => setEditingDemo(true)}>编辑演示参数</button>}
          <BinarySearchDemo key={Node.string(element)} values={demo.config.values} initialTarget={demo.config.target} />
          {!readOnly && editingDemo && <SearchConfigDialog open config={demo.config} onClose={() => setEditingDemo(false)}
            onSave={config => {
              if (element.type !== "code-block") return;
              const path = ReactEditor.findPath(editor, element);
              Editor.withoutNormalizing(editor, () => {
                Transforms.removeNodes(editor, { at: path });
                Transforms.insertNodes(editor, { ...element, children: [{ text: JSON.stringify({ id: demo.id, config }) }] }, { at: path });
              });
              setEditingDemo(false);
            }} />}
        </> : <demo.Component />}
      </div>
      {props.children}
    </div>;
  }
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
