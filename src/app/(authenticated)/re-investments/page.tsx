"use client";

import { Button, Col, Divider, Form, Input, Modal, Row } from "antd";
import { FC, memo, useCallback, useEffect, useState } from "react";

import UserDetailsComponent from "@components/UserDetailsComponent";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { changePassword } from "@redux-store/users/action";
import { isLoading } from "@redux-store/users/memonised-user";
import { PASSWORD_PATTERN } from "@utility/regex-pattern";
import { signOut, useSession } from "next-auth/react";

const ReInvestmentPage: FC<{}> = memo(() => {
  const { data: session } = useSession() as any;
  const dispatch = useAppDispatch();

  const loading = useAppSelector(isLoading);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {}, [session, dispatch]);

  const onUpdatePassword = useCallback(async (val: any) => {
    const res = await dispatch(changePassword(val));
    if (res.payload.success) {
      await signOut({ callbackUrl: "/login" });
    }
  }, []);

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={8}>Investment Card</Col>
        <Col span={16}>Items</Col>
      </Row>

      <Modal title="Change Password" open={isModalOpen} footer={null} centered={true} maskClosable={false} onCancel={() => setIsModalOpen(false)}>
        <p className="text-xs">
          *Note:
          <span className="text-slate-500">
            After successful change password you have to re-login with new password in the system. System will redirect to login page.
          </span>
        </p>

        <Divider className="my-3" />
        <Form name="change-password" onFinish={onUpdatePassword} layout="vertical">
          <Form.Item name={"old_password"} label="Old Password" rules={[{ required: true, message: "Required" }]}>
            <Input.Password onPaste={(e) => e.preventDefault()} />
          </Form.Item>
          <Form.Item
            name={"new_password"}
            label="New Password"
            rules={[
              { required: true, message: "Required" },
              { pattern: PASSWORD_PATTERN, message: "Password should contains, 1 Capital letter, 1 special characters and 8 characters long." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue("confirm_password") && getFieldValue("confirm_password") !== value) {
                    return Promise.reject(new Error("The new password that you entered do not match!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password onPaste={(e) => e.preventDefault()} maxLength={16} />
          </Form.Item>
          <Form.Item
            name={"confirm_password"}
            dependencies={["new_password"]}
            label="Confirm Password"
            rules={[
              { required: true, message: "Required" },
              { pattern: PASSWORD_PATTERN, message: "Password should contains, 1 Capital letter, 1 special characters and 8 characters long." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue("new_password") && getFieldValue("new_password") !== value) {
                    return Promise.reject(new Error("The new password that you entered do not match!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password onPaste={(e) => e.preventDefault()} maxLength={16} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Button type="primary" danger onClick={() => setIsModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>

      <UserDetailsComponent drawerHeading="Edit Details" isDrawerOpen={isDrawerOpen} onDrawerOpen={(val) => setIsDrawerOpen(val)} />
    </>
  );
});

export default ReInvestmentPage;
