import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// This imports the modern Inter font
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
      {/* We added suppressHydrationWarning here to stop browser extensions from crashing Next.js */}
      <body 
        className={`${inter.className} antialiased bg-zinc-50 text-zinc-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}