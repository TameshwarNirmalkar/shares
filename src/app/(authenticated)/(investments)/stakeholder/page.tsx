"use client";

import { DeleteFilled } from "@ant-design/icons";
import DrawerComponent from "@components/DrawerComponent";
import SpinnerLoader from "@components/SpinnerLoader";
import StackholderFormComponent from "@components/StackholderFormComponent";
import { faMobileScreenButton, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { getTotalInterest, getTotalPrinciple, selectAllStakeholders, selectStakeholderById } from "@redux-store/stakeholders";
import { deleteInvestorAction, getInvestorListAction } from "@redux-store/stakeholders/action";
import { AppState } from "@redux-store/store";
import { Button, Col, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { FC, Suspense, memo, useCallback, useEffect, useState } from "react";

const StakeholderPage: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();
  const investorList = useAppSelector(selectAllStakeholders) as any[];
  const total_principle = useAppSelector((state: AppState) => getTotalPrinciple(state));
  const total_interest = useAppSelector((state: AppState) => getTotalInterest(state));

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  // const [investorList, setInvestorList] = useState<any[]>([]);
  // const [apiCallState, setApiCallState] = useState<boolean>(false);
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
      // setApiCallState((prev) => !prev);
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
      title: "Principle Amount",
      dataIndex: "principle_amount",
      key: "principle_amount",
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
      dataIndex: "percentage",
      key: "percentage",
      render: (txt: string) => {
        return <span className="text-sky-600">{txt}%</span>;
      },
    },
    {
      title: "Monthly Interest",
      dataIndex: "calculated_amount",
      key: "calculated_amount",
      render: (txt: number, row: any) => {
        const mit = Math.round(row.principle_amount * (row.percentage / 100));
        return (
          <span className="text-green-200">
            {mit?.toLocaleString("en-US", {
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
                </Space>
              )}
            />
          </Suspense>
        </Col>
      </Row>
      <DrawerComponent
        heading="Add Stackholder"
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
