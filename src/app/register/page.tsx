import RegisterComponent from "@components/RegisterComponent";

type PageProps = {
  searchParams: { error?: string };
};

export default function RegisterPage({ searchParams }: PageProps) {
  return (
    <div className="h-screen items-center grid justify-items-center">
      <RegisterComponent />
    </div>
  );
}
