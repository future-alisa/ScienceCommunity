"use client";
import { useState } from "react";
import { Button, Form, message } from "antd";
import CoverPicker from "@/components/cover-picker";
import CommunityService from "@/services/CommunityService";
import { Community } from "@/model/Community";

export default function CommunityCover({ community, onSaved }: { community: Community; onSaved: () => void }) {
  const [cover, setCover] = useState(community.communityImageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  return <Form layout="vertical" style={{ maxWidth: 720 }} onFinish={async () => {
    if (uploading || saving) return;
    setSaving(true);
    try { await CommunityService.updateCover(community.communityId, cover); message.success("社区封面已保存"); onSaved(); }
    catch (error) { message.error(error instanceof Error ? error.message : "封面保存失败"); }
    finally { setSaving(false); }
  }}>
    <Form.Item label="社区封面" extra="更换或移除后，点击保存封面。拥有者和管理员可以修改。">
      <CoverPicker kind="community" value={cover} communityId={community.communityId} onChange={setCover} disabled={saving} onBusyChange={setUploading} />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={saving} disabled={uploading || cover === (community.communityImageUrl || "")}>保存封面</Button>
  </Form>;
}
