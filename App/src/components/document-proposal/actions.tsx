"use client";

import { Button, Input, Modal, Space, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DocumentProposalService, { ContributionSettings, proposalHref } from "@/services/DocumentProposalService";
import { UserContext } from "@/context/UserContext";

export default function ProposalActions({ documentId, documentUrl }: { documentId: string; documentUrl: string }) {
  const router = useRouter();
  const user = useContext(UserContext);
  const [settings, setSettings] = useState<ContributionSettings>();
  const [license, setLicense] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setSettings(undefined);
    DocumentProposalService.settings(documentId).then((data) => { if (active) setSettings(data); }).catch(() => {});
    return () => { active = false; };
  }, [documentId, user]);

  async function fork() {
    setBusy(true);
    try { router.push(proposalHref(await DocumentProposalService.fork(documentId))); }
    catch (error) { message.error(error instanceof Error ? error.message : "创建编辑副本失败"); }
    finally { setBusy(false); }
  }

  async function updateLicense(next: string) {
    setBusy(true);
    try {
      setSettings(await DocumentProposalService.setLicense(documentId, next));
      setEditing(false);
      message.success(next ? "已开放修改提案" : "已关闭修改提案");
    } catch (error) { message.error(error instanceof Error ? error.message : "贡献设置保存失败"); }
    finally { setBusy(false); }
  }

  if (!settings) return null;
  return <section aria-label="文档贡献" style={{ marginBottom: 20 }}>
    {settings.license && <p style={{ marginBottom: 8 }}>贡献授权：{settings.license}</p>}
    <Space wrap>
      {settings.canPropose && <Button onClick={fork} loading={busy}>建议修改</Button>}
      <Link href={`${documentUrl}/proposals`}>修改提案与合并记录</Link>
      {settings.canManage && <Button type="link" onClick={() => { setLicense(settings.license ?? ""); setEditing(true); }}>
        {settings.license ? "贡献设置" : "开放修改提案"}
      </Button>}
    </Space>
    <Modal title="文档贡献设置" open={editing} onCancel={() => setEditing(false)}
      onOk={() => updateLicense(license.trim())} confirmLoading={busy} okText="开放并保存"
      okButtonProps={{ disabled: !license.trim() }} cancelText="取消">
      <p>确认你有权允许他人修改并重新发布这份资料，再填写授权名称及出处。</p>
      <Input.TextArea aria-label="授权说明" value={license} maxLength={255} showCount
        placeholder="填写授权名称和可查证的出处" onChange={(event) => setLicense(event.target.value)} />
      {settings.license && <Button danger type="link" disabled={busy} onClick={() => updateLicense("")}>关闭修改提案</Button>}
    </Modal>
  </section>;
}
