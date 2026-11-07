"use client";
import { Alert, Button, Empty, Form, Input, Modal, Popconfirm, Select, Space, Table, Tabs, Tag, message } from "antd";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CommunityService from "@/services/CommunityService";
import ChannelService from "@/services/ChannelService";
import MemberService, { CommunityAccess, CommunityRole } from "@/services/MemberService";
import { Community } from "@/model/Community";
import { CommunityUserVo } from "@/model/CommunityUser";
import { ChannelUserVo } from "@/model/ChannelUser";
import { Channel } from "@/model/Channel";
import { DocumentLibrary } from "@/components/document-library";
import CommunityCover from "@/components/community-cover";

const roleLabels: Record<string, string> = { owner: "拥有者", admin: "管理员", member: "成员" };
const errorText = (error: unknown) => error instanceof Error ? error.message : "操作失败，请重试";

export default function Page() {
  return <Suspense fallback={<p>正在加载管理页面...</p>}><CommunityManagement /></Suspense>;
}

function CommunityManagement() {
  const initialCommunityId = useSearchParams().get("communityId") || "";
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityId, setCommunityId] = useState("");
  const [members, setMembers] = useState<CommunityUserVo[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelId, setChannelId] = useState("");
  const [channelMembers, setChannelMembers] = useState<ChannelUserVo[]>([]);
  const [access, setAccess] = useState<CommunityAccess>();
  const [roles, setRoles] = useState<CommunityRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelLoading, setChannelLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [channelError, setChannelError] = useState("");
  const [revision, setRevision] = useState(0);
  const [memberModal, setMemberModal] = useState(false);
  const [channelModal, setChannelModal] = useState(false);
  const [form] = Form.useForm<{ identity: string; roleId: string }>();
  const [channelForm] = Form.useForm<{ memberId: string }>();
  const manager = access?.role === "owner" || access?.role === "admin";
  const roleOptions = roles.filter((role) => role.name === "member" || (role.name === "admin" && access?.role === "owner"))
    .map((role) => ({ value: role.id, label: roleLabels[role.name] || role.name }));

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    CommunityService.getCommunitiesByUser().then((data) => {
      if (!active) return;
      setCommunities(data);
      setCommunityId((previous) => data.some((item) => item.communityId === previous) ? previous
        : data.some((item) => item.communityId === initialCommunityId) ? initialCommunityId : data[0]?.communityId || "");
    }).catch((error) => { if (active) setError(errorText(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision, initialCommunityId]);

  useEffect(() => {
    let active = true;
    setMembers([]); setChannels([]); setAccess(undefined); setError("");
    if (!communityId) return;
    setLoading(true);
    Promise.all([CommunityService.getCommunityMembers(communityId), CommunityService.getCommunityChannels(communityId),
      MemberService.access(communityId), MemberService.roles()]).then(([members, channels, access, roles]) => {
      if (!active) return;
      setMembers(members); setChannels(channels); setAccess(access); setRoles(roles);
      setChannelId((previous) => channels.some((channel) => channel.channelId === previous) ? previous : channels[0]?.channelId || "");
    }).catch((error) => { if (active) setError(errorText(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, revision]);

  useEffect(() => {
    let active = true;
    setChannelMembers([]); setChannelError("");
    if (!channelId) { setChannelLoading(false); return; }
    setChannelLoading(true);
    ChannelService.getChannelMembers(channelId).then((data) => { if (active) setChannelMembers(data); })
      .catch((error) => { if (active) setChannelError(errorText(error)); })
      .finally(() => { if (active) setChannelLoading(false); });
    return () => { active = false; };
  }, [communityId, channelId, revision]);

  async function mutate(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      message.success("操作成功");
      setRevision((value) => value + 1);
      return true;
    } catch (error) { message.error(errorText(error)); return false; }
    finally { setBusy(false); }
  }
  const canManage = (member: CommunityUserVo) => manager && member.role !== "owner" && (access?.role === "owner" || member.role !== "admin");

  return (
    <section style={{ padding: 24, width: "100%", minWidth: 0 }}>
      <h1>社区管理</h1>
      <Space wrap style={{ marginBottom: 20 }}>
        <Select aria-label="选择社区" placeholder="选择社区" style={{ width: 240 }} value={communityId || undefined}
          disabled={busy} onChange={(value) => { setChannelId(""); setCommunityId(value); }} options={communities.map((item) => ({ value: item.communityId, label: item.communityName }))} />
        <Button disabled={busy} onClick={() => setRevision((value) => value + 1)}>刷新</Button>
        {access && <Tag>{roleLabels[access.role] || "未加入"}</Tag>}
      </Space>
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}
      {!communityId && !loading ? <Empty description="还没有加入社区" /> : communityId && <Tabs destroyInactiveTabPane items={[
        ...(manager && communities.find(item => item.communityId === communityId) ? [{ key: "appearance", label: "社区封面", children: <CommunityCover key={`${communityId}-${revision}`} community={communities.find(item => item.communityId === communityId)!} onSaved={() => setRevision(value => value + 1)} /> }] : []),
        { key: "members", label: "社区成员", children: <>
          {manager && <Button type="primary" disabled={loading || busy} onClick={() => { form.resetFields(); setMemberModal(true); }}>添加成员</Button>}
          <Table<CommunityUserVo> rowKey="id" loading={loading} dataSource={members} scroll={{ x: 650 }} columns={[
            { title: "姓名", dataIndex: "name" }, { title: "邮箱", dataIndex: "email" },
            { title: "角色", render: (_, member) => canManage(member) && access?.role === "owner"
              ? <Select aria-label={`调整${member.name}的角色`} style={{ width: 120 }} value={member.roleId} options={roleOptions} disabled={busy}
                onChange={(roleId) => void mutate(() => MemberService.updateRole(member, roleId))} />
              : roleLabels[member.role] || member.role },
            { title: "操作", render: (_, member) => canManage(member) && <Popconfirm title={`移除 ${member.name}？`} description="同时移除该用户的频道成员关系。" disabled={busy}
              onConfirm={() => mutate(() => MemberService.remove(member.id))}>
              <Button danger disabled={busy}>移除</Button></Popconfirm> },
          ]} />
        </> },
        { key: "channels", label: "频道成员", children: <>
          <Space wrap style={{ marginBottom: 16 }}>
            <Select aria-label="选择频道" style={{ width: 220 }} value={channelId || undefined} placeholder="选择频道" disabled={loading || busy} onChange={setChannelId}
              options={channels.map((item) => ({ value: item.channelId, label: item.channelName }))} />
            {manager && <Button disabled={!channelId || busy || loading || channelLoading} onClick={() => { channelForm.resetFields(); setChannelModal(true); }}>添加频道成员</Button>}
          </Space>
          {channelError && <Alert type="error" message={channelError} />}
          <Table<ChannelUserVo> rowKey="id" loading={loading || channelLoading} dataSource={channelMembers} columns={[
            { title: "姓名", dataIndex: "name" }, { title: "邮箱", dataIndex: "email" },
            { title: "社区角色", render: (_, member) => roleLabels[member.role] || member.role },
            { title: "操作", render: (_, member) => manager && <Popconfirm title={`从频道移除 ${member.name}？`} disabled={busy}
              onConfirm={() => mutate(() => MemberService.removeFromChannel(member.id))}><Button danger disabled={busy}>移除</Button></Popconfirm> },
          ]} />
        </> },
        { key: "documents", label: "文档管理", children: <DocumentLibrary key={communityId} communityId={communityId} management /> },
      ]} />}
      <Modal title="添加社区成员" open={memberModal} confirmLoading={busy} closable={!busy} maskClosable={!busy}
        onCancel={() => setMemberModal(false)} onOk={async () => {
          const values = await form.validateFields();
          if (await mutate(() => MemberService.add(communityId, values.identity.trim(), values.roleId))) setMemberModal(false);
        }}>
        <Form form={form} layout="vertical" initialValues={{ roleId: roles.find((role) => role.name === "member")?.id }}>
          <Form.Item name="identity" label="用户名、邮箱或用户 ID" rules={[{ required: true, whitespace: true, message: "请输入用户信息" }]}><Input /></Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: "请选择角色" }]}><Select options={roleOptions} /></Form.Item>
        </Form>
      </Modal>
      <Modal title="添加频道成员" open={channelModal} confirmLoading={busy} closable={!busy} maskClosable={!busy}
        onCancel={() => setChannelModal(false)} onOk={async () => {
          const values = await channelForm.validateFields();
          if (await mutate(() => MemberService.addToChannel(channelId, values.memberId))) setChannelModal(false);
        }}>
        <Form form={channelForm} layout="vertical"><Form.Item name="memberId" label="社区成员" rules={[{ required: true, message: "请选择成员" }]}>
          <Select showSearch optionFilterProp="label" options={members.filter((item) => !channelMembers.some((member) => member.communityUserId === item.id)).map((item) => ({ value: item.id, label: `${item.name} (${item.email})` }))} />
        </Form.Item></Form>
      </Modal>
    </section>
  );
}
