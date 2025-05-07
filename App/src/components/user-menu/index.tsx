"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import styles from "./user-nav.module.css";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface PopupNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupNav: React.FC<PopupNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

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
      path: "/user-profile",
    },
    {
      id: "favorites",
      label: "发布",
      icon: <EditOutlined />,
      path: "/publish",
    },
    {
      id: "create",
      label: "创建社区",
      icon: <TeamOutlined />,
      path: "/community/create",
    },
    {
      id: "community-settings",
      label: "我的社区",
      icon: <TeamOutlined />,
      path: "/my-community/settings",
    },
    {
      id: "settings",
      label: "设置",
      icon: <SettingOutlined />,
      path: "/settings",
    },
    {
      id: "logout",
      label: "退出登录",
      icon: <SettingOutlined />,
      path: "/",
    },
  ];

  const activeId = navItems.find((item) => pathname === item.path)?.id || "";

  const handleItemClick = (id: string) => {
    switch (id) {
      case "logout":
        console.log("退出登录");
        break;

      default:
        break;
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Navigation menu */}
      <div className={`${styles.navWrapper} ${isOpen ? styles.open : ""}`}>
        <div className={styles.navContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseOutlined />
          </button>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`${styles.navItem} ${
                    activeId === item.id ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className={styles.iconWrapper}>{item.icon}</div>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PopupNav;

const useLoginTriggerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};

export { useLoginTriggerMenu };
