"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// 定义主题类型
type ThemeContextType = {
  backgroundColor: string;
  primaryColor: string;
  color: string;
  borderColor: string;
  errorColor: string;
};

// 主题上下文类型，包含 `theme` 和 `setTheme`
type ThemeProviderProps = {
  theme: ThemeContextType;
  setTheme: (theme: ThemeContextType) => void;
};

// 创建默认主题
const defaultTheme: ThemeContextType = {
  backgroundColor: "#ffffff",
  primaryColor: "#2563EB",
  color: "#333333",
  borderColor: "E0E0E0",
  errorColor: "red",
};

// 创建 Context（初始值为 undefined，因为 Provider 会提供值）
const ThemeContext = createContext<ThemeProviderProps | undefined>(undefined);

// 主题提供者
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeContextType>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 创建一个自定义 Hook 方便获取主题
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme 必须在 ThemeProvider 内使用");
  }
  return context;
};

export default ThemeContext;
