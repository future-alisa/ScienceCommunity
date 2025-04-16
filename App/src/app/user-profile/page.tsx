"use client";
import { Avatar, Card, Divider, Flex, Space, Tag, Typography } from "antd";
import {
  GithubOutlined,
  LinkOutlined,
  MailOutlined,
} from "@ant-design/icons";
import styles from "./user-profile.module.css";

const { Title, Paragraph, Text } = Typography;

const Page = () => {
  const profile = {
    name: "张小明",
    username: "zhangxiaoming",
    avatar: "https://avatars.githubusercontent.com/u/12345678?v=4",
    bio: "前端开发者 | React爱好者 | 开源贡献者",
    location: "上海, 中国",
    email: "xmzhang@example.com",
    website: "https://xiaoming.dev",
    github: "https://github.com/zhangxiaoming",
  };

  return (
    <Flex className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.profile}>
          <Avatar size={120} src={profile.avatar} className={styles.avatar} />
          <div className={styles.info}>
            <Title level={2}>{profile.name}</Title>
            <Text type="secondary" className={styles.username}>
              @{profile.username}
            </Text>
            <Paragraph className={styles.bio}>{profile.bio}</Paragraph>

            <Space direction="vertical" size="small" className={styles.details}>
              <Text>
                <GithubOutlined />{" "}
                {profile.github.replace("https://github.com/", "")}
              </Text>
              <Text>
                <MailOutlined /> {profile.email}
              </Text>
              {profile.website && (
                <Text>
                  <LinkOutlined /> {profile.website}
                </Text>
              )}
              <Text>{profile.location}</Text>
            </Space>
          </div>
        </div>
      </Card>
    </Flex>
  );
};

export default Page;
