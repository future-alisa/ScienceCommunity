"use client";
import { Input, Select } from "antd";
import styles from "./community.module.css";
import { useRouter } from "next/navigation";
import { useTheme } from "@/theme/ThemeContext";
import { SearchOutlined } from "@ant-design/icons";
import { Base } from "@/components/base";
import { useEffect, useState } from "react";
import CommunityService from "@/services/CommunityService";

export default function Page() {
  const router = useRouter();
  const initData = [
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
  const [data, setData] = useState(initData);
  const { theme } = useTheme();

  const handleCardClick = (documentId: string) => {
    router.push("/my-community");
  };

  const fetchData = async () => {
    try {
      const data = await CommunityService.getCommunities();
      const newData = data.map((value) => {
        return {
          title: value.communityName,
          id: value.communityId,
          description: value.communityDescription,
        };
      });
      setData(newData);
      console.log(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  function handleChange(
    value: string,
    option:
      | { value: string; label: string }
      | { value: string; label: string }[]
  ): void {}

  return (
    <main
      className={styles.page}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className={styles.toolbar}>
        {/* 筛选条件 - 左侧 */}
        <div className={styles.filterGroup}>
          <Select
            defaultValue="1"
            className={styles.filterSelect}
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.color || "#fff",
            }}
            onChange={handleChange}
            options={[
              { value: "1", label: "最近更新" },
              { value: "2", label: "访问次数" },
              { value: "3", label: "用户数量" },
            ]}
          />
          <Select
            defaultValue="1"
            className={styles.filterSelect}
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.color || "#fff",
            }}
            onChange={handleChange}
            options={[
              { value: "1", label: "数学" },
              { value: "2", label: "英语" },
              { value: "3", label: "物理" },
            ]}
          />
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
