"use client";

import { Alert, Card, Col, Row } from "antd";
import { FC, memo, useState } from "react";

import { Metadata } from "next";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "Dashbard Page",
};

const Dashboard: FC<{}> = memo(() => {
  const { replace } = useRouter();
  const [errormsg, setErrorMsg] = useState<string>("");

  return (
    <>
      {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />}
      <Row gutter={[10, 10]}>
        {[
          { title: "Dashboard", rpath: "/dashboard" },
          { title: "Add Clients", rpath: "/add-clients" },
          { title: "Clients List", rpath: "/clients-list" },
          { title: "My Investments", rpath: "/my-investments" },
          { title: "Stakeholder", rpath: "/stakeholder" },
          { title: "Investment List", rpath: "/investment-list" },
          { title: "Transaction History", rpath: "/transaction-history" },
          { title: "Interest Calculator", rpath: "/interest-calculator" },
          { title: "Investment", rpath: "/investment" },
        ].map((el: any, ind: number) => (
          <Col span={8} key={ind}>
            <Card title={el.title} bordered={true} onClick={() => replace(`${el.rpath}`)} className="cursor-pointer">
              {el.rpath}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
});

export default Dashboard;
