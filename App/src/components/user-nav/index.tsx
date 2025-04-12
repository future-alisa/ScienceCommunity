"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CustomerServiceFilled,
  StarOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import styles from "./user-nav.module.css";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string; // 新增 path 属性用于 Link
}

const RightSideNav = () => {
  const pathname = usePathname();

  // 导航项配置
  const navItems: NavItem[] = [
    {
      id: "home",
      label: "首页",
      icon: <HomeOutlined />,
      path: "/",
    },
    {
      id: "profile",
      label: "个人中心",
      icon: <UserOutlined />,
      path: "/profile",
    },
    {
      id: "apps",
      label: "应用",
      icon: <AppstoreOutlined />,
      path: "/apps",
    },
    {
      id: "favorites",
      label: "发布",
      icon: <StarOutlined />,
      path: "/publish",
    },
    {
      id: "settings",
      label: "设置",
      icon: <SettingOutlined />,
      path: "/settings",
    },
    {
      id: "create",
      label: "创建社区",
      icon: <CustomerServiceFilled />,
      path: "/community/create",
    },
  ];

  // 根据当前路径确定活动项
  const activeId = navItems.find((item) => pathname === item.path)?.id || "";

  return (
    <div className={styles.navContainer}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              className={`${styles.navItem} ${
                activeId === item.id ? styles.active : ""
              }`}
            >
              <div className={styles.iconWrapper}>{item.icon}</div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSideNav;
