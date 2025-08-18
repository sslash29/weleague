import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col items-center justify center h-dvh relative">
      <Link href="/admin" className="text-3xl font-bold">
        Go To Admin
      </Link>
      <Link href="/moderator" className="text-3xl font-bold">
        Go To Moderators
      </Link>
      <Link href="/user" className="text-3xl font-bold">
        Go To User
      </Link>
    </div>
  );
}

export default page;
