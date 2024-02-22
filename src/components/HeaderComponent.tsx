"use client";

import { Dropdown, MenuProps, Space } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, memo } from "react";

const items: MenuProps["items"] = [
  {
    label: (
      <Link rel="noopener noreferrer" href="/my-profile">
        My Profile
      </Link>
    ),
    key: "0",
  },
  {
    label: (
      <Link rel="noopener noreferrer" href="#" onClick={async () => await signOut({ callbackUrl: "/login" })}>
        Logout
      </Link>
    ),
    key: "1",
  },
];

const HeaderComponent: FC<{}> = memo(() => {
  const { data: session }: any = useSession();

  return (
    <div className="flex items-center">
      <Image src={session.user.user.image} alt="User Image" width={30} height={30} style={{ width: 30, height: 30 }} className="rounded-full" />
      <Dropdown menu={{ items }} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <span className="capitalize p-3">{session?.user?.user?.name}</span>
          </Space>
        </a>
      </Dropdown>
    </div>
  );
});

export default HeaderComponent;
