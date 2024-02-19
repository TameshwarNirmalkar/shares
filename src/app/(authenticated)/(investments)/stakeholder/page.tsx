"use client";

import DrawerComponent from "@components/DrawerComponent";
import StackholderFormComponent from "@components/StackholderFormComponent";
import { Button, Col, Row, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { PiPhoneCallDuotone } from "react-icons/pi";

const StakeholderPage: FC<{}> = memo(() => {
  const { data: session }: any = useSession();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [investorList, setInvestorList] = useState<any[]>([]);
  const [apiCallState, setApiCallState] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});

  useEffect(() => {
    const getInvestmentList = async () => {
      const response: any = await fetch(`/api/investors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }).then((res) => res.json());
      console.log("REs: ", response);
      if (response.code) {
        message.error("Invalid Session, Please login again");
      } else {
        setInvestorList(response?.investorList);
      }
    };
    getInvestmentList();
  }, [session?.user?.accessToken, apiCallState]);

  const totalInvestment = useMemo(() => {
    return {
      totalPrinciple: investorList
        ?.reduce((acc, ite) => acc + ite.principle_amount, 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
        }),
      totalInterest: investorList
        ?.reduce((acc, ite) => acc + ite.principle_amount * (ite.percentage / 100), 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
        }),
    };
  }, [investorList]);

  const onEditHandler = useCallback(async (row: any) => {
    setIsDrawerOpen(true);
    setSelectedRow(row);
  }, []);

  const onDelete = useCallback(async (row: any) => {
    const response: any = await fetch(`/api/investors`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify({ id: row._id }),
    }).then((res) => res.json());
    setApiCallState((prev) => !prev);
  }, []);

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
            <strong className="text-1xl text-red-600">{dayjs(txt).format("DD")}</strong>
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
            <span className="text-blue-600 pr-1">
              <PiPhoneCallDuotone fontSize={20} />
            </span>
            <span>{txt}</span>
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
        return <span className="text-red-600">{txt}%</span>;
      },
    },
    {
      title: "Monthly Interest",
      dataIndex: "calculated_amount",
      key: "calculated_amount",
      render: (txt: number, row: any) => {
        const mit = Math.round(row.principle_amount * (row.percentage / 100));
        return (
          <span className="text-green-600">
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
            <LuFileEdit fontSize={20} className="text-blue-400 cursor-pointer" onClick={() => onEditHandler(row)} />
            <MdDelete fontSize={20} className="text-red-700 cursor-pointer" onClick={() => onDelete(row)} />
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
            <Col>Header</Col>
            <Col>
              <Button
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
          <>
            <Table
              columns={columns}
              dataSource={investorList}
              bordered
              rowKey={"_id"}
              footer={(currentPageData) => (
                <Space className="text-right">
                  <div>
                    <strong>Investor Investment</strong> : <span className="text-green-600">{totalInvestment.totalPrinciple}</span>
                  </div>
                  <div>
                    <strong>Investor Payment</strong> : <span className="text-green-600">{totalInvestment.totalInterest}</span>
                  </div>
                </Space>
              )}
            />
          </>
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
          initialVal={{ ...selectedRow, interest_date: dayjs(selectedRow.interest_date) }}
          onSuccessCallback={() => {
            setIsDrawerOpen(false);
            setApiCallState((prev) => !prev);
            setSelectedRow({});
          }}
        />
      </DrawerComponent>
    </>
  );
});

export default StakeholderPage;
