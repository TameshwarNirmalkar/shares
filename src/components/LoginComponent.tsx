"use client";

import { Alert, Button, Checkbox, Col, Form, Input, Layout, Row, message } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
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
    <Layout style={{ minHeight: "100vh" }}>
      <Row>
        <Col span={24}>
          <div className="h-screen items-center grid justify-items-center">
            <div className="w-1/4">
              <div className="grid justify-items-center pb-5">
                <Image
                  className="rounded-full"
                  alt="sample user"
                  src="https://i.ibb.co/Wf7TB9k/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png"
                  height={100}
                  width={100}
                />
              </div>
              <div className="bg-slate-600 rounded-lg p-4 bg-opacity-45">
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
                    label={<span className="font-light text-white">Email</span>}
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
                    <Button type="primary" htmlType="submit" danger block loading={isLoading}>
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
          </div>
        </Col>
      </Row>
    </Layout>
  );
});

export default LoginComponent;
