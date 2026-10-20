"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Drawer } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined, TeamOutlined, EditOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import styles from "./user-nav.module.css";
import { UserDispatchContext, UserContext } from "@/context/UserContext";

const PopupNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();
  const dispatch = useContext(UserDispatchContext);
  const user = useContext(UserContext);
  const items = [
    { id: "home", label: "首页", icon: <HomeOutlined />, path: "/" },
    { id: "profile", label: "个人中心", icon: <UserOutlined />, path: "/user-profile" },
    { id: "publish", label: "发布文章", icon: <EditOutlined />, path: "/publish" },
    { id: "create", label: "创建社区", icon: <PlusOutlined />, path: "/community/create" },
    { id: "communities", label: "我的社区", icon: <TeamOutlined />, path: "/community/settings" },
    { id: "settings", label: "设置", icon: <SettingOutlined />, path: "/settings" },
    { id: "logout", label: "退出登录", icon: <LogoutOutlined />, path: "/" },
  ];
  return <Drawer title="个人空间" placement="right" width={300} open={isOpen} onClose={onClose} styles={{ body: { padding: 20 } }}>
    <p className={styles.greeting}>{user.name || "欢迎回来"}<span>学习、分享，保持好奇。</span></p>
    <nav aria-label="个人导航"><ul className={styles.navList}>{items.map((item) => <li key={item.id} className={item.id === "logout" ? styles.logout : undefined}>
      <Link href={item.path} className={`${styles.navItem} ${pathname === item.path && item.id !== "logout" ? styles.active : ""}`}
        onClick={() => {
          if (item.id === "logout") dispatch?.({ type: "Logout", user: { name: "", token: "", state: "Offline", communityId: "", email: "" } });
          onClose();
        }}><span className={styles.iconWrapper}>{item.icon}</span>{item.label}</Link>
    </li>)}</ul></nav>
  </Drawer>;
};
export default PopupNav;
export const useLoginTriggerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return { isMenuOpen, openMenu: () => setIsMenuOpen(true), closeMenu: () => setIsMenuOpen(false), toggleMenu: () => setIsMenuOpen((value) => !value) };
};
