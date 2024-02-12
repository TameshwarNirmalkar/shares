"use client";

import type { DrawerProps } from "antd";
import { Drawer } from "antd";
import { FC, memo } from "react";

const DrawerComponent: FC<{ heading: string; children: React.ReactNode; placement?: DrawerProps["placement"]; isOpen: boolean; onCloseDrawer: () => void }> = (
  props
) => {
  const { placement = "right", children, heading, isOpen = false, onCloseDrawer } = props;

  const onClose = () => {
    if (typeof onCloseDrawer === "function") {
      onCloseDrawer();
    }
  };
  return (
    <div>
      <Drawer
        title={heading || "Drawer"}
        placement={placement}
        width={500}
        onClose={onClose}
        open={isOpen}
        extra={""}
        destroyOnClose={true}
        maskClosable={false}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default memo(DrawerComponent);
