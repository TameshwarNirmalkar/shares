"use client";

import { Button, Col, DatePicker, Form, Input, Row, message } from "antd";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useState } from "react";

type FieldType = {
  uuid: String;
  full_name: string;
  email: string;
  phone: number;
  principle_amount: number;
  percentage: number;
  interest_date: Date;
};

const StackholderFormComponent: FC<{ initialVal?: any; onSuccessCallback: () => void }> = (props) => {
  const { onSuccessCallback, initialVal } = props;
  const { data: session }: any = useSession();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [investorForm] = Form.useForm<FieldType>();

  const iniVal = {
    uuid: session?.user?.user?.id,
    full_name: null,
    email: null,
    phone: null,
    principle_amount: null,
    percentage: null,
    interest_date: null,
  };

  useEffect(() => {
    investorForm.resetFields();
  }, [initialVal, investorForm]);

  const onFinish = useCallback(
    async (values: any) => {
      try {
        setIsloading(true);

        const response: any = await fetch(`/api/investors`, {
          method: initialVal._id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({ ...initialVal, uuid: session.user.user.id, ...values }),
        }).then((res) => res.json());
        if (!response.success) {
          message.error(`${response.message}`);
        } else {
          message.success(`${response.message}`);
          investorForm.resetFields();
          if (typeof onSuccessCallback === "function") {
            onSuccessCallback();
          }
        }
      } catch (error: any) {
        message.error(`SERVER ERROR ${error.toString()}`);
      } finally {
        setIsloading(false);
      }
    },
    [session, initialVal]
  );

  return (
    <div>
      <Form form={investorForm} name="myInvestorForm" layout="vertical" initialValues={{ ...iniVal, ...initialVal }} onFinish={onFinish} autoComplete="off">
        {/* <div className="pt-4 pb-4">
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Breadcrumb
                items={[
                  {
                    title: "Investments",
                  },
                  {
                    title: "Stackholder",
                  },
                ]}
              />
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("Calculator");
                  }}
                >
                  Calculator
                </Button>
              </Space>
            </Col>
          </Row>
        </div> */}

        {/* <Card title={`Add your Stackholder/Investor`} style={{ marginBottom: 20 }} extra={""}> */}
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Form.Item<FieldType> label="" name={"uuid"} hidden>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Full Name" name={"full_name"} rules={[{ required: true, message: "Required" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Email"
              name={"email"}
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Invalid email." },
              ]}
            >
              <Input addonAfter="@" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Phone"
              name={"phone"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: /^[0-9]*$/g },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
            <Form.Item<FieldType>
              label="Amount"
              name={"principle_amount"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: /^[0-9]*$/g },
              ]}
            >
              <Input addonAfter="₹" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
              label="Monthly Percentage"
              name={"percentage"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: /^[0-9]*$/g },
                () => ({
                  validator: (_rule, val): Promise<string> => {
                    if (val > 15) {
                      return Promise.reject("Value should be not greter than 15");
                    }
                    return Promise.resolve("");
                  },
                }),
              ]}
            >
              <Input addonAfter="%" maxLength={2} />
            </Form.Item>
            <Form.Item<FieldType> label="Investment Date" name={"interest_date"} rules={[{ required: true, message: "Required" }]}>
              <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        {/* </Card> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading} disabled={isLoading}>
            {initialVal._id ? "Edit Investor" : "Create Investor"}
          </Button>
          <Button type="text" block disabled={isLoading} onClick={() => onSuccessCallback()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(StackholderFormComponent);
