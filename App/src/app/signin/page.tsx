"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";
import { useContext, useState } from "react";
import { UserDispatchContext } from "@/context/UserContext";
import { Alert, Button, Input } from "antd";
import { beginOAuth } from "@/services/OAuthService";
import UserService from "@/services/UserService";
export default function Page() {
  const router = useRouter();
  const dispatch = useContext(UserDispatchContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function login(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setError("");
    try {
      const token = await UserService.login({ username: userName, password, email: "" });
      if (!token) throw new Error("用户名或密码错误");
      dispatch?.({ type: "Login", user: { name: userName, email: "", communityId: "", token, state: "Online" } });
      router.push("/community");
    } catch (error) { setError(error instanceof Error ? error.message : "登录失败，请重试"); }
    finally { setLoading(false); }
  }
  return <div className={styles.page}>
    <div className={styles.left_container}>
      <span className={styles.eyebrow}>SCIENCE COMMUNITY</span>
      <h1 className={styles.title}>让好奇心，<br />找到同路人。</h1>
      <p className={styles.intro}>从一本书、一个问题开始。探索感兴趣的学科，与志同道合的人一起学习。</p>
      <div className={styles.note}>理论 · 案例 · 文章 · 讨论</div>
    </div>
    <div className={styles.right_container}><form className={styles.form_container} onSubmit={login}>
      <h2 className={styles.formTitle}>欢迎回来</h2><p className={styles.formSubtitle}>登录科学社区，继续你的探索。</p>
      <Button className={styles.submit} loading={loading} onClick={async () => {
        if (loading) return;
        setLoading(true); setError("");
        try { await beginOAuth(); }
        catch (error) { setError(error instanceof Error ? error.message : "登录失败"); setLoading(false); }
      }}>使用 Alisa 账号继续</Button>
      {error && <Alert className={styles.error} type="error" showIcon message={error} />}
      <label className={styles.field}><span>用户名</span><Input className={styles.input_field} placeholder="输入用户名" autoComplete="username" required value={userName} onChange={(event) => setUserName(event.target.value)} /></label>
      <label className={styles.field}><span>密码</span><Input.Password className={styles.input_field} placeholder="输入密码" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <div className={styles.button_container}><Button type="primary" htmlType="submit" className={styles.submit} loading={loading}>登录</Button></div>
      <p className={styles.switch}>还没有账号？<Link href="/signup">创建账号</Link></p>
    </form></div>
  </div>;
}
