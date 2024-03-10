"use client";

import { Button, Card, Col, Divider, Row } from "antd";
import { FC, memo } from "react";

import CalculatorComponent from "@components/Calculator";
import SpinnerLoader from "@components/SpinnerLoader";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

const InterestCalculatorPage: FC<{}> = memo(() => {
  const { push } = useRouter();

  return (
    <>
      <Header className="bg-slate-600 rounded">
        <Row align={"middle"} justify={"space-between"}>
          <Col>Calculator</Col>
          <Col>
            <Button type="primary" onClick={() => push("/master-investment")}>
              Add Investment
            </Button>
          </Col>
        </Row>
      </Header>

      <Divider orientation="left">Interest Calculator</Divider>

      <Card className="w-1/2" bordered={false}>
        <CalculatorComponent />
      </Card>

      <SpinnerLoader loading={false} />
    </>
  );
});

export default InterestCalculatorPage;
