"use client";
import { MyEditor } from "@/components/richtext-editor";
import { Button, Input, message, Modal, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import { Descendant } from "slate";

import styles from "./publish.module.css"; // 引入 CSS Module
import DocumentService from "@/services/DocumentService";
import { Community } from "@/model/Community";
import CommunityService from "@/services/CommunityService";

export default function Page() {
  const baseId = "3284c1f1a8104b8796b4d70277b4947a";
  const caseId = "1a5b4c52169d4228a5b1da149511e717";
  const postId = "129f2c1efc9d4e8a821d202bec89f288";

  const [typeId, setTypeId] = useState(baseId);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "欢迎来到 SlateJS 世界！这是一个简单的示例文章。" }],
    },
    { type: "heading", level: 1, children: [{ text: "第一部分：介绍" }] },
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
    { type: "heading", level: 2, children: [{ text: "主要特点" }] },
    {
      type: "bulleted-list",
      children: [
        { type: "list-item", children: [{ text: "灵活的文档模型" }] },
        { type: "list-item", children: [{ text: "丰富的插件系统" }] },
        { type: "list-item", children: [{ text: "强大的扩展性" }] },
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
    { type: "block-quote", children: [{ text: "A wise quote." }] },
  ]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>();
  const [communities, setCommunities] = useState<Community[]>([]);

  const onChange = (value: Descendant[]) => setValue(value);

  const publish = async (description: string) => {
    await DocumentService.upsertDocument({
      documentId: "",
      documentCategoryId: typeId,
      documentCommunityId: selectedCommunityId || "",
      documentAuthorId: "",

      documentName: title || "未命名文档",
      documentDescription: description,

      documentCreateDate: new Date(),
      documentUpdateDate: new Date(),

      documentThumbnailUrl: "",
      documentContent: JSON.stringify(value),
    });
  };

  const handleBtnP = async () => {
    if (!title.trim()) {
      return message.warning("请输入文档标题后再发布");
    }

    let tempDescription = "";

    Modal.confirm({
      title: "完善发布信息",
      icon: null,
      content: (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>文档描述/摘要：</div>
          <Input.TextArea
            rows={4}
            placeholder="请输入文档简要描述，方便大家快速了解..."
            onChange={(e) => (tempDescription = e.target.value)}
          />
        </div>
      ),
      okText: "确认发布",
      cancelText: "取消",
      onOk: () => publish(tempDescription),
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      const mockData: Community[] =
        await CommunityService.getCommunitiesByUser();
      console.log("xxx", mockData);
      setCommunities(mockData);

      if (mockData.length > 0) {
        setSelectedCommunityId(mockData[0].communityId);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* 标题输入区域 */}
        <div className={styles.titleWrapper} style={{ marginBottom: 20 }}>
          <Input
            size="large"
            placeholder="请输入文档标题"
            variant="borderless"
            style={{ fontSize: 32, fontWeight: "bold", padding: "10px 0" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* 编辑器区域 */}
        <div className={styles.editorWrapper}>
          <MyEditor initialValue={value} onChange={onChange} />
        </div>

        {/* 底部操作区域 */}
        <div className={styles.bottomBar}>
          <Radio.Group
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            options={[
              { value: baseId, label: "基础知识" },
              { value: caseId, label: "案例" },
              { value: postId, label: "推文" },
            ]}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>发布至：</span>
            <Select
              placeholder="请选择目标社区"
              style={{ width: 200 }}
              value={selectedCommunityId}
              onChange={(value) => setSelectedCommunityId(value)}
              options={communities.map((c) => ({
                value: c.communityId,
                label: c.communityName,
              }))}
            />
            <Button type="primary" onClick={handleBtnP}>
              发布
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
