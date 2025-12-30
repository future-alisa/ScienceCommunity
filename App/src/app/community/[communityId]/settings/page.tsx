"use client";
import { SettingOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Card,
  Divider,
  Select,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";
import styles from "./settings.module.css";
import { useState } from "react";

const { Title, Text } = Typography;

interface DataType {
  key: string;
  name: string;
  email: string;
  role: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "角色",
    dataIndex: "role",
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>删除</a>
      </Space>
    ),
  },
];

const defaultData: DataType[] = [
  { key: "1", name: "syb1", email: "syb1.alisa@email", role: "普通成员" },
  { key: "2", name: "syb2", email: "syb2.alisa@email", role: "普通成员" },
  { key: "3", name: "syb3", email: "syb3.alisa@email", role: "普通成员" },
];

export default function Page() {
  const [data, setData] = useState(defaultData);
  function handleChange(
    value: string,
    option:
      | { value: string; label: string; disabled?: undefined }
      | { value: string; label: string; disabled: true }
      | (
          | { value: string; label: string; disabled?: undefined }
          | { value: string; label: string; disabled: true }
        )[]
  ): void {
    console.log("first");
  }
  const inviteCommunityMember = () => {
    console.log("invite community member");
  };

  const inviteChannelMember = () => {
    console.log("invite channel member");
  };
  return (
    <div style={{ flex: 1 }}>
      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>社区管理</span>
          </Space>
        }
        className={styles.card}
      >
        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            <Space>
              <span>成员管理</span>
            </Space>
          </Title>
          <Space>
            <UserAddOutlined onClick={inviteCommunityMember} />
          </Space>
          <div className={styles.settingItem}>
            <Table columns={columns} dataSource={data}></Table>
          </div>
        </div>
        <Divider />
        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            <Space>
              <span>频道管理</span>
            </Space>
          </Title>

          <div className={styles.settingItem}>
            <Table columns={columns} dataSource={data}></Table>
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            <Space>
              <span>频道成员管理</span>
            </Space>
          </Title>
          <Space>
            <UserAddOutlined onClick={inviteChannelMember} />
          </Space>
          <div className={styles.settingItem}>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
                { value: "disabled", label: "Disabled", disabled: true },
              ]}
            />
            <Table columns={columns} dataSource={data}></Table>
          </div>
        </div>

        <Divider />
        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            其他设置
          </Title>

          <div className={styles.settingItem}>
            <Space size="large">
              <Text>待定</Text>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
