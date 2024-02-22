"use client";

import { Col, Row } from "antd";
import { FC, memo } from "react";

import { Metadata } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "My Profile",
};

const MyProfile: FC<{}> = memo(() => {
  const { push } = useRouter();
  // const [errormsg, setErrorMsg] = useState<string>("");

  return (
    <>
      <Head>
        <title>My Profile</title>
      </Head>
      <Row gutter={[10, 10]}>
        <Col span={8}>My Profile</Col>
        <Col span={16}>Items</Col>
      </Row>
    </>
  );
});

export default MyProfile;
