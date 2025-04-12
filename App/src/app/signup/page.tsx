"use client";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import { useState } from "react";
export default function Page() {
  const route = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const logup = async () => {
    try {
      const res = await fetch("http://47.94.97.3:8080/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password: password }),
        credentials: "include",
      });
      if (res.status === 200) {
        alert('注册成功')
        route.push("/community");
      } else {
        alert("用户名或者密码错误");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.left_container}>
        <p className={styles.title}>欢迎来到科学社区</p>
      </div>
      <div className={styles.right_container}>
        <input
          type="text"
          className={styles.input}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.btn} onClick={() => logup()}>
          注册
        </button>
        <div>
          <a href="/signin">登录</a>
        </div>
      </div>
    </div>
  );
}
