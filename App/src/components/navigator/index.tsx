"use client";

import Link from "next/link";
import { useTheme } from "@/theme/ThemeContext";
import { usePathname } from "next/navigation"; // 用于判断当前选中路由
import styles from "./style.module.css";
import { Avatar } from "antd";

export default function Navigator() {
  const { theme } = useTheme();
  const pathname = usePathname(); // 获取当前路由路径

  // 判断链接是否激活
  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={styles.nav_container}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        borderBottom: `1px solid ${theme.borderColor || "#E0E0E0"}`,
      }}
    >
      <div className={styles.nav_left}>{/* 左侧内容 */}</div>

      <div className={styles.nav_middle}>
        <Link
          href="/"
          className={`${styles.nav_link} ${isActive("/") ? styles.active : ""}`}
          style={{
            color: isActive("/") ? theme.primaryColor : theme.color,
          }}
        >
          Home
        </Link>
        <Link
          href="/community"
          className={`${styles.nav_link} ${
            isActive("/community") ? styles.active : ""
          }`}
          style={{
            color: isActive("/community") ? theme.primaryColor : theme.color,
          }}
        >
          Community
        </Link>
        <Link
          href="/about"
          className={`${styles.nav_link} ${
            isActive("/about") ? styles.active : ""
          }`}
          style={{
            color: isActive("/about") ? theme.primaryColor : theme.color,
          }}
        >
          About
        </Link>
      </div>

      <div className={styles.nav_right}>
        <Link href="/signin" className={styles.signin_button}>
          <Avatar
            src={
              <img
                src={
                  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                }
                alt="avatar"
              />
            }
          />
        </Link>
      </div>
    </nav>
  );
}
