import RegisterComponent from "@components/RegisterComponent";

type PageProps = {
  searchParams: { error?: string };
};

export default function RegisterPage({ searchParams }: PageProps) {
  return <RegisterComponent />;
}
