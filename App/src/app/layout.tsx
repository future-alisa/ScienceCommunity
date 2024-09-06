import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MyNav } from "./mynav";

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
        <MyNav />
        {children}
      </body>
    </html>
  );
}
