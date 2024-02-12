import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { AuthProvider } from "./Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manage Intereset",
  description: "Interset manage price",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="App">
        <AuthProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
