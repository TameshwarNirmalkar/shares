import { getServerAuthSession } from "@/server/auth";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProviders } from "@redux-store/providers";
import type { Metadata } from "next";
import { AuthProvider } from "./Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manage Intereset",
  description: "Interset manage price",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerAuthSession()) as any;

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

// RootLayout.getInitialProps = async (context: any) => {
//   const { ctx } = context;
//   console.log("getInitialProps ================================ : ", ctx);
//   const session = await getSession(ctx);
//   return {
//     session,
//   };
// };
