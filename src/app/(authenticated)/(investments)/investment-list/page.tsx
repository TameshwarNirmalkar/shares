"use client";

import { Form, Space, Table } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";

type FieldType = {
  investment_name?: string;
  investment_date?: Date;
  amount: number;
  percentage: number;
  calculated_amount: number;
  interest_date: Date;
};

const iniVal = {
  investment_name: null,
  investment_date: null,
  amount: null,
  percentage: null,
  calculated_amount: null,
  interest_date: null,
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

const InvestmentListPage: FC<{}> = memo(() => {
  const { data: session }: any = useSession();
  const [investmentList, setInvestmentList] = useState<any[]>([]);
  const [errormsg, setErrorMsg] = useState<string>("");

  const [investmentForm] = Form.useForm<FieldType[]>();

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

  useCallback(() => {}, []);

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

  const onFinish = useCallback(
    async (values: any) => {
      console.log("Values: ", values);
      // try {
      //   const response: any = await fetch(`/api/interest`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${session?.user?.accessToken}`,
      //     },
      //     body: JSON.stringify({ uuid: session.user.user.id, ...values }),
      //   }).then((res) => res.json());
      //   if (!response.success) {
      //     message.error(`${response.message}`);
      //   } else {
      //     message.success(`Data inserted successfully`);
      //   }
      //   console.log(" =============== ", response);
      // } catch (error: any) {
      //   message.error(`SERVER ERROR ${error.toString()}`);
      // }
    },
    [session]
  );

  return (
    <>
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
    </>
  );
});

export default InvestmentListPage;
