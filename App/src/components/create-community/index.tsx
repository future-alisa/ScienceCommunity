"use client";
import React, { useEffect, useRef, useState } from "react";
import {
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
  UserAddOutlined,
} from "@ant-design/icons";
import styles from "./create-community.module.css";
import CommunityService from "@/services/CommunityService";
import CoverPicker from "@/components/cover-picker";
import { Community } from "@/model/Community";
import { IdUtils } from "@/util/IdUtil";
import { useRouter } from "next/navigation";
import MemberService from "@/services/MemberService";

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
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverBusy = useRef(false);
  const submittingRef = useRef(false);
  const [form] = Form.useForm();
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteInputVisible, setInviteInputVisible] = useState(false);
  const [inviteInputValue, setInviteInputValue] = useState("");

  const [tags, setTags] = useState<Tag[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);


  const handleInvite = () => {
    const email = inviteInputValue.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.warning("请输入有效的成员邮箱");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      message.warning("该成员已在列表中");
      return;
    }

    const newMember = {
      id: `member-${Date.now()}`,
      name: email.split("@")[0],
      email,
    };

    setMembers([...members, newMember]);
    setInviteInputValue("");
    setInviteInputVisible(false);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const onFinish = async (values: any) => {
    if (submittingRef.current) return;
    if (coverBusy.current) { message.warning("请等待封面上传完成"); return; }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const community: Community = {
        communityId: IdUtils.uuid32(),
        communityName: values.name,
        communityDescription: values.description,
        communityUrl: "",
        communityImageUrl: values.image || "",
        communityTag: values.tag,
      };

      await CommunityService.upsertCommunity(community);
      const failed: string[] = [];
      if (members.length) {
        try {
          const role = (await MemberService.roles()).find((item) => item.name === "member");
          if (!role) throw new Error("成员角色未配置");
          for (const member of members) {
            try { await MemberService.add(community.communityId, member.email, role.id); }
            catch { failed.push(member.email); }
          }
        } catch { failed.push(...members.map((member) => member.email)); }
      }
      if (failed.length) message.warning(`社区已创建，以下成员添加失败，请在我的社区中重试：${failed.join("、")}`, 8);
      else message.success("社区创建成功");
      router.push(`/community/settings?communityId=${community.communityId}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
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
          disabled={submitting}
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
            extra="可选，社区创建后也可以在我的社区中更换。"
          >
            <CoverPicker kind="community" disabled={submitting} onBusyChange={busy => { coverBusy.current=busy; setCoverUploading(busy); }} />
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
              loading={submitting}
              disabled={coverUploading}
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
