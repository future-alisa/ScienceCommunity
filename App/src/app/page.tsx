"use client";
import { useTheme } from "@/theme/ThemeContext";
import styles from "./page.module.css";
import Input from "./components/Input";

export default function Home() {
  const { theme } = useTheme();
  return (
    <main className={styles.main}>
      <p className={styles.description}>
        科学社区是一个探索科学的开放平台，输入社区地址进行探索
      </p>
      <div className={styles.inputContainer}>
        <Input style={{ backgroundColor: theme.backgroundColor }}></Input>
        <button
          className={styles.submitButton}
          style={{ backgroundColor: theme.primaryColor }}
        >
          进入
        </button>
      </div>
    </main>
  );
}
