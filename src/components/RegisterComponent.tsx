"use client";

import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback } from "react";

type FieldType = {
  full_name: string;
  email: string;
  password: string;
};

const RegisterForm: FC<{}> = memo(() => {
  const [messageApi, contextHolder] = message.useMessage();
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
      messageApi.open({
        type: "error",
        content: res.message,
        duration: 5,
      });
    } else {
      push("/login");
    }
  }, []);

  return (
    <div className="w-2/5">
      <h1 className="text-2xl justify-center grid mb-4">Registeration</h1>
      <div className="bg-slate-600 rounded-lg  border p-4">
        {contextHolder}
        <Form className="space-y-4 md:space-y-6" layout="vertical" name="registrationForm" onFinish={onFinish} autoComplete="off">
          <Form.Item<FieldType>
            label={<span className="font-light text-gray-500 dark:text-gray-400">Full Name</span>}
            name="full_name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label={<span className="font-light text-gray-500 dark:text-gray-400">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Email Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={<span className="font-light text-gray-500 dark:text-gray-400">Password</span>}
            name="password"
            rules={[{ required: true, message: "Password Required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" danger block>
              Register
            </Button>
          </Form.Item>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
});

export default RegisterForm;
