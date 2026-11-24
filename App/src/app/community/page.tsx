"use client";
import { Alert, Button, Empty, Input, Select, Spin } from "antd";
import styles from "./community.module.css";
import { useRouter } from "next/navigation";
import { useTheme } from "@/theme/ThemeContext";
import { SearchOutlined } from "@ant-design/icons";
import TagFilter from "@/components/tag-filter";
import { CardGrid } from "@/components/card-grid";
import { useEffect, useMemo, useState } from "react";
import CommunityService from "@/services/CommunityService";
import { Community } from "@/model/Community";

export default function Page() {
  const router = useRouter();
  const { theme } = useTheme();
  const [rawData, setRawData] = useState<Community[]>([]);
  const [tagName, setTagName] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    CommunityService.getCommunities()
      .then((data) => { if (active) setRawData(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  const tags = useMemo(() => Array.from(new Set(rawData.flatMap((item) => item.tags ?? [])))
    , [rawData]);
  const cards = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    const filtered = rawData.filter((item) =>
      (!tagName || item.tags?.includes(tagName)) &&
      [item.communityName, item.communityDescription]
        .some((value) => value?.toLocaleLowerCase().includes(keyword))
    );
    if (sort === "name") filtered.sort((a, b) => a.communityName.localeCompare(b.communityName, "zh-CN"));
    return filtered.map((item) => ({
      id: item.communityId, title: item.communityName,
      description: item.communityDescription, imageUrl: item.communityImageUrl,
      tags: item.tags,
    }));
  }, [rawData, query, sort, tagName]);
  return (
    <main className={styles.page} style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <h1>发现科学社区</h1>
      <p>找到感兴趣的学科，阅读理论与案例，分享文章，参与主题讨论。</p>
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <Select aria-label="社区排序" value={sort} className={styles.filterSelect}
            onChange={setSort} options={[{ value: "default", label: "默认排序" }, { value: "name", label: "名称排序" }]} />
          <TagFilter label="按社区标签筛选" tags={tags} value={tagName} onChange={setTagName} className={styles.filterSelect} />
        </div>
        <div className={styles.searchContainer}>
          <Input aria-label="搜索社区" placeholder="搜索社区名称或简介" prefix={<SearchOutlined />}
            allowClear value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      {loading ? <Spin tip="正在加载社区"><div style={{ minHeight: 160 }} /></Spin>
        : error ? <Alert type="error" showIcon message="社区加载失败，请重试"
          action={<Button onClick={() => setAttempt((value) => value + 1)}>重试</Button>} />
        : cards.length ? <><p aria-live="polite">找到 {cards.length} 个社区</p><CardGrid kind="community" data={cards} onTagClick={setTagName} handleCardClick={(id) => router.push(`/community/${id}`)} /></>
        : <Empty description={query || tagName ? "没有匹配的社区，试试其他关键词或标签" : "暂无社区"} />}
    </main>
  );
}
