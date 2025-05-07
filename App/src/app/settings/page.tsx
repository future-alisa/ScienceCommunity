"use client";
import { Card, Switch, Divider, Typography, Space, Flex } from "antd";
import { BulbOutlined, BulbFilled, SettingOutlined } from "@ant-design/icons";
import styles from "./settings.module.css";
import { DarkTheme, LightTheme, useTheme } from "@/theme/ThemeContext";

const { Title, Text } = Typography;

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme.name === "Dark" ? LightTheme : DarkTheme);
  };
  return (
    <div className={styles.settingsContainer}>
      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>设置</span>
          </Space>
        }
        className={styles.card}
      >
        {/* 主题设置部分 */}
        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            <Space>
              {theme.name === "Dark" ? <BulbFilled /> : <BulbOutlined />}
              <span>主题设置</span>
            </Space>
          </Title>

          <div className={styles.settingItem}>
            <Space size="large">
              <Text>夜间模式</Text>
              <Switch
                checked={theme.name === "Dark"}
                onChange={toggleTheme}
                checkedChildren="开"
                unCheckedChildren="关"
              />
            </Space>
            <Text type="secondary" className={styles.settingDescription}>
              切换白天/夜间主题配色
            </Text>
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <Title level={4} className={styles.sectionTitle}>
            其他设置
          </Title>

          <div className={styles.settingItem}>
            <Space size="large">
              <Text>消息通知</Text>
              <Switch defaultChecked />
            </Space>
          </div>

          <div className={styles.settingItem}>
            <Space size="large">
              <Text>隐私设置</Text>
              <Switch defaultChecked />
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
