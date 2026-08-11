import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samud Shabkat | Hardware & Technology",
  description:
    "Discover computers, components, accessories, networking equipment, and technology products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable} ${geistSans.className}`}
    >
      <body className="h-full antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
