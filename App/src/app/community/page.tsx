"use client";
import { Input } from "antd";
import styles from "./community.module.css";
import { useRouter } from "next/navigation";
import { useTheme } from "@/theme/ThemeContext";
import { SearchOutlined } from "@ant-design/icons";
import { Base } from "@/components/base";

export default function Page() {
  const router = useRouter();
  const data = [
    {
      title: "1",
      id: "1",
      description: "description1",
    },
    {
      title: "2",
      id: "2",
      description: "description2",
    },
  ];
  const { theme } = useTheme();

  const handleCardClick = (documentId: string) => {
    router.push("/my-community");
  };
  return (
    <main
      className={styles.page}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className={styles.toolbar}>
        {/* 筛选条件 - 左侧 */}
        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.color || "#fff",
            }}
          >
            <option>最近更新</option>
            <option>访问次数</option>
            <option>用户数量</option>
          </select>
          <select
            className={styles.filterSelect}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.color || "#fff",
            }}
          >
            <option>数学</option>
            <option>英语</option>
            <option>物理</option>
          </select>
        </div>

        {/* 搜索框 - 右侧 */}
        <div className={styles.searchContainer}>
          <Input
            placeholder="搜索社区..."
            prefix={<SearchOutlined />}
            style={{
              width: 300,
              backgroundColor: theme.backgroundColor || theme.backgroundColor,
              color: theme.color,
              borderColor: theme.borderColor,
            }}
          />
        </div>
      </div>

      <Base data={data} handleCardClick={handleCardClick} />
    </main>
  );
}
