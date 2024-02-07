import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Roaster",
  description: "Your sassy best friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/png" href="/icons8-fire-alt-stickers-96.png" />
      <meta property="og:title" content="AI Roaster" />
      <meta property="og:image" content="/triumph.jpg" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
