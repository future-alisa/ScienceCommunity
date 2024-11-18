import styles from "./my-commnity.module.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <h2>社区</h2>
        <ul>
          <li>
            <a href="/my-community/base">基础知识</a>
          </li>
          <li>
            <a href="/my-community/case">案例</a>
          </li>
          <li>
            <a href="/my-community/post">推文</a>
          </li>
          <li>
            <a href="/my-community/channel">频道</a>
          </li>
        </ul>
      </aside>
      {children}
    </main>
  );
}
