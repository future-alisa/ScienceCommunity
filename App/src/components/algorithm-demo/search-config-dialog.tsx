"use client";

import { useState } from "react";
import { Alert, Input, Modal, Space } from "antd";
import { defaultSearchConfig, validSearchConfig } from "./index";

type SearchConfig = typeof defaultSearchConfig;

export function SearchConfigDialog({ config, open, onSave, onClose }: {
  config: SearchConfig;
  open: boolean;
  onSave: (config: SearchConfig) => void;
  onClose: () => void;
}) {
  const [array, setArray] = useState(config.values.join(", "));
  const [target, setTarget] = useState(String(config.target));
  const entries = array.trim().split(/[\s,，]+/);
  const next = { values: entries.map(Number), target: Number(target) };
  const valid = entries.every(value => /^-?\d+$/.test(value)) && /^-?\d+$/.test(target.trim()) && validSearchConfig(next);
  return <Modal title="编辑二分查找参数" open={open} onCancel={onClose}
    okText="应用到文档" okButtonProps={{ disabled: !valid }} onOk={() => { if (valid) onSave(next); }}>
    <Space direction="vertical" style={{ width: "100%" }}>
      <label>有序数组
        <Input.TextArea value={array} onChange={event => setArray(event.target.value)} />
      </label>
      <label>默认查找目标
        <Input value={target} inputMode="numeric" onChange={event => setTarget(event.target.value)} />
      </label>
      {!valid && <Alert type="warning" message="请输入 2 至 32 个严格递增的整数，并填写整数目标。数字可用空格或逗号分隔。" />}
    </Space>
  </Modal>;
}
