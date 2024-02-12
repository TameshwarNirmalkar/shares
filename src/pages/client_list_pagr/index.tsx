import { GetServerSideProps, NextPage } from "next";

const ClientListPage: NextPage = () => {
  return <div>Client list page</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default ClientListPage;
