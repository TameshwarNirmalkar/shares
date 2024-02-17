import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProviders } from "@redux-store/providers";
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
        <StoreProviders>
          <AuthProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </AuthProvider>
        </StoreProviders>
      </body>
    </html>
  );
}
