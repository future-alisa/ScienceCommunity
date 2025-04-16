"use client";
import { Inter } from "next/font/google";
import Navigator from "@/components/navigator";
import { useTheme } from "@/theme/ThemeContext";
import { useLoginTriggerMenu } from "@/components/user-menu";
import PopupNav from "@/components/user-menu";
const inter = Inter({ subsets: ["latin"] });

export const ThemeBody = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { isMenuOpen, closeMenu, toggleMenu } = useLoginTriggerMenu();

  const closeNav = () => {
    closeMenu();
  };

  return (
    <body
      className={inter.className}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        margin: 0, // 确保没有默认边距
        overflow: "hidden", // 防止滚动条问题
      }}
    >
      <Navigator toggleMenu={toggleMenu} />
      {children}
      <PopupNav isOpen={isMenuOpen} onClose={closeNav} />
    </body>
  );
};
