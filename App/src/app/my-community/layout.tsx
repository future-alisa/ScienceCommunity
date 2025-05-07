"use client";
import { useTheme } from "@/theme/ThemeContext";
import styles from "./my-commnity.module.css";
import { useEffect, useState } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const [channels, setChannels] = useState<string[]>([]);
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
            <a href="/my-community/base">基础知识</a>
          </li>
          <li>
            <a href="/my-community/case">案例</a>
          </li>
          <li>
            <a href="/my-community/post">推文</a>
          </li>
          <li>
            <a href="/my-community/channel">频道</a>
            {channels.map((val, index) => {
              return (
                <li key={index} className={styles.secondMenu}>
                  <a href="/my-community/channel/{id}">{val}</a>
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
