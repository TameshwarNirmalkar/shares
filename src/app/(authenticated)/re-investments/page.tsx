"use client";

import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { FC, memo, useCallback, useEffect, useState } from "react";

import DrawerComponent from "@components/DrawerComponent";
import SpinnerLoader from "@components/SpinnerLoader";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectAllReInvestments, selectReInvestmentById } from "@redux-store/re-investments";
import {
  createReInvestmentsAction,
  deleteReInvestmentsAction,
  getReInvestmentsCollectionAction,
  updateReInvestmentsAction,
} from "@redux-store/re-investments/action";
import { isLoading } from "@redux-store/re-investments/memonised-re-interests";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { NUMBER_WITH_DOT } from "@utility/regex-pattern";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";

interface FieldType {
  uuid: string;
  _id: number;
  interest_date: Date;
  investment_date: Date;
  initial_amount: number;
  monthly_amount: number;
  base_percentage: number;
  monthly_percentage: number;
  monthly_interest: number;
  profit: number;
}

const ReInvestmentPage: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(isLoading);
  const investmentList = useAppSelector(selectAllReInvestments);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const selectedData = useAppSelector((state) => selectReInvestmentById(state, selectedItem?._id));
  const [reinvestmentForm] = Form.useForm();

  useEffect(() => {
    dispatch(getReInvestmentsCollectionAction(""));
  }, [dispatch]);

  useEffect(() => {
    reinvestmentForm.setFieldsValue({ ...selectedData, investment_date: dayjs(selectedData?.investment_date) });
  }, [selectedData, reinvestmentForm]);

  const onFinishForm = useCallback(
    async (val: any) => {
      if (selectedData._id) {
        await dispatch(updateReInvestmentsAction(val));
      } else {
        await dispatch(createReInvestmentsAction(val));
      }
      reinvestmentForm.resetFields();
      setIsDrawerOpen(false);
    },
    [dispatch, selectedData]
  );

  const onEdit = useCallback(
    async (el: any) => {
      setSelectedItem(el);
      setIsDrawerOpen(true);
    },
    [dispatch]
  );

  const onDelete = useCallback(
    async (el: any) => {
      await dispatch(deleteReInvestmentsAction({ _id: el._id }));
    },
    [dispatch]
  );

  return (
    <>
      <Header className="bg-slate-600 rounded">
        <Row align={"middle"} justify={"space-between"}>
          <Col>Re-Investment</Col>
          <Col>
            <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
              Add Re-Investment
            </Button>
          </Col>
        </Row>
      </Header>
      <Row gutter={[10, 10]}>
        {investmentList.map((el) => (
          <Col span={8} key={el._id}>
            <h1 className="text-3xl">{dayjs(el.investment_date).format("DD-MMM-YYYY")}</h1>
            <p>
              Amount: <h3 className="text-2xl">{el.monthly_amount}</h3>
            </p>
            <p>
              Interest: <h3 className="text-2xl">{el.monthly_interest}</h3>
            </p>
            <p className="cursor-pointer text-green-400 text-2xl" onClick={() => onEdit(el)}>
              <FontAwesomeIcon icon={faEdit} />
            </p>
            <p className="cursor-pointer text-red-700 text-2xl" onClick={() => onDelete(el)}>
              <FontAwesomeIcon icon={faTrash} />
            </p>
          </Col>
        ))}
        {/* <Col span={16}>Items</Col> */}
      </Row>

      <DrawerComponent isOpen={isDrawerOpen} onCloseDrawer={() => setIsDrawerOpen(false)} heading={`${selectedData?._id ? "Edit" : "Add"} Re-Investment`}>
        <Form
          form={reinvestmentForm}
          name="reinvestmentForm"
          onFinish={onFinishForm}
          layout="vertical"
          onValuesChange={(_val: any, all_val: any) => {
            if (all_val.monthly_amount && all_val.monthly_percentage) {
              const monthInt =
                (JSON.parse(all_val.initial_amount ? all_val.initial_amount : 0) + Number(all_val.monthly_amount)) * (all_val.monthly_percentage / 100);
              reinvestmentForm.setFieldValue("monthly_interest", monthInt);
            }
          }}
        >
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Form.Item<FieldType> label="" name="uuid" hidden>
                <Input />
              </Form.Item>
              <Form.Item<FieldType> label="" name="_id" hidden>
                <Input />
              </Form.Item>
              <Form.Item<FieldType> name="investment_date" label="Investment Date" rules={[{ required: true, message: "Required" }]}>
                <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item<FieldType> name="initial_amount" label="Initial Amount" rules={[{ pattern: NUMBER_WITH_DOT, message: "Only numbers are allowed." }]}>
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                name="monthly_amount"
                label="Amount"
                rules={[
                  { required: true, message: "Required" },
                  { pattern: NUMBER_WITH_DOT, message: "Only numbers are allowed." },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType> name="monthly_percentage" label="Monthly Percentage" rules={[{ required: true, message: "Required" }]}>
                <Input />
              </Form.Item>
              <Form.Item<FieldType> name="monthly_interest" label="Monthly Interest">
                <Input readOnly />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item<FieldType> name="interest_date" label="Payment Date" rules={[{ required: true, message: "Required" }]}>
                <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item<FieldType> name="profit" label="Profit">
                <Input readOnly />
              </Form.Item>
            </Col> */}
          </Row>

          <div className="grid grid-cols-1 gap-2">
            <Button block type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {selectedData?._id ? "Update" : "Add"} Re-Investment
            </Button>
            <Button block type="primary" danger onClick={() => setIsDrawerOpen(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </Form>
      </DrawerComponent>
      <SpinnerLoader loading={loading} />
    </>
  );
});

export default ReInvestmentPage;
