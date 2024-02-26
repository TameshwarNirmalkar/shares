"use client";

import { PASSWORD_PATTERN } from "@utility/regex-pattern";
import { Button, Form, Input, Layout, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback } from "react";

type FieldType = {
  full_name: string;
  email: string;
  password: string;
};

const RegisterForm: FC<{}> = memo(() => {
  const { push } = useRouter();

  const onFinish = useCallback(async (values: FieldType) => {
    const res = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values }),
    }).then((res) => res.json());

    if (!res.success) {
      message.error({
        content: res.message,
        duration: 5,
      });
    } else {
      push("/login");
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="h-screen items-center grid justify-items-center">
        <div className="w-2/5">
          <h1 className="text-2xl justify-center grid mb-4 text-slate-100">Registeration</h1>
          <div className="bg-slate-600 rounded-lg p-4">
            <Form className="space-y-4" layout="vertical" name="registrationForm" onFinish={onFinish} autoComplete="off">
              <Form.Item<FieldType>
                label={<span className="font-light text-white">Full Name</span>}
                name="full_name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label={<span className="font-light text-white">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label={<span className="font-light text-white">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Required" },
                  { pattern: PASSWORD_PATTERN, message: "Password should contains, 1 Capital letter, 1 special characters and 8 characters long." },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" danger block>
                  Register
                </Button>
              </Form.Item>

              <p className="flex justify-end">
                <Link href="/login" className="rounded-lg border px-5 bg-slate-700 py-1 text-slate-300">
                  Login
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default RegisterForm;
