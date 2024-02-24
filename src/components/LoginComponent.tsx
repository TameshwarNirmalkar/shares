"use client";

import { Alert, Button, Checkbox, Form, Input, message } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback, useState } from "react";

type FieldType = {
  email: string;
  password: string;
  remember?: string;
};

const LoginComponent: FC<{}> = memo(() => {
  const { push } = useRouter();

  const [userError, setUserError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = useCallback(async (values: FieldType) => {
    setIsLoading(true);
    try {
      const res: any = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl: "/error",
      });
      if (res?.ok) {
        push("/dashboard");
      } else {
        setUserError(true);
      }
    } catch (error: any) {
      message.error(error.toString());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="w-2/5">
      <h1 className="text-2xl justify-center grid mb-4 text-slate-400">Login</h1>
      <div className="bg-slate-600 rounded-lg p-4">
        {userError && <Alert className="p-2 mb-3" type="error" message={<span className="error text-red-700">{"Invalid Credentials."}</span>} />}

        <Form
          initialValues={{ email: null, password: null, remember: false }}
          className="space-y-4 md:space-y-6"
          layout="vertical"
          name="loginForm"
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item<FieldType>
            label={<span className="font-light text-white">Username</span>}
            name="email"
            rules={[
              { required: true, message: "Email Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={<span className="font-light text-white">Password</span>}
            name="password"
            rules={[{ required: true, message: "Password Required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox>
              <span className="font-light text-white">Remember me</span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" danger block loading={isLoading} disabled={isLoading}>
              Login
            </Button>
          </Form.Item>
          <p className="text-sm font-light text-white">
            <span>Don’t have an account yet? </span>
            <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Sign up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
});

export default LoginComponent;
