import { Space } from "antd";
import { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RenderElement } from "./render-element";
import { RenderLeaf } from "./render-leaf";
import { toggleBlock, toggleMark } from "./editor-action";
import Toolbar from "./toolbar";

interface MyEditorProps {
  initialValue: Descendant[];
  onChange?: (value: Descendant[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}
const MyEditor = ({ initialValue, onChange, readOnly = false }: MyEditorProps) => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate
      onChange={(e) => onChange && onChange(e)}
      editor={editor}
      initialValue={initialValue}
    >
      {!readOnly && <Space style={{ marginBottom: 8 }}>
        <Toolbar editor={editor} />
      </Space>}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Editable
          readOnly={readOnly}
          renderElement={RenderElement}
          renderLeaf={RenderLeaf}
          spellCheck
          autoFocus={!readOnly}
          style={{ padding: "8px", minHeight: "100%" }}
        />
      </div>
    </Slate>
  );
};

export { MyEditor };
