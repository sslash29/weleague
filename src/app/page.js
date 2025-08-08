import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col items-center justify center h-dvh">
      <Link href="/admin" className="text-3xl font-bold">
        Go To Admin
      </Link>
    </div>
  );
}

export default page;
