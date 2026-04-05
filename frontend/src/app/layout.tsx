import type { Metadata } from "next";
import "./globals.css";
import { DAOProvider } from "@/contexts/DAOContext";

export const metadata: Metadata = {
  title: "DAO Governance Platform",
  description: "Decentralized Autonomous Organization for community-driven governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        <DAOProvider>
          {children}
        </DAOProvider>
      </body>
    </html>
  );
}
