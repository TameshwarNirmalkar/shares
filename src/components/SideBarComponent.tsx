"use-client";

import { faClockRotateLeft, faIndianRupee, faMoneyBills, faPeopleRoof, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  "master-investment": "master-investment",
  "my-investments": "my-investments",
  stakeholder: "stakeholder",
  "investment-list": "investment-list",
  "re-investments": "re-investments",
  "interest-calculator": "interest-calculator",
};

const items: MenuProps["items"] = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <FontAwesomeIcon icon={faMoneyBills} color="white" fontSize={20} />,
  },
  {
    label: "Clients",
    key: "clients",
    icon: <FontAwesomeIcon icon={faPeopleRoof} color="white" fontSize={20} />,
    children: [
      { label: "Add Clients", key: "add_clients" },
      { label: "Clients List", key: "client_list" },
    ],
  },
  {
    label: "Investments",
    key: "investments",
    icon: <FontAwesomeIcon icon={faSackDollar} color="white" fontSize={20} />,
    children: [
      { label: "Master Investments", key: "master-investment" },
      { label: "My Investments", key: "my-investments" },
      { label: "Stakeholders", key: "stakeholder" },
      { label: "Consolidate", key: "investment-list" },
      { label: "Re-Investment", key: "re-investments" },
    ],
  },
  {
    label: "History",
    key: "history",
    icon: <FontAwesomeIcon icon={faClockRotateLeft} color="white" fontSize={20} />,
    children: [
      { label: "Transaction", key: "transaction" },
      { label: "Interest Calculator", key: "interest-calculator" },
    ],
  },
];

const SideBarComponent: FC<{}> = memo(() => {
  const { push } = useRouter();
  const pname = usePathname();

  const openKeys = useMemo(() => items.map((el) => el?.key), [items]) as string[];

  const [activeLink, setActiveLink] = useState<string[]>(["dashboard"]);

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
      <div className="grid justify-items-center p-2 sticky top-0 bg-black z-10">
        {/* <SunFilled style={{ fontSize: 40, color: "rgb(250 204 21)" }} /> */}
        <FontAwesomeIcon icon={faIndianRupee} color="rgb(250 204 21)" fontSize={40} />
      </div>
      <div>
        <Menu
          onClick={onClick}
          style={{ width: "100%" }}
          theme="dark"
          activeKey={openKeys.toString()}
          selectedKeys={activeLink}
          defaultSelectedKeys={activeLink}
          // defaultOpenKeys={openKeys}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
});

export default SideBarComponent;
