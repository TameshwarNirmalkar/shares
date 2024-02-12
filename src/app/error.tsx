"use client";

import { Button, Result } from "antd";
import { GetServerSideProps, NextPage } from "next";

const ErrorPage: NextPage = () => {
  return (
    <Result
      title="Your operation has been executed"
      extra={
        <Button type="primary" key="console">
          Go Home
        </Button>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default ErrorPage;
