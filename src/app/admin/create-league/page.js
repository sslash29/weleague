import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col gap-10 text-xl">
      <Link href="/admin/create-league/knockout">knockout</Link>
      <Link href="/admin/create-league/group-stage">group stage</Link>
    </div>
  );
}

export default page;
