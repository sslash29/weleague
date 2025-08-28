import { LogOut } from "@/components/LogOut";
import { getUser } from "@/services/server/services";
import Link from "next/link";

async function page() {
  const user = await getUser();
  return (
    <div className="flex flex-col items-center justify center h-dvh relative w-full ">
      <Link href="/admin" className="text-3xl font-bold">
        Go To Admin
      </Link>
      <Link href="/moderator" className="text-3xl font-bold">
        Go To Moderators
      </Link>
      <Link href="/user" className="text-3xl font-bold">
        Go To User
      </Link>
      <Link href="/rankings" className="text-3xl font-bold">
        Go To Rankings
      </Link>
      <Link href="/auth/sign-up" className="text-3xl font-bold">
        Sign Up
      </Link>
      <Link href="/auth/log-in" className="text-3xl font-bold">
        Log in
      </Link>
      <LogOut />
      <Link href="/moderator/add-best" className="text-3xl font-bold">
        Add Best
      </Link>
      <Link href="/voting/best-goal" className="text-3xl font-bold">
        Best Goal Voting
      </Link>

      <Link href="/voting/best-assist" className="text-3xl font-bold">
        Best Assist Voting
      </Link>
    </div>
  );
}

export default page;
