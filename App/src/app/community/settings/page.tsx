"use client";
import {
  SettingOutlined,
  UserAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Card,
  Divider,
  Select,
  Space,
  Table,
  TableProps,
  Typography,
  Layout,
  Menu,
} from "antd";
import styles from "./settings.module.css";
import { useEffect, useState } from "react";
import CommunityService from "@/services/CommunityService";
import { Community } from "@/model/Community";
import { CommunityUserVo } from "@/model/CommunityUser";
import { Channel } from "@/model/Channel";
import ChannelService from "@/services/ChannelService";
import { ChannelUserVo } from "@/model/ChannelUser";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const communityColumns: TableProps<CommunityUserVo>["columns"] = [
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  { title: "角色", dataIndex: "role", key: "role" },
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

const channelColumns: TableProps<ChannelUserVo>["columns"] = [
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  { title: "角色", dataIndex: "role", key: "role" },
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

export default function Page() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>();
  const [communityMembers, setCommunityMembers] = useState<CommunityUserVo[]>();
  const [channelMembers, setChannelMembers] = useState<ChannelUserVo[]>([]);
  const [channels, setChannels] = useState<Channel[]>();

  async function handleChange(value: string) {
    console.log("选中频道:", value);
    const data = await ChannelService.getChannelMembers(value);
    setChannelMembers(data);
  }

  async function handleCommunityChange(value: string) {
    setSelectedCommunityId(value);
    console.log("select community: ", value);
    const data = await CommunityService.getCommunityMembers(value);
    setCommunityMembers(data);
    const channelData = await CommunityService.getCommunityChannels(value);
    setChannels(channelData);
    console.log("community members: ", data);
    console.log("community channels: ", channelData);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await CommunityService.getCommunitiesByUser();
      setCommunities(data);
    };
    fetchData();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      {/* 左侧社区列表侧边栏 */}
      <Sider
        width={250}
        theme="light"
        style={{
          borderRight: "1px solid #f0f0f0",
          paddingTop: "16px",
        }}
      >
        <div style={{ padding: "0 16px 16px" }}>
          <Title level={5}>我的社区</Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={communities.map((item) => ({
            key: item.communityId,
            icon: <TeamOutlined />,
            label: item.communityName,
          }))}
          onClick={({ key }) => handleCommunityChange(key)}
        />
      </Sider>

      {/* 右侧管理内容 */}
      <Content style={{ padding: "24px", overflow: "initial" }}>
        <Card
          title={
            <Space>
              <SettingOutlined />
              <span>社区管理设置</span>
            </Space>
          }
          className={styles.card}
        >
          {/* 成员管理部分 */}
          <div className={styles.section}>
            <Title level={4} className={styles.sectionTitle}>
              <Space>
                <span>成员管理</span>
                <UserAddOutlined
                  onClick={() => console.log("invite community member")}
                  style={{ cursor: "pointer", color: "#1890ff" }}
                />
              </Space>
            </Title>
            <div className={styles.settingItem}>
              <Table
                columns={communityColumns}
                dataSource={communityMembers || []}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          <Divider />

          {/* 频道成员管理部分 */}
          <div className={styles.section}>
            <Title level={4} className={styles.sectionTitle}>
              <span>频道成员管理</span>
            </Title>
            <Space style={{ marginBottom: 16 }}>
              <Text>选择频道：</Text>
              <Select
                style={{ width: 150 }}
                onChange={handleChange}
                options={
                  channels?.map((ch) => ({
                    value: ch.channelId,
                    label: ch.channelName,
                  })) || []
                }
              />
              <UserAddOutlined
                onClick={() => console.log("invite channel member")}
                style={{ cursor: "pointer", color: "#1890ff", marginLeft: 8 }}
              />
            </Space>
            <div className={styles.settingItem}>
              <Table
                columns={channelColumns}
                dataSource={channelMembers}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          <Divider />

          <div className={styles.section}>
            <Title level={4} className={styles.sectionTitle}>
              其他设置
            </Title>
            <Text type="secondary">待定内容...</Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
