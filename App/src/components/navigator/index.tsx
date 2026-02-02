"use client";

import Link from "next/link";
import { useTheme } from "@/theme/ThemeContext";
import { usePathname, useRouter } from "next/navigation"; // 用于判断当前选中路由
import styles from "./style.module.css";
import { Avatar } from "antd";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { UserOutlined } from "@ant-design/icons";

export default function Navigator({ toggleMenu }: { toggleMenu: () => void }) {
  const { theme } = useTheme();
  const pathname = usePathname(); // 获取当前路由路径
  const user = useContext(UserContext);
  const router = useRouter();
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
        <Avatar
          className={styles.avatar}
          size={50}
          {...(user.state === "Online"
            ? {
                // 登录状态：显示首字母或图片
                children: user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <UserOutlined />
                ),
                style: { backgroundColor: "#1890ff", cursor: "pointer" }, // 设置一个好看的背景色
                onClick: toggleMenu,
              }
            : {
                // 未登录状态：显示默认图标
                icon: <UserOutlined />,
                style: { cursor: "pointer" },
                onClick: () => router.push("/signin"),
              })}
        />
      </div>
    </nav>
  );
}
