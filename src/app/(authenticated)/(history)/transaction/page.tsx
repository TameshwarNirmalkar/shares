"use client";

import { App, Divider, Table } from "antd";
import { FC, memo, useCallback, useEffect } from "react";

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { selectAllTransactionHistory } from "@redux-store/transaction-history";
import { getTransactionCollectionAction, onTransactionDeleteAction } from "@redux-store/transaction-history/action";
import { loadingState } from "@redux-store/transaction-history/memonised-transaction";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";

const TransactionPage: FC<{}> = memo(() => {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();

  const allTrasHistory = useAppSelector(selectAllTransactionHistory);
  const loading = useAppSelector(loadingState);

  useEffect(() => {
    dispatch(getTransactionCollectionAction(""));
  }, []);

  const onDeleteTransaction = useCallback(
    (row: any) => {
      modal.confirm({
        title: "Delete Transaction",
        content: <>Are you sure want to delete the record.</>,
        centered: true,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          dispatch(onTransactionDeleteAction(row));
        },
      });
    },
    [dispatch]
  );

  const columnClient = [
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a: any, b: any) => a.full_name - b.full_name,
      render: (txt: string) => {
        return <span className="text-sky-600">{txt}</span>;
      },
    },
    {
      title: "Date of Investment",
      dataIndex: "interest_date",
      key: "interest_date",
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
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (txt: string, row: any) => (
        <span className="cursor-pointer" onClick={() => onDeleteTransaction(row)}>
          <FontAwesomeIcon icon={faTrashCan} color="#dc2626" />
        </span>
      ),
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
