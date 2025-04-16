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
  backgroundColor: "#ffffff",
  primaryColor: "#2563EB",
  color: "#333333",
  borderColor: "E0E0E0",
  errorColor: "red",
};

export const DarkTheme: ThemeContextType = {
  name: "Dark",
  backgroundColor: "#141414",
  primaryColor: "#177ddc",
  color: "#e0e0e0",
  borderColor: "303030",
  errorColor: "red",
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
