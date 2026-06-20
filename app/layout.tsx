import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocScope AI",
  description: "Your AI-powered document learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} antialiased bg-[#EBE3C3] text-[#2B1C18] selection:bg-[#DB6E4C] selection:text-[#F5F2E8]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}