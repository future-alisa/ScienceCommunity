"use client";
import { Alert, Avatar, Button, Drawer, Empty, Input, List, Popconfirm, Space, Spin, Tag, message } from "antd";
import { ArrowLeftOutlined, TeamOutlined, SendOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChannelRouteParams } from "@/model/MyRouteParams";
import { Channel, ChannelAccess, ChannelMessage } from "@/model/Channel";
import { ChannelUserVo } from "@/model/ChannelUser";
import ChannelService from "@/services/ChannelService";
import { ApiError } from "@/services/ApiService";
import styles from "./channel.module.css";

type Pending = { id: string; content: string; state: "sending" | "failed"; error?: string };
const errorText = (error: unknown) => error instanceof Error ? error.message : "请求失败，请重试";
function combine(previous: ChannelMessage[], incoming: ChannelMessage[]) {
  const rows = Array.from(new Map([...previous, ...incoming].map((row) => [row.messageId, row])).values());
  return rows.sort((a, b) => BigInt(a.sequenceId) < BigInt(b.sequenceId) ? -1 : BigInt(a.sequenceId) > BigInt(b.sequenceId) ? 1 : 0);
}
export default function Page() {
  const { communityId, channelId } = useParams<ChannelRouteParams>();
  return <Discussion key={`${communityId}/${channelId}`} communityId={communityId} channelId={channelId} />;
}
function Discussion({ communityId, channelId }: { communityId: string; channelId: string }) {
  const [channel, setChannel] = useState<Channel>();
  const [access, setAccess] = useState<ChannelAccess>();
  const [rows, setRows] = useState<ChannelMessage[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncError, setSyncError] = useState("");
  const [older, setOlder] = useState(false);
  const [hasOlder, setHasOlder] = useState(false);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [membersOpen, setMembersOpen] = useState(false);
  const [members, setMembers] = useState<ChannelUserVo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");
  const cursor = useRef("0");
  const alive = useRef(true);
  const panel = useRef<HTMLDivElement>(null);
  const scroll = useRef<{ bottom?: boolean; height?: number; top?: number }>({ bottom: true });
  const inFlight = useRef(new Set<string>());
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const merge = useCallback((incoming: ChannelMessage[]) => {
    const box = panel.current;
    if (box && box.scrollHeight - box.scrollTop - box.clientHeight < 100) scroll.current = { bottom: true };
    setRows((previous) => combine(previous, incoming));
    setPending((previous) => previous.filter((item) => !incoming.some((row) => row.clientMessageId === item.id && row.senderId === access?.userId)));
  }, [access?.userId]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setSyncError("");
    Promise.all([ChannelService.getChannelById(channelId), ChannelService.access(channelId)])
      .then(async ([channel, access]) => {
        if (!active) return;
        if (channel.channelCommunityId !== communityId) throw new Error("频道不属于当前社区");
        setChannel(channel); setAccess(access);
        if (access.joined) {
          const history = await ChannelService.history(channelId);
          if (!active) return;
          setRows(history.messages); setHasOlder(history.hasMore);
          cursor.current = history.messages.at(-1)?.sequenceId || "0";
          setPending((previous) => previous.filter((item) => !history.messages.some((row) => row.senderId === access.userId && row.clientMessageId === item.id)));
          scroll.current = { bottom: true };
        } else { setRows([]); setPending([]); cursor.current = "0"; }
      }).catch((error) => { if (active) setError(errorText(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [channelId, communityId, revision]);

  useEffect(() => {
    if (loading || error || !access?.joined) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      let fatal = false;
      try {
        if (document.visibilityState !== "hidden") {
          const history = await ChannelService.history(channelId, { after: cursor.current });
          if (!active) return;
          merge(history.messages);
          // Advance only after polling; send acknowledgements may arrive ahead of unseen messages.
          if (history.messages.length) cursor.current = history.messages.at(-1)!.sequenceId;
          setSyncError("");
          timer = setTimeout(poll, history.hasMore ? 100 : 3000);
          return;
        }
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && [401, 403, 404].includes(error.status)) {
          fatal = true; setError(errorText(error)); setRows([]); setPending([]);
        } else setSyncError("暂时无法同步消息，正在重试。失败的发送可以单独重试。");
      }
      if (active && !fatal) timer = setTimeout(poll, 3000);
    }
    timer = setTimeout(poll, 1000);
    return () => { active = false; clearTimeout(timer); };
  }, [access?.joined, channelId, loading, error, merge]);

  useEffect(() => {
    const box = panel.current;
    if (!box) return;
    if (scroll.current.height !== undefined) box.scrollTop = (scroll.current.top || 0) + box.scrollHeight - scroll.current.height;
    else if (scroll.current.bottom) box.scrollTop = box.scrollHeight;
    scroll.current = {};
  }, [rows, pending, loading]);

  async function send(item: Pending) {
    if (inFlight.current.has(item.id)) return;
    inFlight.current.add(item.id);
    setPending((previous) => previous.map((row) => row.id === item.id ? { ...row, state: "sending", error: undefined } : row));
    try {
      const saved = await ChannelService.send(channelId, item.content, item.id);
      if (!alive.current) return;
      merge([saved]);
      setPending((previous) => previous.filter((row) => row.id !== item.id));
    } catch (error) {
      if (!alive.current) return;
      setPending((previous) => previous.map((row) => row.id === item.id ? { ...row, state: "failed", error: errorText(error) } : row));
      if (error instanceof ApiError && [401, 403, 404].includes(error.status)) { setError(errorText(error)); setRows([]); }
    } finally { inFlight.current.delete(item.id); }
  }
  function submit() {
    const content = draft.trim();
    if (!content || content.length > 4000 || loading || error || !access?.joined) return;
    const item: Pending = { id: crypto.randomUUID(), content, state: "sending" };
    setPending((previous) => [...previous, item]); setDraft(""); scroll.current = { bottom: true };
    void send(item);
  }
  async function membership(join: boolean) {
    setBusy(true);
    try {
      if (join) await ChannelService.join(channelId); else await ChannelService.leave(channelId);
      if (!alive.current) return;
      message.success(join ? "已加入频道" : "已退出频道"); setRevision((value) => value + 1);
    } catch (error) { if (alive.current) message.error(errorText(error)); }
    finally { if (alive.current) setBusy(false); }
  }
  async function loadOlder() {
    if (!rows.length || older) return;
    setOlder(true);
    try {
      const history = await ChannelService.history(channelId, { before: rows[0].sequenceId });
      if (!alive.current) return;
      if (panel.current) scroll.current = { height: panel.current.scrollHeight, top: panel.current.scrollTop };
      setRows((previous) => combine(previous, history.messages)); setHasOlder(history.hasMore);
    } catch (error) { if (alive.current) message.error(errorText(error)); }
    finally { if (alive.current) setOlder(false); }
  }
  async function showMembers() {
    setMembersOpen(true); setMembersLoading(true); setMembersError("");
    try {
      const rows = await ChannelService.getChannelMembers(channelId);
      if (alive.current) { setMembers(rows); setAccess((previous) => previous ? { ...previous, memberCount: rows.length } : previous); }
    }
    catch (error) { if (alive.current) setMembersError(errorText(error)); }
    finally { if (alive.current) setMembersLoading(false); }
  }
  return <section className={styles.room}>
    <Link href={`/community/${communityId}/channel`} className={styles.back}><ArrowLeftOutlined /> 返回频道</Link>
    <div className={styles.heading}><div><h1>{channel?.channelName || "主题讨论"}</h1><p>{channel?.channelDescription || "分享想法，也听见不同的声音。"}</p></div>
      {access && <Space wrap><Button icon={<TeamOutlined />} onClick={showMembers}>成员 {access.memberCount}</Button>
        {access.joined && <Popconfirm title="退出这个频道？" onConfirm={() => membership(false)} disabled={busy}><Button disabled={busy || loading}>退出频道</Button></Popconfirm>}</Space>}
    </div>
    {loading ? <Spin /> : error ? <Alert type="error" showIcon message={error} action={<Button onClick={() => setRevision((value) => value + 1)}>重新加载</Button>} />
      : !access?.joined ? <Empty description="加入频道后，即可阅读历史消息并参与讨论。"><Button type="primary" loading={busy} onClick={() => membership(true)}>加入频道</Button></Empty>
      : <>
        <div className={styles.status}><Tag color={syncError ? "warning" : "default"}>{syncError ? "同步中断" : "自动同步"}</Tag><span>友善讨论，尊重每一个问题。</span></div>
        {syncError && <Alert type="warning" showIcon message={syncError} />}
        <div className={styles.messages} ref={panel} role="log" aria-label="频道消息" aria-live="polite" aria-relevant="additions">
          {hasOlder && <div className={styles.older}><Button type="text" loading={older} onClick={loadOlder}>加载更早的消息</Button></div>}
          {!rows.length && !pending.length && <Empty description="还没有消息，来开启第一段讨论吧" />}
          {rows.map((row) => <div key={row.messageId} className={`${styles.message} ${row.senderId === access.userId ? styles.own : ""}`}>
            <Avatar size={30} className={styles.avatar}>{row.senderName?.charAt(0).toUpperCase() || "S"}</Avatar>
            <div className={styles.messageBody}><div className={styles.meta}><strong>{row.senderName}</strong><time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</time></div><p>{row.content}</p></div>
          </div>)}
          {pending.map((row) => <div key={row.id} className={`${styles.message} ${styles.own}`}><div className={styles.messageBody}><p>{row.content}</p>
            <div className={styles.pending}>{row.state === "sending" ? "发送中…" : <><span>{row.error || "发送失败"}</span><Button type="link" size="small" onClick={() => void send(row)}>重试</Button></>}</div></div></div>)}
        </div>
        <div className={styles.composer}><Input.TextArea aria-label="消息内容" placeholder="分享你的想法…" value={draft} onChange={(event) => setDraft(event.target.value)}
          maxLength={4000} autoSize={{ minRows: 3, maxRows: 6 }} onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && !busy) { event.preventDefault(); submit(); }
          }} />
          <div className={styles.composerActions}><span>Enter 发送 · Shift + Enter 换行</span><Button type="primary" icon={<SendOutlined />} disabled={!draft.trim() || busy} onClick={submit}>发送</Button></div>
        </div>
      </>}
    <Drawer title="频道成员" open={membersOpen} onClose={() => setMembersOpen(false)} width={340}>
      <Button onClick={showMembers} loading={membersLoading}>刷新成员</Button>
      {membersError ? <Alert type="error" message={membersError} /> : <List loading={membersLoading} dataSource={members} rowKey="id" renderItem={(member) => <List.Item><List.Item.Meta title={member.name} description={{ owner: "拥有者", admin: "管理员", member: "成员" }[member.role] || member.role} /></List.Item>} />}
      {access?.canManage && <Link href={`/community/settings?communityId=${encodeURIComponent(communityId)}`}>到“我的社区”管理成员 →</Link>}
    </Drawer>
  </section>;
}
