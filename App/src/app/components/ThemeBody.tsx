"use client";
import { Inter } from "next/font/google";
import Navigator from "@/components/navigator";
import { useTheme } from "@/theme/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const ThemeBody = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <body
      className={inter.className}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        //backgroundImage: "url(/background.png)",
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navigator />
      {children}
    </body>
  );
};
