"use client";

import { Select } from "antd";
import { matchesTag, sortTagMatches } from "@/util/TagSearch";

export default function TagFilter({ tags, value, onChange, label, className, disabled }: {
  tags: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  return <Select<string, { value: string; label: string }>
    aria-label={label}
    className={className}
    style={className ? undefined : { width: 200 }}
    placeholder="标签筛选"
    showSearch
    allowClear
    value={value || undefined}
    disabled={disabled}
    onChange={(tag) => onChange(tag ?? "")}
    options={tags.map((tag) => ({ value: tag, label: tag }))}
    listHeight={256}
    filterOption={matchesTag}
    filterSort={sortTagMatches}
    notFoundContent={tags.length ? "没有匹配的标签" : "暂无标签"}
  />;
}
