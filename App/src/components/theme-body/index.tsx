"use client";
import { App as AntApp, ConfigProvider, theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import Navigator from "@/components/navigator";
import { useTheme } from "@/theme/ThemeContext";
import PopupNav, { useLoginTriggerMenu } from "@/components/user-menu";

export const ThemeBody = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { isMenuOpen, closeMenu, toggleMenu } = useLoginTriggerMenu();
  const dark = theme.name === "Dark";
  return (
    <body data-theme={dark ? "dark" : "light"} style={{ background: theme.backgroundColor, color: theme.color }}>
      <ConfigProvider locale={zhCN} theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme.primaryColor, colorText: theme.color, colorBorder: theme.borderColor,
          colorBgContainer: dark ? "#1c2226" : "#ffffff", colorBgLayout: theme.backgroundColor,
          colorTextSecondary: dark ? "#99a6ad" : "#626e78", borderRadius: 8, controlHeight: 40,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: 14, boxShadowSecondary: "0 8px 32px rgba(24, 39, 31, 0.08)",
        },
        components: { Button: { primaryShadow: "none", primaryColor: dark ? "#101b15" : "#ffffff" }, Card: { headerFontSize: 16 }, Table: { headerBg: dark ? "#232b30" : "#f7f9f8" } },
      }}>
        <AntApp className="app-shell">
          <a href="#main-content" className="skip-link">跳转到内容</a>
          <Navigator toggleMenu={toggleMenu} />
          <div id="main-content" className="site-content">{children}</div>
          <PopupNav isOpen={isMenuOpen} onClose={closeMenu} />
        </AntApp>
      </ConfigProvider>
    </body>
  );
};
