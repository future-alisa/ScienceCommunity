"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// 定义主题类型
type ThemeContextType = {
  name: string;
  backgroundColor: string;
  primaryColor: string;
  color: string;
  borderColor: string;
  errorColor: string;
};

type ThemeProviderProps = {
  theme: ThemeContextType;
  setTheme: (theme: ThemeContextType) => void;
};

export const LightTheme: ThemeContextType = {
  name: "Light",
  backgroundColor: "#f7f8fa",
  primaryColor: "#36644e",
  color: "#252d32",
  borderColor: "#e5e9ec",
  errorColor: "#c85450",
};

export const DarkTheme: ThemeContextType = {
  name: "Dark",
  backgroundColor: "#15191c",
  primaryColor: "#74ad8c",
  color: "#e4e9e6",
  borderColor: "#303a40",
  errorColor: "#df8179",
};

const ThemeContext = createContext<ThemeProviderProps | undefined>(undefined);

// 主题提供者
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeContextType>(LightTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme 必须在 ThemeProvider 内使用");
  }
  return context;
};

export { ThemeContext };
