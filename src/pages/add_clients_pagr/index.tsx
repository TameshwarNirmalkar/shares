import { GetServerSideProps, NextPage } from "next";

const AddClientPage: NextPage = () => {
  return <div>Add Client page</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default AddClientPage;
