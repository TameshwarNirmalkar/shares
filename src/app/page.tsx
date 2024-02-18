import UserInfo from "@/components/UserInfo";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function HomePage() {
  const authSession = await getServerAuthSession();
  console.log("HomePage Session  ", authSession);

  return (
    <main className="">
      {authSession?.user && <UserInfo user={authSession?.user} />}
      {!authSession?.user && (
        <Link className="font-medium mt-2 text-blue-600 hover:underline" href="/login">
          Login ===
        </Link>
      )}
    </main>
  );
}
