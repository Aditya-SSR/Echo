import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/Navbar.jsx";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Echo",
  description: "A simple place to post what's on your mind.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
