"use client";
import { Alert, Button, Empty, Form, Input, List, Modal, Popconfirm, Space, Spin, Tag, message } from "antd";
import { PlusOutlined, MessageOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommunityService from "@/services/CommunityService";
import ChannelService, { notifyChannelsChanged } from "@/services/ChannelService";
import MemberService from "@/services/MemberService";
import { Channel } from "@/model/Channel";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import styles from "./channel.module.css";

export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Channel>();
  const [busy, setBusy] = useState(false);
  const [form] = Form.useForm<{ name: string; description: string }>();
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setCanManage(false); setChannels([]);
    Promise.all([CommunityService.getCommunityChannels(communityId), MemberService.access(communityId)])
      .then(([channels, access]) => { if (active) { setChannels(channels); setCanManage(access.role === "owner" || access.role === "admin"); } })
      .catch((error) => { if (active) setError(error instanceof Error ? error.message : "频道加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, attempt]);
  function openEditor(channel?: Channel) {
    setEditing(channel); form.setFieldsValue({ name: channel?.channelName || "", description: channel?.channelDescription || "" }); setModalOpen(true);
  }
  async function save() {
    const values = await form.validateFields();
    setBusy(true);
    try {
      if (editing) await ChannelService.saveChannel({ ...editing, channelName: values.name.trim(), channelDescription: values.description?.trim() || "" });
      else await ChannelService.createChannel(communityId, values.name.trim(), values.description?.trim() || "");
      setModalOpen(false); setAttempt((value) => value + 1); notifyChannelsChanged(communityId); message.success(editing ? "频道已更新" : "频道已创建，你已自动加入");
    } catch (error) { message.error(error instanceof Error ? error.message : "保存失败"); }
    finally { setBusy(false); }
  }
  async function remove(channel: Channel) {
    setBusy(true);
    try { await ChannelService.deleteChannel(channel.channelId); notifyChannelsChanged(communityId); setAttempt((value) => value + 1); message.success("频道已删除"); }
    catch (error) { message.error(error instanceof Error ? error.message : "删除失败"); }
    finally { setBusy(false); }
  }
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = channels.filter((item) => `${item.channelName} ${item.channelDescription || ""}`.toLocaleLowerCase().includes(keyword));
  return <section>
    <div className={styles.heading}><div><h1>主题频道</h1><p>围绕一个主题，让讨论持续发生。</p></div>
      {canManage && <Button type="primary" icon={<PlusOutlined />} disabled={busy} onClick={() => openEditor()}>创建频道</Button>}
    </div>
    <div className={styles.toolbar}><Input.Search aria-label="搜索频道" placeholder="搜索频道名称或简介" allowClear value={query} onChange={(event) => setQuery(event.target.value)} style={{ maxWidth: 320 }} />
      <Button disabled={busy} onClick={() => setAttempt((value) => value + 1)}>刷新</Button></div>
    {loading ? <Spin /> : error ? <Alert type="error" showIcon message={error} /> : filtered.length ? <List rowKey="channelId" dataSource={filtered} renderItem={(channel) => <List.Item className={styles.channelRow}>
      <div className={styles.channelInfo}><span className={styles.channelIcon}><MessageOutlined /></span><div>
        <Link className={styles.channelName} href={`/community/${communityId}/channel/${channel.channelId}`}>{channel.channelName}</Link>
        <p className={styles.description}>{channel.channelDescription || "加入频道，一起交流想法。"}</p>
      </div></div>
      <Space wrap>{canManage && <><Button type="text" disabled={busy} onClick={() => openEditor(channel)}>编辑</Button>
        <Popconfirm title={`删除“${channel.channelName}”？`} description="同时永久删除该频道的消息和成员关系。" disabled={busy} onConfirm={() => remove(channel)}><Button type="text" danger disabled={busy}>删除</Button></Popconfirm></>}
        <Link href={`/community/${communityId}/channel/${channel.channelId}`} aria-label={`进入${channel.channelName}`}><ArrowRightOutlined /></Link></Space>
    </List.Item>} /> : <Empty description={query ? "没有匹配的频道" : "还没有频道，创建一个主题开始讨论吧"} />}
    {!loading && !error && <Tag className={styles.count}>{channels.length} 个主题频道</Tag>}
    <Modal title={editing ? "编辑频道" : "创建频道"} open={modalOpen} onOk={save} onCancel={() => setModalOpen(false)} confirmLoading={busy} closable={!busy} maskClosable={!busy} cancelButtonProps={{ disabled: busy }}>
      <Form form={form} layout="vertical" disabled={busy}>
        <Form.Item name="name" label="频道名称" rules={[{ required: true, whitespace: true, message: "请输入频道名称" }, { max: 255 }]}><Input maxLength={255} placeholder="例如：线性代数答疑" /></Form.Item>
        <Form.Item name="description" label="讨论主题" rules={[{ max: 255 }]}><Input.TextArea rows={3} maxLength={255} showCount placeholder="介绍这个频道适合讨论什么" /></Form.Item>
      </Form>
    </Modal>
  </section>;
}
