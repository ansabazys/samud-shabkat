import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

export const metadata: Metadata = { title: "Samud Shabkat" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
