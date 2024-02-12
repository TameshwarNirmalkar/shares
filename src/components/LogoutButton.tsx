"use client";

import { Button } from "antd";
import { signOut } from "next-auth/react";
import { memo, useCallback } from "react";

export default memo(function LogoutButton() {
  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  return <Button onClick={handleLogout}>Log out</Button>;
});
