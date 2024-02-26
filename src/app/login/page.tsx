import LoginComponent from "@components/LoginComponent";

type PageProps = {
  searchParams: { error?: string };
};

export default function LoginPage({ searchParams }: PageProps) {
  return <LoginComponent />;
}
