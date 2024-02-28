import { AntdRegistry } from "@ant-design/nextjs-registry";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { StoreProviders } from "@redux-store/providers";
import { getServerAuthSession } from "@server/auth";
import themeConfig from "@theme/themeConfig";
import { App, ConfigProvider } from "antd";
import type { Metadata } from "next";
import { AuthProvider } from "./Provider";
import "./globals.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Interest",
  description: "Interset manage price",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerAuthSession()) as any;

  return (
    <html lang="en">
      <body>
        <StoreProviders>
          <AuthProvider session={session}>
            <AntdRegistry>
              <ConfigProvider theme={themeConfig} autoInsertSpaceInButton={false}>
                <App>{children}</App>
              </ConfigProvider>
            </AntdRegistry>
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
