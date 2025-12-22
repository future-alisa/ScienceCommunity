"use client";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import { useContext, useState } from "react";
import { useTheme } from "@/theme/ThemeContext";
import { UserDispatchContext } from "@/context/UserContext";
import { Button, Input } from "antd";
export default function Page() {
  const route = useRouter();
  const dispatch = useContext(UserDispatchContext);
  const [userName, setUserName] = useState("test");
  const [password, setPassword] = useState("test");
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
        const json = await res.json();
        dispatch!({
          type: "Login",
          user: {
            name: userName,
            token: json.data,
            state: "Online",
          },
        });
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
        <div className={styles.form_container}>
          <Input
            placeholder="用户名"
            className={styles.input_field}
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.color,
              marginBottom: 16,
            }}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input.Password
            placeholder="密码"
            className={styles.input_field}
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.color,
              marginBottom: 24,
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.button_container}>
            <Button
              type="primary"
              className={styles.login_button}
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.color,
                width: "100%",
                height: 40,
                marginBottom: 16,
              }}
              onClick={() => login()}
            >
              登录
            </Button>
            <a href="/signup" className={styles.signup_link}>
              注册
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
