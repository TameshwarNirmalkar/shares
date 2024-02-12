"use client";

import { Button, Card, Col, DatePicker, Form, Input, Row, Space, message } from "antd";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useState } from "react";
import { FaTrash } from "react-icons/fa";

type FieldType = {
  uuid: String;
  investment_name?: string;
  investment_date?: Date;
  amount: number;
  percentage: number;
  calculated_amount: number;
  interest_date: Date;
};

const MyInvestment: FC<{}> = memo(() => {
  const { data: session }: any = useSession();

  const iniVal = {
    uuid: session?.user?.user?.id,
    investment_name: null,
    investment_date: null,
    amount: null,
    percentage: null,
    calculated_amount: null,
    interest_date: null,
  };

  const [userList, setUserList] = useState<any[]>([]);
  const [errormsg, setErrorMsg] = useState<string>("");

  const [investmentForm] = Form.useForm<FieldType[]>();

  // useCallback(() => {}, []);

  // useEffect(() => {
  //   console.log("Session :: ", session);
  // }, [session?.user?.accessToken]);

  const onFinish = useCallback(
    async (values: any) => {
      console.log("Values: ", values);
      try {
        const response: any = await fetch(`/api/interest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({ uuid: session.user.user.id, ...values }),
        }).then((res) => res.json());
        if (!response.success) {
          message.error(`${response.message}`);
        } else {
          message.success(`Data inserted successfully`);
        }
        console.log(" =============== ", response);
      } catch (error: any) {
        message.error(`SERVER ERROR ${error.toString()}`);
      }
    },
    [session]
  );

  return (
    <>
      <Form
        form={investmentForm}
        name="myinvestmentform"
        layout="vertical"
        initialValues={{ investments: [{ ...iniVal }] }}
        onFinish={onFinish}
        autoComplete="off"
        onValuesChange={(val, allval: any) => {
          allval.investments.forEach((element: any) => {
            element.calculated_amount = Math.round(element.amount * (element.percentage / 100));
          });
          investmentForm.setFieldValue("investments", allval.investments);
        }}
      >
        <Form.List name="investments">
          {(fields, { add, remove }) => (
            <>
              <div className="pt-4 pb-4">
                <Row justify={"space-between"} align={"middle"}>
                  <Col>
                    <h1>My Investment</h1>
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
                      <Button
                        type="primary"
                        danger
                        onClick={() => {
                          add({ ...iniVal });
                        }}
                      >
                        Add New Investment
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>

              {fields.map(({ key, name, ...restField }) => {
                // const perc = investmentForm.getFieldValue([name, "percentage"]);
                // const cal_amount = investmentForm.getFieldValue([name, "amount"]) * (perc / 100);
                return (
                  <Card
                    title={`Investment ${name + 1}`}
                    style={{ marginBottom: 20 }}
                    key={`__${name}`}
                    extra={
                      fields.length > 1 && (
                        <FaTrash
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      )
                    }
                  >
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Form.Item<FieldType[]> label="" name={[name, "uuid"]} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item<FieldType[]> label="Investment Name" name={[name, "investment_name"]} rules={[{ required: true, message: "Required" }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item<FieldType[]> label="Principal Amount" name={[name, "amount"]} rules={[{ required: true, message: "Required" }]}>
                          <Input addonAfter="₹" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item<FieldType[]> label="Investment Date" name={[name, "interest_date"]} rules={[{ required: true, message: "Required" }]}>
                          <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item<FieldType[]> label="Payment Date" name={[name, "investment_date"]} rules={[{ required: true, message: "Required" }]}>
                          <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item<FieldType[]>
                          label="Monthly Percentage"
                          name={[name, "percentage"]}
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
                      </Col>
                      <Col span={12}>
                        <Form.Item<FieldType[]> label="Payment Amount" name={[name, "calculated_amount"]}>
                          <Input readOnly={true} addonAfter="₹" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </>
          )}
        </Form.List>
        {/* <div className="pt-4"> */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {/* </div> */}
      </Form>
    </>
  );
});

export default MyInvestment;
