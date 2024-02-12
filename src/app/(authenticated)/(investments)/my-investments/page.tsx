"use client";

import DrawerComponent from "@/components/DrawerComponent";
import { Button, Col, DatePicker, Divider, Form, Input, Row, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
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

const columns = [
  {
    title: "Name",
    dataIndex: "investment_name",
    key: "investment_name",
    render: (txt: string) => {
      return <span className="capitalize">{txt}</span>;
    },
  },
  {
    title: "Date of Investment",
    dataIndex: "investment_date",
    key: "investment_date",
    render: (txt: string) => {
      return <span>{dayjs(txt).format("DD")} of every month.</span>;
    },
  },
  {
    title: "Principle",
    dataIndex: "amount",
    key: "amount",
    render: (txt: number) => {
      return (
        <span className="text-green-600">
          {txt.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </span>
      );
    },
  },
  {
    title: "Percentage",
    dataIndex: "percentage",
    key: "percentage",
    render: (txt: string) => {
      return <span className="text-red-600">{txt} %</span>;
    },
  },
  {
    title: "Monthly Interest",
    dataIndex: "calculated_amount",
    key: "calculated_amount",
    render: (txt: number) => {
      return (
        <span className="text-green-600">
          {txt.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </span>
      );
    },
  },
];

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

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [investorList, setInvestorList] = useState<any[]>([]);
  const [apiCallState, setApiCallState] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [investmentList, setInvestmentList] = useState<any[]>([]);

  const [investmentForm] = Form.useForm<FieldType[]>();

  useEffect(() => {
    const getInvestmentList = async () => {
      const response: any = await fetch(`/api/interest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }).then((res) => res.json());
      setInvestmentList(response?.interestList);
    };
    getInvestmentList();
  }, [session?.user?.accessToken]);

  const totalInvestment = useMemo(() => {
    return {
      totalPrinciple: investmentList
        ?.reduce((acc, ite) => acc + ite.amount, 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
        }),
      totalInterest: investmentList
        ?.reduce((acc, ite) => acc + ite.calculated_amount, 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
        }),
    };
  }, [investmentList]);

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
          setIsDrawerOpen(false);
          setApiCallState((prev) => !prev);
          setSelectedRow({});
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
                  setIsDrawerOpen(true);
                }}
              >
                Add New Investment
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={investmentList}
        bordered
        rowKey={"_id"}
        footer={(currentPageData) => (
          <Space className="text-right">
            <div>
              <strong>Total Investment</strong> : <span className="text-green-600">{totalInvestment.totalPrinciple}</span>
            </div>
            <div>
              <strong>Total Interest</strong> : <span className="text-green-600">{totalInvestment.totalInterest}</span>
            </div>
          </Space>
        )}
      />

      <DrawerComponent
        heading="Investment Form"
        isOpen={isDrawerOpen}
        onCloseDrawer={() => {
          setIsDrawerOpen(false);
        }}
      >
        {/* <StackholderFormComponent
          initialVal={{ ...selectedRow, interest_date: dayjs(selectedRow.interest_date) }}
          onSuccessCallback={() => {
            setIsDrawerOpen(false);
            setApiCallState((prev) => !prev);
            setSelectedRow({});
          }}
        /> */}
        <Form
          form={investmentForm}
          name="myinvestmentform"
          layout="vertical"
          initialValues={{ investments: [{ ...iniVal, ...selectedRow }] }}
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
                <div className="pb-4">
                  <Row justify={"space-between"} align={"middle"}>
                    <Col></Col>
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
                          onClick={async () => {
                            try {
                              await investmentForm.validateFields();
                              add({ ...iniVal });
                            } catch (error) {}
                          }}
                        >
                          Add Investment
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>

                {fields.map(({ key, name, ...restField }) => {
                  // const perc = investmentForm.getFieldValue([name, "percentage"]);
                  // const cal_amount = investmentForm.getFieldValue([name, "amount"]) * (perc / 100);
                  return (
                    <div>
                      <Row justify={"space-between"} gutter={[0, 10]}>
                        <Col>Item :: {name + 1}</Col>
                        <Col>
                          {fields.length > 1 && (
                            <FaTrash
                              className="cursor-pointer"
                              onClick={() => {
                                remove(name);
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                      <Divider />
                      <Row gutter={[30, 0]}>
                        <Col span={24}>
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
                        <Col span={24}>
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
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>
          {/* <div className="pt-4"> */}
          <Form.Item>
            <div>
              <Button type="primary" htmlType="submit" block>
                Add Investment
              </Button>
              <Button type="text" block onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </Form.Item>
          {/* </div> */}
        </Form>
      </DrawerComponent>
    </>
  );
});

export default MyInvestment;
