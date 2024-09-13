import styles from "./commnity.module.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h2>社区</h2>
        <ul>
          <li>
            <a href="/community/base">基础知识</a>
          </li>
          <li>
            <a href="/community/case">案例</a>
          </li>
          <li>
            <a href="/community/post">推文</a>
          </li>
          <li>
            <a href="/community/channel">频道</a>
          </li>
        </ul>
      </aside>
      {children}
    </div>
  );
}
