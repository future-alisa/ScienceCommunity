"use client";
import React, { useState } from "react";
import { Upload, Button, Form, Input, message, Avatar, Tag } from "antd";
import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { api } from "@/app/api/ApiService";
import styles from "./create-community.module.css";

const { TextArea } = Input;

interface Member {
  id: string;
  name: string;
  email: string;
}

const CreateCommunityForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteInputVisible, setInviteInputVisible] = useState(false);
  const [inviteInputValue, setInviteInputValue] = useState("");

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleInvite = () => {
    if (!inviteInputValue) {
      message.warning("请输入成员邮箱");
      return;
    }

    const newMember = {
      id: `member-${Date.now()}`,
      name: inviteInputValue.split("@")[0],
      email: inviteInputValue,
    };

    setMembers([...members, newMember]);
    setInviteInputValue("");
    setInviteInputVisible(false);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj as File);
    }
    formData.append("members", JSON.stringify(members));

    console.log("Form data:", Object.fromEntries(formData.entries()));
    message.success("社区创建请求已提交");

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    api.post("/api/community/save", {
      communityId: "",
      communityName: values.name,
      communityDescription: values.description,
      communityUrl: "",
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>创建新社区</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
        >
          {/* 社区名称 */}
          <Form.Item
            name="name"
            label="社区名称"
            rules={[{ required: true, message: "请输入社区名称" }]}
          >
            <Input placeholder="为您的社区起个名字" size="large" />
          </Form.Item>

          {/* 社区描述 */}
          <Form.Item
            name="description"
            label="社区描述"
            rules={[{ required: true, message: "请输入社区描述" }]}
          >
            <TextArea
              rows={4}
              placeholder="描述您的社区目的、主题或规则"
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* 社区图片 */}
          <Form.Item
            name="image"
            label="社区封面图片"
            extra="建议尺寸 1200x600 像素，支持 JPG/PNG 格式"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept="image/png,image/jpeg"
              maxCount={1}
              className={styles.uploadWrapper}
            >
              {fileList.length >= 1 ? null : (
                <div className={styles.uploadPlaceholder}>
                  <UploadOutlined style={{ fontSize: "24px" }} />
                  <div style={{ marginTop: "0.5rem" }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* 邀请成员 */}
          <Form.Item label="邀请成员">
            <div className={styles.memberTags}>
              {members.map((member) => (
                <Tag
                  key={member.id}
                  closable
                  onClose={() => removeMember(member.id)}
                  className={styles.memberTag}
                >
                  <Avatar size={20} style={{ marginRight: "0.25rem" }}>
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {member.email}
                </Tag>
              ))}
            </div>

            {inviteInputVisible ? (
              <div className={styles.inviteInputWrapper}>
                <Input
                  type="email"
                  placeholder="输入成员邮箱"
                  value={inviteInputValue}
                  onChange={(e) => setInviteInputValue(e.target.value)}
                  onPressEnter={handleInvite}
                  className={styles.inviteInput}
                />
                <Button type="primary" onClick={handleInvite}>
                  添加
                </Button>
                <Button onClick={() => setInviteInputVisible(false)}>
                  取消
                </Button>
              </div>
            ) : (
              <Button
                icon={<UserAddOutlined />}
                onClick={() => setInviteInputVisible(true)}
              >
                邀请成员
              </Button>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitButton}
            >
              创建社区
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateCommunityForm;
