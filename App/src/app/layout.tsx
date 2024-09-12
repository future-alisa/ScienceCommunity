import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import  Navigator  from "@/components/navigator";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Navigator />
        {children}
      </body>
    </html>
  );
}
