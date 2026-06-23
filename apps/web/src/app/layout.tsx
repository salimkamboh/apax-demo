import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "APAX Auth Assessment",
  description: "Next.js login flow wired to an Express MongoDB JWT API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
