"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import HeaderComponent from "@components/HeaderComponent";
import SideBarComponent from "@components/SideBarComponent";
import { Button, Col, Layout, Row, theme } from "antd";
import { Suspense, useState } from "react";
import Loading from "./loading";

const { Header, Sider, Content } = Layout;
// const twoColors = { "0%": "#108ee9", "100%": "#87d068" };

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <SideBarComponent />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row align={"middle"} justify={"space-between"} className="pr-3">
            <Col>
              <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
            </Col>
            <Col>
              <HeaderComponent />
            </Col>
          </Row>
        </Header>
        <Content className="p-3">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
