import LoginComponent from "@components/LoginComponent";

type PageProps = {
  searchParams: { error?: string };
};

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <div className="h-screen items-center grid justify-items-center">
      <LoginComponent />
    </div>
  );
}
