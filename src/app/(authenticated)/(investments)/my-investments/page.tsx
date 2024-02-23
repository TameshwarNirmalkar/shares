"use client";

import CalculatorComponent from "@components/Calculator";
import DrawerComponent from "@components/DrawerComponent";
import SpinnerLoader from "@components/SpinnerLoader";
import { faPenNib, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTotalInterest, getTotalPrinciple, selectAllInterests, selectInterestById } from "@redux-store/interests";
import { createInterestAction, deleteInterestAction, getInterestCollectionAction, updateInterestAction } from "@redux-store/interests/action";
import { isLoading } from "@redux-store/interests/memonised-interests";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { AppState } from "@redux-store/store";
import { Button, Col, DatePicker, Form, Input, Row, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { FC, Suspense, memo, useCallback, useEffect, useState } from "react";

type FieldType = {
  _id?: string;
  uuid: string;
  investment_name?: string;
  investment_date?: Date;
  amount: number;
  percentage: number;
  calculated_amount: number;
  interest_date: Date;
};

const MyInvestment: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();
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
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});

  const investmentList = useAppSelector(selectAllInterests);
  const loading = useAppSelector(isLoading);
  const total_principle = useAppSelector((state: AppState) => getTotalPrinciple(state));
  const total_interest = useAppSelector((state) => getTotalInterest(state));
  const memoizedRow = useAppSelector((state: AppState) => selectInterestById(state, selectedRow._id));

  const [investmentForm] = Form.useForm<FieldType[]>();

  useEffect(() => {
    dispatch(getInterestCollectionAction(""));
  }, [dispatch]);

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
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_txt: string, row: any) => (
        <Space>
          <span className="cursor-pointer" onClick={() => onUpdateInterest(row)}>
            <FontAwesomeIcon icon={faPenNib} fontSize={18} color="#0284c7" />
          </span>
          <span className="cursor-pointer" onClick={() => dispatch(deleteInterestAction(row))}>
            <FontAwesomeIcon icon={faTrash} fontSize={18} color="red" />
          </span>
        </Space>
      ),
    },
  ];

  const onUpdateInterest = useCallback((row: any) => {
    setSelectedRow({ ...row, interest_date: dayjs(row?.interest_date), investment_date: dayjs(row?.investment_date) });
    setIsDrawerOpen(true);
  }, []);

  const onFinish = useCallback(
    async (values: any) => {
      try {
        if (memoizedRow?._id) {
          await dispatch(updateInterestAction({ ...values }));
        } else {
          await dispatch(createInterestAction({ ...values }));
        }
        setIsDrawerOpen(false);
        setSelectedRow({});
      } catch (error: any) {
        message.error(`SERVER ERROR ${error.toString()}`);
      }
    },
    [dispatch, memoizedRow]
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
      <Suspense fallback={<SpinnerLoader loading={true} />}>
        <Table
          columns={columns}
          dataSource={investmentList}
          loading={loading}
          bordered
          rowKey={"_id"}
          footer={(currentPageData) => (
            <Space className="text-right">
              <div>
                <strong>Total Investment</strong> : <span className="text-green-600">{total_principle}</span>
              </div>
              <div>
                <strong>Total Interest</strong> : <span className="text-green-600">{total_interest}</span>
              </div>
            </Space>
          )}
        />
      </Suspense>

      <DrawerComponent
        heading="Investment Form"
        isOpen={isDrawerOpen}
        onCloseDrawer={() => {
          setIsDrawerOpen(false);
        }}
      >
        <Form
          form={investmentForm}
          name="myinvestmentform"
          layout="vertical"
          initialValues={{ ...iniVal, ...selectedRow }}
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(val, allval: any) => {
            if (allval.amount && allval.percentage) {
              allval.calculated_amount = Math.round(allval.amount * (allval.percentage / 100));
            }
            investmentForm.setFieldsValue({ ...allval });
          }}
        >
          <>
            <div className="pb-4">
              <Row justify={"space-between"} align={"middle"}>
                <Col></Col>
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        setShowCalculator(true);
                      }}
                    >
                      Calculator
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <div>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Form.Item<FieldType> label="" name="uuid" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item<FieldType> label="" name="_id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item<FieldType> label="Investment Name" name="investment_name" rules={[{ required: true, message: "Required" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item<FieldType> label="Principal Amount" name="amount" rules={[{ required: true, message: "Required" }]}>
                    <Input addonAfter="₹" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item<FieldType> label="Investment Date" name="interest_date" rules={[{ required: true, message: "Required" }]}>
                    <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item<FieldType> label="Payment Date" name="investment_date" rules={[{ required: true, message: "Required" }]}>
                    <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item<FieldType>
                    label="Monthly Percentage"
                    name="percentage"
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
                  <Form.Item<FieldType> label="Payment Amount" name="calculated_amount">
                    <Input readOnly={true} addonAfter="₹" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </>

          <Form.Item>
            <div>
              <Button type="primary" htmlType="submit" block danger>
                {memoizedRow?._id ? "Edit Your Investment" : "Add Your Investment"}
              </Button>
              <Button type="text" block onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
        {showCalculator && (
          <>
            <CalculatorComponent />
            <Button type="primary" block onClick={() => setShowCalculator(false)}>
              Close Calculator
            </Button>
          </>
        )}
      </DrawerComponent>
    </>
  );
});

export default MyInvestment;
