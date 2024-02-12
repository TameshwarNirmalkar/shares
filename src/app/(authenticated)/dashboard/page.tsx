"use client";

import { Alert, Card, Col, Row } from "antd";
import { useSession } from "next-auth/react";
import { FC, memo, useCallback, useEffect, useState } from "react";

import { Metadata } from "next";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "Dashbard Page",
};

const Dashboard: FC<{}> = memo(() => {
  const { data: session }: any = useSession();
  const { replace } = useRouter();
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
        {/* {userList?.map((el) => (
          <Col span={8} key={el._id}>
            <Card title={el.full_name} bordered={true}>
              {el.email}
            </Card>
          </Col>
        ))} */}
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
