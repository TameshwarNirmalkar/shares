"use client";

import { useSession } from "next-auth/react";
import { FC, memo } from "react";
import LogoutButton from "./LogoutButton";

const HeaderComponent: FC<{}> = memo(() => {
  const { data: session }: any = useSession();
  return (
    <div>
      <span className="capitalize p-3">{session?.user?.user?.name}</span>
      <LogoutButton />
    </div>
  );
});

export default HeaderComponent;
