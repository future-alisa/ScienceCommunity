"use client";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import { useState } from "react";
import { Button, Input } from "antd";
import { useTheme } from "@/theme/ThemeContext";
import UserService from "@/services/UserService";
export default function Page() {
  const route = useRouter();
  const { theme } = useTheme();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const signup = async () => {
    try {
      const res = await UserService.signup({
        username: userName,
        password: password,
        email: "",
      });
      if (res !== true) {
        throw new Error("注册失败");
      }
      alert("注册成功");
      route.push("/community");
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
              className={styles.signup_button}
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.color,
                width: "100%",
                height: 40,
                marginBottom: 16,
              }}
              onClick={() => signup()}
            >
              注册
            </Button>
            <a href="/signin" className={styles.signin_link}>
              登录
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
