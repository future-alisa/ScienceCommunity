import { Space } from "antd";
import { Editor } from "slate";
import { useSlate } from "slate-react";
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
import {
  isMarkActive,
  isBlockActive,
  toggleBlock,
  toggleMark,
} from "./editor-action";

interface ToolbarProps {
  editor?: Editor;
}

const ActionButton = ({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  icon?: any;
}) => (
  <div
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    style={{
      cursor: "pointer",
      color: active ? "#1890ff" : "rgba(0,0,0,0.65)",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "28px",
      height: "28px",
      borderRadius: "4px",
      background: active ? "#e6f7ff" : "transparent",
      fontWeight: active ? "bold" : "normal",
      transition: "all 0.3s",
    }}
  >
    {Icon ? <Icon /> : children}
  </div>
);

const Toolbar = ({ editor: propsEditor }: ToolbarProps) => {
  const slateEditor = useSlate();
  const editor = propsEditor || slateEditor;

  const Divider = () => (
    <div
      style={{
        width: "1px",
        height: "18px",
        background: "#ddd",
        margin: "0 4px",
      }}
    />
  );

  return (
    <Space style={{ marginBottom: 8 }} wrap>
      {/* 标题切换组*/}
      <ActionButton
        active={isBlockActive(editor, "heading", "type", 1)}
        onClick={() => toggleBlock(editor, "heading", 1)}
      >
        H1
      </ActionButton>
      <ActionButton
        active={isBlockActive(editor, "heading", "type", 2)}
        onClick={() => toggleBlock(editor, "heading", 2)}
      >
        H2
      </ActionButton>
      <ActionButton
        active={isBlockActive(editor, "heading", "type", 3)}
        onClick={() => toggleBlock(editor, "heading", 3)}
      >
        H3
      </ActionButton>

      <Divider />

      {/* 基础行内格式 */}
      <ActionButton
        active={isMarkActive(editor, "bold")}
        onClick={() => toggleMark(editor, "bold")}
        icon={BoldOutlined}
      />
      <ActionButton
        active={isMarkActive(editor, "italic")}
        onClick={() => toggleMark(editor, "italic")}
        icon={ItalicOutlined}
      />
      <ActionButton
        active={isMarkActive(editor, "underline")}
        onClick={() => toggleMark(editor, "underline")}
        icon={UnderlineOutlined}
      />

      <Divider />

      {/* 列表格式 */}
      <ActionButton
        active={isBlockActive(editor, "numbered-list")}
        onClick={() => toggleBlock(editor, "numbered-list")}
        icon={OrderedListOutlined}
      />
      <ActionButton
        active={isBlockActive(editor, "bulleted-list")}
        onClick={() => toggleBlock(editor, "bulleted-list")}
        icon={UnorderedListOutlined}
      />

      <Divider />

      {/* 对齐格式 */}
      <ActionButton
        active={isBlockActive(editor, "left", "align")}
        onClick={() => toggleBlock(editor, "left")}
        icon={AlignLeftOutlined}
      />
      <ActionButton
        active={isBlockActive(editor, "center", "align")}
        onClick={() => toggleBlock(editor, "center")}
        icon={AlignCenterOutlined}
      />
      <ActionButton
        active={isBlockActive(editor, "right", "align")}
        onClick={() => toggleBlock(editor, "right")}
        icon={AlignRightOutlined}
      />
    </Space>
  );
};

export default Toolbar;
