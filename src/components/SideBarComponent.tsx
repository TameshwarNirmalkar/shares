"use-client";

import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { GrLineChart } from "react-icons/gr";
import { SiWebmoney } from "react-icons/si";
const KEY_PATH: { [key: number]: string } = {
  0: "dashboard",
  1: "add_clients",
  2: "client_list",
  3: "transaction",
  4: "interest_calculator",
  5: "investment",
  6: "my-investments",
  7: "stakeholder",
  8: "investment-list",
};

const items: MenuProps["items"] = [
  {
    label: "Dashboard",
    key: 0,
  },
  {
    label: "Clients",
    key: "sub1",
    icon: <FaUsers />,
    children: [
      { label: "Add Clients", key: "1" },
      { label: "Clients List", key: "2" },
    ],
  },
  {
    label: "Investments",
    key: "sub3",
    icon: <FaUsers />,
    children: [
      { label: "My Investments", key: "6" },
      { label: "Stakeholder", key: "7" },
      { label: "Investment List", key: "8" },
    ],
  },
  {
    label: "History",
    key: "sub2",
    icon: <GrLineChart />,
    children: [
      { label: "Transaction", key: "3" },
      { label: "Interest Calculator", key: "4" },
      { label: "Investment", key: "5" },
    ],
  },
];

const SideBarComponent: FC<{}> = memo(() => {
  const { push } = useRouter();
  const pname = usePathname();

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
        <SiWebmoney size={50} color="white" />
      </div>
      <div>
        <Menu onClick={onClick} style={{ width: "100%" }} theme="dark" defaultSelectedKeys={activeLink} defaultOpenKeys={[]} mode="inline" items={items} />
      </div>
    </div>
  );
});

export default SideBarComponent;
