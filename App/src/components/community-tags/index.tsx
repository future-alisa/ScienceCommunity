"use client";

import { useState } from "react";
import { Button, Form, message } from "antd";
import TagPicker from "@/components/tag-picker";
import CommunityService from "@/services/CommunityService";
import { Community } from "@/model/Community";

export default function CommunityTags({ community, onSaved }: { community: Community; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);

  async function save({ tags }: { tags: string[] }) {
    setSaving(true);
    try {
      await CommunityService.updateTags(community.communityId, tags);
      message.success("社区标签已保存");
      onSaved();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "标签保存失败");
    } finally {
      setSaving(false);
    }
  }

  return <Form layout="vertical" style={{ maxWidth: 720 }} initialValues={{ tags: community.tags ?? [] }} onFinish={save}>
    <Form.Item name="tags" label="社区标签">
      <TagPicker kind="community" disabled={saving} />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={saving}>保存标签</Button>
  </Form>;
}
