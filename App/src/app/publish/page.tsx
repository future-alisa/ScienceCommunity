"use client";
import { MyEditor } from "@/components/richtext-editor";
import { Button, Flex, Radio } from "antd";
import { api } from "../api/ApiService";
import { useContext, useState } from "react";
import { Descendant } from "slate";
import { UserContext } from "@/context/UserContext";

export default function Page() {
  const userContext = useContext(UserContext);
  const publish = async (value: String) => {
    console.log("first", value,userContext.name);
    await api.post("/api/document/save", {
      documentId: "",
      documentCategoryId: typeId,
      documentAuthor: "",
      documentCreateDate: "2025-01-03 13:00:00",
      documentUpdateDate: "2025-01-03 13:00:00",
      documentContent: value,
    });
  };
  const handleBtnP = async () => {
    await publish(JSON.stringify(value));
  };
  const baseId = "3284c1f1a8104b8796b4d70277b4947a";
  const caseId = "1a5b4c52169d4228a5b1da149511e717";
  const postId = "129f2c1efc9d4e8a821d202bec89f288";
  const [typeId, setTypeId] = useState(baseId);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "欢迎来到 SlateJS 世界！这是一个简单的示例文章。" }],
    },
    {
      type: "heading",
      level: 1,
      children: [{ text: "第一部分：介绍" }],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      children: [{ text: "主要特点" }],
    },
    {
      type: "list",
      children: [
        {
          type: "list-item",
          children: [{ text: "灵活的文档模型" }],
        },
        {
          type: "list-item",
          children: [{ text: "丰富的插件系统" }],
        },
        {
          type: "list-item",
          children: [{ text: "强大的扩展性" }],
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。",
        },
      ],
    },
    {
      type: "block-quote",
      children: [{ text: "A wise quote." }],
    },
  ]);
  const onChange = (value: Descendant[]) => {
    setValue(value);
  };
  return (
    <Flex
      vertical
      style={{
        overflow: "auto",
        padding: "8px",
      }}
    >
      <MyEditor initialValue={value} onChange={onChange} />
      <Flex justify="center">
        <Radio.Group
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          options={[
            { value: baseId, label: "基础知识" },
            { value: caseId, label: "案例" },
            { value: postId, label: "推文" },
          ]}
        />
        <Button type="primary" onClick={handleBtnP}>
          发布
        </Button>
      </Flex>
    </Flex>
  );
}
