import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "backtalk.dev",
  description: "Echo Server Demo UI by Franco Posa",
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
