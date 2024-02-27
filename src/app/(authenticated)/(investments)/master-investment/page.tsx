"use client";

import CalculatorComponent from "@components/Calculator";
import DrawerComponent from "@components/DrawerComponent";
import SpinnerLoader from "@components/SpinnerLoader";
import { faPenNib, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isLoading } from "@redux-store/interests/memonised-interests";
import { getTotalMasterInterest, getTotalMasterInvestment, selectAllMasterInvestment } from "@redux-store/master-investments";
import {
  createMasterInvestmentAction,
  deleteMasterInvestmentAction,
  getMasterInvestmentCollectionAction,
  updateMasterInvestmentAction,
} from "@redux-store/master-investments/action";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { NUMBER_WITH_DOT } from "@utility/regex-pattern";
import { Button, Col, DatePicker, Form, Input, Row, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { FC, Suspense, memo, useCallback, useEffect, useState } from "react";

type FieldType = {
  _id?: string | null;
  full_name?: string | null;
  amount: number | null;
  investment_date: string | null;
  interest_date: string | null;
  monthly_interest: number | null;
  daily_interest: number | null;
  no_of_days: number | null;
  base_percentage: number | null;
  monthly_percentage: number | null;
};

const iniVal = {
  _id: null,
  full_name: null,
  amount: null,
  investment_date: null,
  interest_date: null,
  monthly_interest: null,
  daily_interest: null,
  no_of_days: null,
  base_percentage: null,
  monthly_percentage: null,
};

const MasterInvestment: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  const investmentList = useAppSelector(selectAllMasterInvestment);
  const loading = useAppSelector(isLoading);
  const total_principle = useAppSelector(getTotalMasterInvestment);
  const total_interest = useAppSelector(getTotalMasterInterest);

  const [masterInvestmentForm] = Form.useForm<FieldType>();

  useEffect(() => {
    dispatch(getMasterInvestmentCollectionAction(""));
  }, [dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
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
          <span className="text-yellow-400">
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
      dataIndex: "monthly_percentage",
      key: "monthly_percentage",
      render: (txt: string) => {
        return <span className="text-sky-600">{txt} %</span>;
      },
    },
    {
      title: "Monthly Interest",
      dataIndex: "monthly_interest",
      key: "monthly_interest",
      render: (txt: number) => {
        return (
          <span className="text-green-200">
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
          <span className="cursor-pointer text-blue-400" onClick={() => onUpdateMasterInvestment(row)}>
            <FontAwesomeIcon icon={faPenNib} />
          </span>
          <span className="cursor-pointer text-red-700" onClick={() => onDeleteMasterInvestment(row)}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </Space>
      ),
    },
  ];

  const onUpdateMasterInvestment = useCallback(async (row: any) => {
    const fieldValues = { ...row, interest_date: dayjs(row?.interest_date), investment_date: dayjs(row?.investment_date) };
    await masterInvestmentForm.setFieldsValue(fieldValues);
    setIsDrawerOpen(true);
  }, []);

  const onDeleteMasterInvestment = useCallback(
    (row: any) => {
      dispatch(deleteMasterInvestmentAction(row));
    },
    [dispatch]
  );

  const onFinish = useCallback(
    async (values: any) => {
      try {
        if (values._id) {
          await dispatch(updateMasterInvestmentAction(values));
        } else {
          await dispatch(createMasterInvestmentAction(values));
        }
      } catch (error: any) {
        message.error(`SERVER ERROR ${error.toString()}`);
      } finally {
        setIsDrawerOpen(false);
      }
    },
    [dispatch]
  );

  return (
    <>
      <div className="pb-4">
        <Row justify={"space-between"} align={"middle"}>
          <Col className="text-white text-lg">Master Investment</Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={async () => {
                  await masterInvestmentForm.resetFields();
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
          pagination={false}
          bordered
          rowKey={"_id"}
          footer={(currentPageData) => (
            <Space className="text-right" direction="vertical">
              <div>
                <strong>Total Investment</strong> : <span className="text-yellow-400">{total_principle}</span>
              </div>
              <div>
                <strong>Total Interest</strong> : <span className="text-green-200">{total_interest}</span>
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
          form={masterInvestmentForm}
          name="mymasterInvestmentform"
          layout="vertical"
          initialValues={iniVal}
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(_val, allval: any) => {
            if (allval.amount && allval.monthly_percentage) {
              allval.monthly_interest = Math.round(allval.amount * (allval.monthly_percentage / 100));
              masterInvestmentForm.setFieldsValue(allval);
            }
          }}
        >
          <>
            <div>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Form.Item<FieldType> label="" name="_id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item<FieldType> label="Full Name" name="full_name" rules={[{ required: true, message: "Required" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item<FieldType> label="Principle Amount" name="amount" rules={[{ required: true, message: "Required" }]}>
                    <Input addonAfter="₹" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType> label="Investment Date" name="interest_date" rules={[{ required: true, message: "Required" }]}>
                    <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType> label="Payment Date" name="investment_date" rules={[{ required: true, message: "Required" }]}>
                    <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label="Monthly Percentage"
                    name="monthly_percentage"
                    rules={[
                      { required: true, message: "Required" },
                      { message: "Only Number", pattern: NUMBER_WITH_DOT },
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
                    <Input addonAfter="%" maxLength={5} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType> label="Payment Amount" name="monthly_interest">
                    <Input readOnly={true} addonAfter="₹" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </>

          <Form.Item>
            <div>
              <Button type="primary" htmlType="submit" block danger>
                {masterInvestmentForm.getFieldValue("_id") ? "Edit Your Investment" : "Add Your Investment"}
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

export default MasterInvestment;
