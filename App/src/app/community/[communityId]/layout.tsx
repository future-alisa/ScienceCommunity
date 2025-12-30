"use client";
import { useTheme } from "@/theme/ThemeContext";
import styles from "./my-commnity.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CommunityRouteParams } from "@/model/MyRouteParams";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const { theme } = useTheme();
  const [channels, setChannels] = useState<string[]>([]);
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  useEffect(() => {
    setChannels(["频道1", "频道2"]);
  }, []);

  return (
    <main className={styles.page}>
      <aside
        className={styles.sidebar}
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <h2>社区</h2>
        <ul>
          <li>
            <Link href={`/community/${communityId}/basis`}>基础知识</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/case`}>案例</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/post`}>推文</Link>
          </li>
          <li>
            <Link href={`/community/${communityId}/channel`}>频道</Link>
            {channels.map((val, index) => {
              const channelId = index + 1;
              return (
                <li key={index} className={styles.secondMenu}>
                  <Link href={`/community/${communityId}/channel/${channelId}`}>
                    {val}
                  </Link>
                </li>
              );
            })}
          </li>
        </ul>
      </aside>
      {children}
    </main>
  );
}
