"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Flex,
  Typography,
  Divider,
  Button,
  Form,
  Input,
  message,
  Skeleton,
  Space,
} from "antd";
import {
  GithubOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { UserContext } from "@/context/UserContext";
import UserService from "@/services/UserService";

const { Text } = Typography;

interface UserProfile {
  username: string;
  bio: string;
  email: string;
  github: string;
  location: string;
  avatar?: string;
}

const UserProfilePage: React.FC = () => {
  const usercontext = useContext(UserContext);
  const [form] = Form.useForm<UserProfile>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const avatarUrl = Form.useWatch("avatar", form);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await UserService.getUserProfile(usercontext?.name);
        setInitialData(data);
        form.setFieldsValue(data);
      } catch (e) {
        message.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [usercontext?.name, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // await UserService.update(values);
      setIsEditing(false);
      message.success("资料更新成功");
    } catch (err) {
      console.log("校验失败:", err);
    }
  };

  if (loading) return <Skeleton active />;

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", background: "#f5f5f5" }}
    >
      <Card
        style={{ width: 450, borderRadius: 12 }}
        title="个人资料"
        extra={
          <Space>
            {!isEditing ? (
              <Button
                type="primary"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                编辑
              </Button>
            ) : (
              <>
                <Button type="primary" size="small" onClick={handleSave}>
                  保存
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    form.resetFields();
                    setIsEditing(false);
                  }}
                >
                  关闭
                </Button>
              </>
            )}
          </Space>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "70px" }}
          wrapperCol={{ flex: "auto" }}
          initialValues={initialData || {}}
        >
          <Flex vertical align="center" gap="large">
            <Avatar size={80} src={avatarUrl} icon={<UserOutlined />} />
            <Divider style={{ margin: 0 }} />

            <div style={{ width: "100%" }}>
              <EditableRow
                isEditing={isEditing}
                label="姓名"
                name="username"
                icon={<UserOutlined />}
              />
              <EditableRow isEditing={isEditing} label="签名" name="bio" />
              <EditableRow
                isEditing={isEditing}
                label="邮箱"
                name="email"
                icon={<MailOutlined />}
              />
              <EditableRow
                isEditing={isEditing}
                label="GitHub"
                name="github"
                icon={<GithubOutlined />}
              />
              <EditableRow
                isEditing={isEditing}
                label="地点"
                name="location"
                icon={<EnvironmentOutlined />}
              />
            </div>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
};

interface EditableRowProps {
  isEditing: boolean;
  label: string;
  name: keyof UserProfile;
  icon?: React.ReactNode;
}

const EditableRow: React.FC<EditableRowProps> = ({
  isEditing,
  label,
  name,
  icon,
}) => {
  const value = Form.useWatch(name);

  return (
    <Form.Item name={name} label={label} style={{ marginBottom: "12px" }}>
      {isEditing ? (
        <Input
          prefix={icon}
          placeholder={`请输入${label}`}
          style={{ height: "32px" }}
        />
      ) : (
        <div
          style={{
            height: "32px",
            padding: "4px 11px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Space size="small">
            {icon && (
              <span style={{ color: "#8c8c8c", display: "flex" }}>{icon}</span>
            )}
            <Text style={{ color: "rgba(0, 0, 0, 0.88)" }}>
              {value || "未设置"}
            </Text>
          </Space>
        </div>
      )}
    </Form.Item>
  );
};

export default UserProfilePage;
