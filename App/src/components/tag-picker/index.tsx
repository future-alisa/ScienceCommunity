"use client";

import { Select } from "antd";
import { useEffect, useState } from "react";
import Constants from "@/config/Constants";
import { Tag } from "@/model/Tag";
import { matchesTag, sortTagMatches } from "@/util/TagSearch";
import { api } from "@/services/ApiService";

const suggestions = {
  community: ["数学", "物理", "化学", "生物", "计算机", "强化学习", "量化"],
  document: ["强化学习", "PPO", "PyTorch", "算法", "并发编程", "量化"],
};

export default function TagPicker({ kind, value, onChange, disabled, id }: {
  kind: keyof typeof suggestions;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  id?: string;
}) {
  const [catalog, setCatalog] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    api.get<Tag[]>(Constants.API_TAG_GET_ALL)
      .then((tags) => { if (active) setCatalog(tags.map((tag) => tag.tagName)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const options = Array.from(new Set([...suggestions[kind], ...catalog])).map((name) => ({ value: name }));
  return <Select id={id} mode="tags" value={value ?? []} disabled={disabled} maxCount={10} listHeight={256} filterOption={matchesTag} filterSort={sortTagMatches}
    placeholder="选择标签，或输入新标签后按回车" options={options}
    onChange={(names: string[]) => {
      const unique = new Map<string, string>();
      for (const name of names) {
        const label = name.trim().normalize("NFC");
        if (label && !unique.has(label.toLowerCase())) unique.set(label.toLowerCase(), label);
      }
      onChange?.(Array.from(unique.values()));
    }} />;
}
