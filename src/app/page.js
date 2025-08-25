import Link from "next/link";

function page() {
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
    </div>
  );
}

export default page;
