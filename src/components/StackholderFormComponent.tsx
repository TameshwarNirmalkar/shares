"use client";

import { selectAllMyClients } from "@redux-store/my-clients";
import { getMyClientsListAction } from "@redux-store/my-clients/action";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { createInvestorAction, updateInvestorAction } from "@redux-store/stakeholders/action";
import { NUMBER_WITH_DOT, ONLY_NUMBER } from "@utility/regex-pattern";
import { Button, Col, DatePicker, Form, Input, Row, Select, message } from "antd";
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
  base_percentage: number;
  base_interest: number;
  monthly_interest: number;
  profit: number;
  client_id: string;
};

const StackholderFormComponent: FC<{ initialVal?: any; onSuccessCallback: () => void }> = (props) => {
  const { onSuccessCallback, initialVal } = props;
  const dispatch = useAppDispatch();
  const clientList = useAppSelector(selectAllMyClients);
  const { data: session }: any = useSession();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [investorForm] = Form.useForm<FieldType>();

  const iniVal = {
    uuid: session?.user?.user?.id,
    full_name: null,
    email: null,
    phone: null,
    principle_amount: null,
    interest_date: null,
    base_percentage: null,
    base_interest: null,
    percentage: null,
    monthly_interest: null,
    profit: null,
  };

  useEffect(() => {
    if (!clientList.length) {
      dispatch(getMyClientsListAction(""));
    }
  }, [dispatch, clientList]);

  useEffect(() => {
    investorForm.resetFields();
  }, [initialVal, investorForm]);

  const onFinish = useCallback(
    async (values: any) => {
      try {
        setIsloading(true);
        if (initialVal._id) {
          await dispatch(updateInvestorAction({ ...initialVal, ...values }));
        } else {
          await dispatch(createInvestorAction({ ...initialVal, ...values }));
        }
        investorForm.resetFields();
        if (typeof onSuccessCallback === "function") {
          onSuccessCallback();
        }
      } catch (error: any) {
        message.error(`SERVER ERROR ${error.toString()}`);
      } finally {
        setIsloading(false);
      }
    },
    [initialVal, dispatch]
  );

  return (
    <div>
      <Form
        form={investorForm}
        name="myInvestorForm"
        layout="vertical"
        initialValues={{ ...iniVal, ...initialVal }}
        onFinish={onFinish}
        autoComplete="off"
        onValuesChange={async (val: any, allvalue: any) => {
          if (allvalue.base_percentage && allvalue.principle_amount) {
            const base_interest = allvalue.principle_amount * (allvalue.base_percentage / 100);
            investorForm.setFieldValue("base_interest", base_interest);
          }
          if (allvalue.base_percentage && allvalue.percentage && allvalue.principle_amount) {
            const base_interest = allvalue.principle_amount * (allvalue.base_percentage / 100);
            const monthly_interest = allvalue.principle_amount * (allvalue.percentage / 100);
            investorForm.setFieldValue("monthly_interest", monthly_interest);
            investorForm.setFieldValue("profit", base_interest - monthly_interest);
          }
        }}
      >
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
            <Form.Item<FieldType> label="" name="client_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Client Name" name={"full_name"} rules={[{ required: true, message: "Required" }]}>
              {/* <Input /> */}
              <Select
                loading={!clientList}
                options={clientList.map((el) => ({ label: el.full_name, value: el.full_name, option: { ...el } }))}
                placeholder="Select Client Name"
                onChange={(val: string, opt: any) => {
                  investorForm.setFieldValue("client_id", opt.option._id);
                  investorForm.setFieldValue("phone", opt.option.phone);
                }}
              />
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
                { message: "Only Number", pattern: ONLY_NUMBER },
              ]}
            >
              <Input maxLength={10} addonBefore={"+91"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType> label="Investment Date" name={"interest_date"} rules={[{ required: true, message: "Required" }]}>
              <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Amount"
              name={"principle_amount"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: ONLY_NUMBER },
              ]}
            >
              <Input addonAfter="₹" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
              label="Base Percentage"
              name={"base_percentage"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: NUMBER_WITH_DOT },
                ({ getFieldValue }) => ({
                  validator: (_rule, val): Promise<string> => {
                    const percentage = getFieldValue("percentage");
                    if (val > 15) {
                      return Promise.reject("Value should be not greter than 15");
                    } else if (percentage && +val < percentage) {
                      return Promise.reject("Value should not be lesser than monthly percentage");
                    }
                    return Promise.resolve("");
                  },
                }),
              ]}
            >
              <Input
                addonAfter="%"
                maxLength={5}
                onChange={async () => {
                  try {
                    await investorForm.validateFields();
                  } catch (error) {
                    console.log("ERROR: ", error);
                  }
                }}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="Monthly Percentage"
              name={"percentage"}
              rules={[
                { required: true, message: "Required" },
                { message: "Only Number", pattern: NUMBER_WITH_DOT },
                ({ getFieldValue }) => ({
                  validator: (_rule, val): Promise<string> => {
                    const base_percentage = getFieldValue("base_percentage");
                    if (val > 15) {
                      return Promise.reject("Value should be not greter than 15");
                    } else if (base_percentage < +val) {
                      return Promise.reject("Value should not be greater than base percentage");
                    }
                    return Promise.resolve("");
                  },
                }),
              ]}
            >
              <Input
                addonAfter="%"
                maxLength={5}
                onChange={async () => {
                  try {
                    await investorForm.validateFields();
                  } catch (error) {
                    console.log("ERROR: ", error);
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType> label="Base Interest" name={"base_interest"}>
              <Input addonAfter="₹" readOnly />
            </Form.Item>
            <Form.Item<FieldType> label="Monthly Interest" name={"monthly_interest"}>
              <Input addonAfter="₹" readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="Your Profit" name={"profit"}>
              <Input addonAfter="₹" readOnly />
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
