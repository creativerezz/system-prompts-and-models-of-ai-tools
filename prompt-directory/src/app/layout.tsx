import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Prompt Directory - AI System Prompts Collection",
  description: "Explore system prompts from popular AI tools including Cursor, Claude, VS Code, and more. Over 30,000+ lines of AI prompt insights.",
  keywords: ["AI prompts", "system prompts", "Cursor", "Claude", "VS Code", "AI tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0a0a] text-white min-h-screen font-sans">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
