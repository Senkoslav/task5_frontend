import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "@/components/common/BootstrapClient";
import { ToastProvider } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "User Management System",
  description: "User management system with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
