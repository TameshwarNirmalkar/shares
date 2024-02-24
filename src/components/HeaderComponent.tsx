"use client";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@redux-store/reduxHooks";
import { AppState } from "@redux-store/store";
import { selectUserById } from "@redux-store/users";
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
  const userDetails = useAppSelector((state: AppState) => selectUserById(state, session.user.user.id)) as any;

  return (
    <div className="flex items-center">
      <Image
        src={userDetails?.profile_image || session.user.user.image}
        alt="User Image"
        width={30}
        height={30}
        style={{ width: 30, height: 30 }}
        className="rounded-full"
      />
      <Dropdown menu={{ items }} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()} href="#" className="text-slate-500">
          <Space>
            <div className="text-slate-100">
              <span className="capitalize p-3">{userDetails?.full_name || session.user.user.name}</span>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </Space>
        </a>
      </Dropdown>
    </div>
  );
});

export default HeaderComponent;
