"use client";
import styles from "./my-commnity.module.css";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import CommunityService from "@/services/CommunityService";
import { Channel } from "@/model/Channel";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelError, setChannelError] = useState(false);
  const [channelRevision, setChannelRevision] = useState(0);
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  const pathname = usePathname();
  const communityHome = `/community/${communityId}`;
  const [identity, setIdentity] = useState<{ id: string; name: string; failed?: boolean }>();
  const [identityRevision, setIdentityRevision] = useState(0);
  useEffect(() => {
    let active = true;
    CommunityService.getCommunityById(communityId)
      .then((community) => {
        if (active) setIdentity({ id: communityId, name: community.communityName });
      })
      .catch(() => {
        if (active) setIdentity({ id: communityId, name: "社区", failed: true });
      });
    return () => { active = false; };
  }, [communityId, identityRevision]);
  const currentIdentity = identity?.id === communityId ? identity : undefined;
  useEffect(() => {
    const changed = (event: Event) => {
      if ((event as CustomEvent<string>).detail === communityId) setChannelRevision((value) => value + 1);
    };
    window.addEventListener("channels-changed", changed);
    return () => window.removeEventListener("channels-changed", changed);
  }, [communityId]);
  useEffect(() => {
    let active = true;
    setChannels([]);
    setChannelError(false);
    CommunityService.getCommunityChannels(communityId)
      .then((data) => { if (active) setChannels(data); })
      .catch(() => { if (active) setChannelError(true); });
    return () => { active = false; };
  }, [communityId, channelRevision]);

  return (
    <main className={styles.page}>
      <aside
        className={styles.sidebar}
      >
        <div className={styles.identity}>
          <span className={styles.identityLabel}>当前社区</span>
          <h2><Link href={communityHome}>{currentIdentity?.name || "正在加载社区…"}</Link></h2>
          {currentIdentity?.failed && <button type="button" className={styles.retry} onClick={() => setIdentityRevision((value) => value + 1)}>名称加载失败，重试</button>}
        </div>
        <ul>
          <li>
            <Link href={communityHome} aria-current={pathname === communityHome ? "page" : undefined}>社区主页</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/basis`} aria-current={pathname.endsWith("/basis") ? "page" : undefined}>理论与资料</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/case`} aria-current={pathname.endsWith("/case") ? "page" : undefined}>案例</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/post`} aria-current={pathname.endsWith("/post") ? "page" : undefined}>文章</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/channel`} aria-current={pathname.endsWith("/channel") ? "page" : undefined}>频道</Link>
            <ul>
              {channelError && <li>频道加载失败，请进入频道列表重试</li>}
              {channels.map((channel) => {
                const channelId = channel.channelId;
                return (
                  <li key={channelId} className={styles.secondMenu}>
                    <Link
                      href={`/community/${communityId}/channel/${channelId}`}
                      aria-current={pathname === `/community/${communityId}/channel/${channelId}` ? "page" : undefined}
                    >
                      {channel.channelName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </aside>
      <div className={styles.contentContainer}>{children}</div>
    </main>
  );
}
