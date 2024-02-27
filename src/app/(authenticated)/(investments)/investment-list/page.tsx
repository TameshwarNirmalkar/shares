"use client";

import SpinnerLoader from "@components/SpinnerLoader";
import { getInvestmentsCollectionAction } from "@redux-store/investments-list/action";
import {
  consolidateState,
  isLoading,
  myClientInvestmentListState,
  myClientTotalInvestmentState,
  myInvestmentListState,
  myTotalInvestmentState,
  profitFromClientState,
} from "@redux-store/investments-list/memonised-investment-list";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { Alert, Col, Row, Space, Table } from "antd";
import { FC, memo, useEffect } from "react";

const columns = [
  {
    title: "Exchanger",
    dataIndex: "investment_name",
    key: "investment_name",
    render: (txt: string) => {
      return <span className="capitalize">{txt}</span>;
    },
  },
  // {
  //   title: "Date of Investment",
  //   dataIndex: "investment_date",
  //   key: "investment_date",
  //   render: (txt: string) => {
  //     return <span>{dayjs(txt).format("DD")} of every month.</span>;
  //   },
  // },
  {
    title: "Principle",
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
  {
    title: "Percentage",
    dataIndex: "percentage",
    key: "percentage",
    sorter: (a: any, b: any) => a.percentage - b.percentage,
    render: (txt: string) => {
      return <span className="text-sky-600">{txt} %</span>;
    },
  },
  {
    title: "Monthly Interest",
    dataIndex: "calculated_amount",
    key: "calculated_amount",
    sorter: (a: any, b: any) => a.calculated_amount - b.calculated_amount,
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
];

const columnClient = [
  {
    title: "Investor",
    dataIndex: "full_name",
    key: "full_name",
    render: (txt: string) => {
      return <span className="capitalize">{txt}</span>;
    },
  },
  // {
  //   title: "Date of Investment",
  //   dataIndex: "investment_date",
  //   key: "investment_date",
  //   render: (txt: string) => {
  //     return <span>{dayjs(txt).format("DD")} of every month.</span>;
  //   },
  // },
  {
    title: "Principle",
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
    title: "Percentage",
    dataIndex: "percentage",
    key: "percentage",
    sorter: (a: any, b: any) => a.percentage - b.percentage,
    render: (txt: string) => {
      return <span className="text-sky-600">{txt} %</span>;
    },
  },
  {
    title: "Monthly Interest",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (txt: number, row: any) => {
      return (
        <span className="text-green-200">
          {((row.principle_amount * row.percentage) / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </span>
      );
    },
  },
];

const InvestmentListPage: FC<{}> = memo(() => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(isLoading);
  const my_investment_list = useAppSelector(myInvestmentListState);
  const my_client_investment_list = useAppSelector(myClientInvestmentListState);
  const consolidate: any = useAppSelector(consolidateState);
  const my_total_investment: any = useAppSelector(myTotalInvestmentState);
  const my_client_total_investment: any = useAppSelector(myClientTotalInvestmentState);
  const profit_from_client: number = useAppSelector(profitFromClientState);

  useEffect(() => {
    dispatch(getInvestmentsCollectionAction(""));
  }, [dispatch]);

  return (
    <>
      <Row align={"middle"} gutter={[10, 0]}>
        <Col span={8}>
          <Alert
            message={<span className="text-white">Total Investment</span>}
            description={
              <span className="text-2xl text-green-200">
                {consolidate?.total_investment.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            }
            type="success"
          />
        </Col>
        <Col span={8}>
          <Alert
            message={<span className="text-yellow-100">Total Interest</span>}
            description={
              <span className="text-2xl text-amber-600">
                {consolidate?.total_interest.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            }
            type="warning"
          />
        </Col>
        <Col span={8}>
          <Alert
            message={<span className="text-yellow-100">Profit From Investor</span>}
            description={
              <span className="text-2xl text-sky-200">
                {my_client_total_investment?.total_profit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            }
            type="info"
          />
        </Col>
      </Row>
      <div>
        <h1 className="text-xl text-stone-100 p-3">My Investment</h1>
        <Table
          loading={loading}
          columns={columns}
          dataSource={my_investment_list}
          bordered
          rowKey={"_id"}
          pagination={false}
          footer={(currentPageData) => (
            <Space className="text-right" direction="vertical">
              <div>
                <strong>Total Investment</strong> :{" "}
                <span className="text-yellow-400">
                  {my_total_investment?.total_investment.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              <div>
                <strong>Total Interest</strong> :{" "}
                <span className="text-green-200">
                  {my_total_investment?.total_interest.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
            </Space>
          )}
        />
      </div>
      <div>
        <h1 className="text-xl text-stone-100 p-3">Stakeholders Investment</h1>
        <Table
          loading={loading}
          columns={columnClient}
          dataSource={my_client_investment_list}
          bordered
          pagination={false}
          rowKey={"_id"}
          footer={(currentPageData) => (
            <Space className="text-right" direction="vertical">
              <div>
                <strong>Total Investment</strong> :
                <span className="text-yellow-400">
                  {my_client_total_investment?.total_investment.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              <div>
                <strong>Total Interest</strong> :
                <span className="text-green-200">
                  {my_client_total_investment?.total_interest.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              <div>
                <strong>Total Profit</strong> :
                <span className="text-green-200">
                  {my_client_total_investment?.total_profit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
            </Space>
          )}
        />
      </div>
      <SpinnerLoader loading={loading} />
    </>
  );
});

export default InvestmentListPage;
