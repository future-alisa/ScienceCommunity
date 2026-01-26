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
}
const MyEditor = ({ initialValue, onChange }: MyEditorProps) => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate
      onChange={(e) => onChange && onChange(e)}
      editor={editor}
      initialValue={initialValue}
    >
      <Space style={{ marginBottom: 8 }}>
        <Toolbar editor={editor} />
      </Space>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Editable
          readOnly={false}
          renderElement={RenderElement}
          renderLeaf={RenderLeaf}
          spellCheck
          autoFocus
          style={{ padding: "8px", minHeight: "100%" }}
        />
      </div>
    </Slate>
  );
};

export { MyEditor };
