"use-client";

import { InsertRowAboveOutlined, MehOutlined, SketchCircleFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";

const KEY_PATH: { [key: string]: string } = {
  dashboard: "dashboard",
  add_clients: "add_clients",
  client_list: "client_list",
  transaction: "transaction",
  interest_calculator: "interest_calculator",
  investment: "investment",
  "my-investments": "my-investments",
  stakeholder: "stakeholder",
  "investment-list": "investment-list",
};

const items: MenuProps["items"] = [
  {
    label: "Dashboard",
    key: "dashboard",
  },
  {
    label: "Clients",
    key: "clients",
    icon: <MehOutlined />,
    children: [
      { label: "Add Clients", key: "add_clients" },
      { label: "Clients List", key: "client_list" },
    ],
  },
  {
    label: "Investments",
    key: "investments",
    icon: <MehOutlined />,
    children: [
      { label: "My Investments", key: "my-investments" },
      { label: "Stakeholder", key: "stakeholder" },
      { label: "Investment List", key: "investment-list" },
    ],
  },
  {
    label: "History",
    key: "history",
    icon: <InsertRowAboveOutlined />,
    children: [
      { label: "Transaction", key: "transaction" },
      { label: "Interest Calculator", key: "interest_calculator" },
      { label: "Investment", key: "investment" },
    ],
  },
];

const SideBarComponent: FC<{}> = memo(() => {
  const { push } = useRouter();
  const pname = usePathname();

  const openKeys = useMemo(() => items.map((el) => el?.key), [items]) as string[];
  console.log(" open items: ", openKeys);

  const [activeLink, setActiveLink] = useState<string[]>(["0"]);

  useEffect(() => {
    const pathIndex = Object.keys(KEY_PATH).filter((key: any) => KEY_PATH[key] === pname?.split("/")[1]) as string[];
    setActiveLink(pathIndex);
  }, [pname]);

  const onClick: MenuProps["onClick"] = useCallback((e: any) => {
    setActiveLink([e.key]);
    push(`/${KEY_PATH[e.key]}`);
  }, []);

  return (
    <div className="">
      <div className="grid justify-items-center p-2">
        <SketchCircleFilled />
        {activeLink}
      </div>
      <div>
        <Menu
          onClick={onClick}
          style={{ width: "100%" }}
          theme="dark"
          activeKey={openKeys.toString()}
          selectedKeys={activeLink}
          defaultSelectedKeys={activeLink}
          defaultOpenKeys={openKeys}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
});

export default SideBarComponent;
