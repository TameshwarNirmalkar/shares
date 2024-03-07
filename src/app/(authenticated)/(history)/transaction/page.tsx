"use client";

import { Divider, Table } from "antd";
import { FC, memo, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { selectAllTransactionHistory } from "@redux-store/transaction-history";
import { getTransactionCollectionAction } from "@redux-store/transaction-history/action";
import { selectedLoading } from "@redux-store/transaction-history/memonised-transaction";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const TransactionPage: FC<{}> = memo(() => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const allTrasHistory = useAppSelector(selectAllTransactionHistory);
  const loading = useAppSelector(selectedLoading);

  useEffect(() => {
    dispatch(getTransactionCollectionAction(""));
  }, []);

  const columnClient = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      sorter: (a: any, b: any) => a._id - b._id,
      render: (txt: string) => {
        return <span className="text-sky-600">{txt}</span>;
      },
    },
    {
      title: "Date of Investment",
      dataIndex: "investment_date",
      key: "investment_date",
      render: (txt: string) => {
        return <span>{dayjs(txt).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: any, b: any) => a.amount - b.amount,
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
  ];

  return (
    <>
      {/* <Row gutter={[20, 20]} align={"middle"} className="w-3/4">
        <Col span={12}>Left</Col>
        <Col span={12}>
          {allTrasHistory.map((el: any, id) => (
            <Flex gap="small" wrap="wrap" key={useId()}>
              {el.amount}
            </Flex>
          ))}
        </Col>
      </Row> */}
      <Header className="rounded px-4">Transaction History</Header>
      <Divider />
      <Table loading={loading} columns={columnClient} dataSource={allTrasHistory} bordered pagination={false} rowKey={"_id"} />
    </>
  );
});

export default TransactionPage;
