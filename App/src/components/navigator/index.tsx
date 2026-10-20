"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "antd";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { UserOutlined } from "@ant-design/icons";
import styles from "./style.module.css";

export default function Navigator({ toggleMenu }: { toggleMenu: () => void }) {
  const pathname = usePathname();
  const user = useContext(UserContext);
  const links = [{ href: "/", label: "首页" }, { href: "/community", label: "学科社区" }, { href: "/about", label: "关于" }];
  return <header className={styles.header}>
    <nav className={styles.nav_container} aria-label="主导航">
      <Link href="/" className={styles.brand} aria-label="科学社区首页"><span className={styles.brandMark}>S</span><span>科学社区<small>Science Community</small></span></Link>
      <div className={styles.nav_middle}>{links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}
          className={`${styles.nav_link} ${active ? styles.active : ""}`}>{link.label}</Link>;
      })}</div>
      <div className={styles.nav_right}>{user.state === "Online" ? <button className={styles.accountButton} onClick={toggleMenu} aria-label="打开个人导航">
        <Avatar size={32} className={styles.avatar} icon={!user.name ? <UserOutlined /> : undefined}>{user.name?.charAt(0).toUpperCase()}</Avatar>
        <span className={styles.accountName}>{user.name}</span>
      </button> : <Link href="/signin" className={styles.signin}>登录 <span aria-hidden="true">↗</span></Link>}</div>
    </nav>
  </header>;
}
