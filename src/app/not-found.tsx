import { Result } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  return (
    <div className="">
      <Result title="Page Not Found!" extra={<Link href="/dashboard">Go Home</Link>} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default NotFoundPage;
