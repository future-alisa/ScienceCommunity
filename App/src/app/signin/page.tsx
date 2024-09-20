"use client";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import { useState } from "react";
export default function Page() {
  const route = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    try {
      const res = await fetch("http://47.94.97.3:8080/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password: password }),
        credentials: "include",
      });
      console.log("111", res.json());
      if (res.status === 200) {
        route.push("/community");
      }else{
        alert('用户名或者密码错误')
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.left_container}>
        <p>欢迎来到科学社区</p>
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
        <button className={styles.btn} onClick={() => login()}>
          登录
        </button>
      </div>
    </div>
  );
}
