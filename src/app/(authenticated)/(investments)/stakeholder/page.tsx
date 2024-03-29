"use client";

import { DeleteFilled } from "@ant-design/icons";
import DrawerComponent from "@components/DrawerComponent";
import SpinnerLoader from "@components/SpinnerLoader";
import StackholderFormComponent from "@components/StackholderFormComponent";
import { faMobileScreenButton, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { getTotalInterest, getTotalPrinciple, getTotalProfit, selectAllStakeholders, selectStakeholderById } from "@redux-store/stakeholders";
import { deleteInvestorAction, getInvestorListAction } from "@redux-store/stakeholders/action";
import { AppState } from "@redux-store/store";
import { Button, Col, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { FC, Suspense, memo, useCallback, useEffect, useState } from "react";

const StakeholderPage: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();
  const investorList = useAppSelector(selectAllStakeholders) as any[];
  const total_principle = useAppSelector(getTotalPrinciple);
  const total_interest = useAppSelector(getTotalInterest);
  const total_profit = useAppSelector(getTotalProfit);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});

  const selectedData = useAppSelector((state: AppState) => selectStakeholderById(state, selectedRow._id));

  useEffect(() => {
    dispatch(getInvestorListAction(""));
  }, [dispatch]);

  const onEditHandler = useCallback(async (row: any) => {
    setIsDrawerOpen(true);
    setSelectedRow(row);
  }, []);

  const onDelete = useCallback(
    async (row: any) => {
      await dispatch(deleteInvestorAction(row));
    },
    [dispatch]
  );

  const columns = [
    {
      title: "Investor Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (txt: string) => {
        return <span className="capitalize">{txt}</span>;
      },
    },
    {
      title: "Day/Month",
      dataIndex: "interest_date",
      key: "interest_date",
      sorter: (a: any, b: any) => a.interest_date.localeCompare(b.interest_date),
      render: (txt: string) => {
        return (
          <div>
            <strong className="text-1xl text-yellow-600">{dayjs(txt).format("DD")}</strong>
            <sup className="">th</sup>
          </div>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (txt: number) => {
        return (
          <div className="flex align-middle">
            <span className="text-blue-400 pr-1">
              <FontAwesomeIcon icon={faMobileScreenButton} />
            </span>
            <span>+91 {txt}</span>
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "principle_amount",
      key: "principle_amount",
      sorter: (a: any, b: any) => a.principle_amount - b.principle_amount,
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
      title: "Base Percentage",
      dataIndex: "base_percentage",
      key: "base_percentage",
      render: (txt: string) => {
        return <span className="text-sky-600">{txt}%</span>;
      },
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      sorter: (a: any, b: any) => a.percentage - b.percentage,
      render: (txt: string) => {
        return <span className="text-sky-600">{txt}%</span>;
      },
    },

    {
      title: "Interest",
      dataIndex: "monthly_interest",
      key: "monthly_interest",
      sorter: (a: any, b: any) => a.monthly_interest - b.monthly_interest,
      render: (txt: number, row: any) => {
        return (
          <span className="text-green-200">
            {txt?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        );
      },
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      sorter: (a: any, b: any) => a.profit - b.profit,
      render: (txt: number, row: any) => {
        return (
          <span className="text-green-200">
            {txt?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "uuid",
      key: "uuid",
      render: (txt: number, row: any) => {
        return (
          <Space>
            <FontAwesomeIcon icon={faUserPen} className="text-blue-400 cursor-pointer" onClick={() => onEditHandler(row)} />
            {/* <EditFilled /> */}
            <DeleteFilled className="text-red-500 cursor-pointer" onClick={() => onDelete(row)} />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <Row justify={"space-between"} align={"middle"} className="mb-4">
            <Col className="text-white text-lg">Stakeholders</Col>
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
              >
                Add Investor
              </Button>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Suspense fallback={<SpinnerLoader loading={true} />}>
            <Table
              columns={columns}
              dataSource={investorList}
              bordered
              pagination={false}
              rowKey={"_id"}
              footer={(currentPageData) => (
                <Space className="text-right" direction="vertical">
                  <div>
                    <strong>Investor Investment</strong> : <span className="text-yellow-400">{total_principle}</span>
                  </div>
                  <div>
                    <strong>Investor Payment</strong> : <span className="text-green-200">{total_interest}</span>
                  </div>
                  <div>
                    <strong>Total Profit</strong> : <span className="text-green-200">{total_profit}</span>
                  </div>
                </Space>
              )}
            />
          </Suspense>
        </Col>
      </Row>
      <DrawerComponent
        heading={selectedData?._id ? "Edit Stakeholder" : "Add Stakeholder"}
        isOpen={isDrawerOpen}
        onCloseDrawer={() => {
          setIsDrawerOpen(false);
        }}
      >
        <StackholderFormComponent
          initialVal={{ ...selectedData, interest_date: dayjs(selectedData?.interest_date) }}
          onSuccessCallback={() => {
            setIsDrawerOpen(false);
            setSelectedRow({});
          }}
        />
      </DrawerComponent>
    </>
  );
});

export default StakeholderPage;
