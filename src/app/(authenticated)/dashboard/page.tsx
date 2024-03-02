"use client";

import { Card, Col, Flex, Progress, Row, Statistic } from "antd";
import { FC, memo } from "react";

import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "Dashbard Page",
};

const Dashboard: FC<{}> = memo(() => {
  const { push } = useRouter();
  // const [errormsg, setErrorMsg] = useState<string>("");

  return (
    <>
      {/* {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />} */}
      {/* <Row gutter={[10, 10]}>
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
            <Card title={el.title} bordered={true} onClick={() => push(`${el.rpath}`)} className="cursor-pointer">
              {el.rpath}
            </Card>
          </Col>
        ))}
      </Row> */}
      <Row gutter={[20, 20]} align={"middle"} className="w-3/4">
        <Col span={12}>
          <Card bordered={false}>
            <Flex gap="small" vertical>
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              <Progress percent={50} showInfo={false} />
            </Flex>
          </Card>
        </Col>
        <Col span={12}>
          <Flex gap="small" wrap="wrap">
            <Progress type="circle" percent={65} />
            <Progress type="circle" percent={70} status="exception" />
            <Progress type="circle" percent={100} />
          </Flex>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic title="Total Users" value={93} suffix="/ 100" />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic title="Profilt" value={11.28} precision={2} valueStyle={{ color: "#3f8600" }} prefix={<ArrowUpOutlined />} suffix="%" />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic title="Loss" value={1.3} precision={2} valueStyle={{ color: "#cf1322" }} prefix={<ArrowDownOutlined />} suffix="%" />
          </Card>
        </Col>
      </Row>
    </>
  );
});

export default Dashboard;
