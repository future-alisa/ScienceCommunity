"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Button,
  Form,
  Input,
  message,
  Avatar,
  Tag,
  InputRef,
  Flex,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import styles from "./create-community.module.css";
import CommunityService from "@/services/CommunityService";
import { s3 } from "@/services/S3Service";
import { Community } from "@/model/Community";
import { IdUtils } from "@/util/IdUtil";

const { TextArea } = Input;

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Tag {
  id: string;
  name: string;
}

const CreateCommunityForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteInputVisible, setInviteInputVisible] = useState(false);
  const [inviteInputValue, setInviteInputValue] = useState("");

  const [tags, setTags] = useState<Tag[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

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

  const onFinish = async (values: any) => {
    try {
      let communityImageUrl = "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as File;

        communityImageUrl = await s3.upload(file);

        message.success("图片上传成功");
        console.log("Uploaded image URL:", communityImageUrl);
      }
      const community: Community = {
        communityId: IdUtils.uuid32(),
        communityName: values.name,
        communityDescription: values.description,
        communityUrl: "",
        communityImageUrl: communityImageUrl,
        communityTag: values.tag,
      };

      await CommunityService.upsertCommunity(community);
    } catch (error) {
      message.error("操作失败");
    }
  };

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag.name !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    const trimmedValue = inputValue.trim();
    // 检查是否存在同名标签
    const isDuplicate = tags.some((tag) => tag.name === trimmedValue);

    if (trimmedValue && !isDuplicate) {
      const newTag: Tag = {
        id: IdUtils.uuid32(),
        name: trimmedValue,
      };
      setTags([...tags, newTag]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

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

          {/* 社区标签 */}
          <Form.Item name="tag" label="社区标签">
            <Flex gap="4px 0" wrap="wrap" align="center">
              {tags.map((tag) => (
                <Tag key={tag.id} closable onClose={() => handleClose(tag.id)}>
                  {tag.name}
                </Tag>
              ))}

              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 100 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag
                  onClick={showInput}
                  style={{ borderStyle: "dashed", background: "#fff" }}
                >
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Flex>
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
