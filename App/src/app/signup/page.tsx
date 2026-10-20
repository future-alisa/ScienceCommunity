"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";
import { useState } from "react";
import { Alert, Button, Input } from "antd";
import UserService from "@/services/UserService";
export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function signup(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setError("");
    try {
      const result = await UserService.signup({ username: userName, password, email: "" });
      if (result !== true) throw new Error("注册失败，请重试");
      router.push("/signin");
    } catch (error) { setError(error instanceof Error ? error.message : "注册失败，请重试"); }
    finally { setLoading(false); }
  }
  return <div className={styles.page}>
    <div className={styles.left_container}>
      <span className={styles.eyebrow}>SCIENCE COMMUNITY</span>
      <h1 className={styles.title}>知识的边界，<br />由你向外延伸。</h1>
      <p className={styles.intro}>加入感兴趣的学科社区，积累知识，分享发现，让每一次讨论都有所收获。</p>
      <div className={styles.note}>保持好奇，自由探索。</div>
    </div>
    <div className={styles.right_container}><form className={styles.form_container} onSubmit={signup}>
      <h2 className={styles.formTitle}>创建账号</h2><p className={styles.formSubtitle}>开始你的学科探索之旅。</p>
      {error && <Alert className={styles.error} type="error" showIcon message={error} />}
      <label className={styles.field}><span>用户名</span><Input className={styles.input_field} autoComplete="username" required placeholder="设置用户名" value={userName} onChange={(event) => setUserName(event.target.value)} /></label>
      <label className={styles.field}><span>密码</span><Input.Password className={styles.input_field} autoComplete="new-password" required placeholder="设置密码" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <div className={styles.button_container}><Button type="primary" htmlType="submit" className={styles.submit} loading={loading}>创建账号</Button></div>
      <p className={styles.switch}>已有账号？<Link href="/signin">返回登录</Link></p>
    </form></div>
  </div>;
}
