"use client";
import { Alert, Button, Popconfirm, Space, Spin, Tag, message } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import { useEffect, useState } from "react";
import CommunityService from "@/services/CommunityService";
import MemberService, { CommunityAccess } from "@/services/MemberService";
import { Community } from "@/model/Community";

export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  const [community, setCommunity] = useState<Community>();
  const [access, setAccess] = useState<CommunityAccess>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setCommunity(undefined); setAccess(undefined);
    Promise.all([CommunityService.getCommunityById(communityId), MemberService.access(communityId)]).then(([community, access]) => {
      if (!active) return;
      if (!community) throw new Error("社区不存在");
      setCommunity(community); setAccess(access);
    }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "社区加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, revision]);
  async function changeMembership(join: boolean) {
    setBusy(true);
    try {
      if (join) await MemberService.join(communityId);
      else if (access?.membershipId) await MemberService.remove(access.membershipId);
      message.success(join ? "已加入社区" : "已退出社区");
      setRevision((value) => value + 1);
    } catch (error) { message.error(error instanceof Error ? error.message : "操作失败"); }
    finally { setBusy(false); }
  }
  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} action={<Button onClick={() => setRevision((value) => value + 1)}>重试</Button>} />;
  return <section>
    <h1>{community?.communityName}</h1><p>{community?.communityDescription}</p>
    <Space wrap>
      {access?.membershipId ? <>
        <Tag>已加入社区</Tag>
        <Link href={`/community/${communityId}/documents`}>浏览资料</Link>
        <Link href={`/community/${communityId}/documents/new`}>发布文档</Link>
        {access.role !== "owner" && <Popconfirm title="退出社区？" description="同时退出该社区的所有频道。" onConfirm={() => changeMembership(false)} disabled={busy}><Button danger loading={busy}>退出社区</Button></Popconfirm>}
      </> : <Button type="primary" loading={busy} onClick={() => changeMembership(true)}>加入社区</Button>}
    </Space>
  </section>;
}
