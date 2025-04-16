import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme/ThemeContext";
import StyledComponentsRegistry from "./registry";
import { UserContextProvider } from "@/context/UserContext";
import { ThemeBody } from "@/components/theme-body";

export const metadata: Metadata = {
  title: "Community",
  description: "探索未知",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <ThemeBody>{children}</ThemeBody>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </UserContextProvider>
    </html>
  );
}
