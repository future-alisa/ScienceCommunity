"use client";
import { Inter } from "next/font/google";
import Navigator from "@/components/navigator";
import { useTheme } from "@/theme/ThemeContext";
import RightSideNav from "@/components/user-nav";
import { FileOutlined, HeartOutlined, HomeOutlined } from "@ant-design/icons";
const inter = Inter({ subsets: ["latin"] });

export const ThemeBody = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  // 或者自定义导航项
  const customNavItems = [
    {
      id: "home",
      label: "主页",
      icon: <HomeOutlined />,
      onClick: () => console.log("自定义主页点击"),
    },
    {
      id: "docs",
      label: "文档",
      icon: <FileOutlined />,
      onClick: () => console.log("文档点击"),
    },
    {
      id: "likes",
      label: "喜欢",
      icon: <HeartOutlined />,
      onClick: () => console.log("喜欢点击"),
    },
  ];
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
      <Navigator />
      {children}
      <RightSideNav items={customNavItems} initialActiveId="home" />
    </body>
  );
};
