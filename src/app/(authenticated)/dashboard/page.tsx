"use client";

import { Alert, Card, Col, Row } from "antd";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useState } from "react";

import { Metadata } from "next";

const metadata: Metadata = {
  title: "Dashbard Page",
};

const Dashboard: FC<{}> = memo(() => {
  const { data: session }: any = useSession();
  const [userList, setUserList] = useState<any[]>([]);
  const [errormsg, setErrorMsg] = useState<string>("");

  const getUserList = useCallback(async () => {
    try {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }).then((res) => res.json());
      if (res.code) {
        setErrorMsg(res.message);
      } else {
        setErrorMsg("");
        setUserList(res.userList);
      }
    } catch (error) {
      console.log("Error ====== ", error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      getUserList();
    }
  }, [session?.user?.accessToken]);

  return (
    <>
      {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />}
      <Row gutter={[10, 10]}>
        {userList?.map((el) => (
          <Col span={8} key={el._id}>
            <Card title={el.full_name} bordered={true}>
              {el.email}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
});

export default Dashboard;
