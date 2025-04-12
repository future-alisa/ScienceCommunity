"use client";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import { useState } from "react";
import { useTheme } from "@/theme/ThemeContext";
export default function Page() {
  const route = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    try {
      const res = await fetch(
        "http://" +
          process.env.NEXT_PUBLIC_SERVER_HOST +
          ":8080/api/v1/user/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, password: password }),
          credentials: "include",
        }
      );
      if (res.status === 200) {
        route.push("/community");
      } else {
        alert("用户名或者密码错误");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { theme } = useTheme();
  return (
    <div className={styles.page}>
      <div className={styles.left_container}>
        <p className={styles.title}>欢迎来到科学社区</p>
      </div>
      <div className={styles.right_container}>
        <input
          type="text"
          className={styles.input}
          style={{ backgroundColor: theme.backgroundColor }}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          className={styles.input}
          style={{ backgroundColor: theme.backgroundColor }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.singin_container}>
          <button
            className={styles.btn}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.color,
            }}
            onClick={() => login()}
          >
            登录
          </button>
          <a href="/signup">注册</a>
        </div>
      </div>
    </div>
  );
}
