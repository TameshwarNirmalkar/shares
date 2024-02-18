import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProviders } from "@redux-store/providers";
import type { Metadata } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { AuthProvider } from "./Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manage Intereset",
  description: "Interset manage price",
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session }) {
  console.log("Root Session : ", session);

  return (
    <html lang="en">
      <body className="App">
        <StoreProviders>
          <AuthProvider session={session}>
            <AntdRegistry>{children}</AntdRegistry>
          </AuthProvider>
        </StoreProviders>
      </body>
    </html>
  );
}

RootLayout.getInitialProps = async (context: any) => {
  const { ctx } = context;
  const session = await getSession(ctx);
  console.log("getInitialProps : ", session);
  return {
    session,
  };
};
