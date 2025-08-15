"use client";

import Link from "next/link";

function Logo() {
  return (
    <div>
      <Link href="/">
        <h2
          style={{ fontFamily: "var(--font-sharpie), sans-serif" }}
          className="text-violet-normal font-bold text-3xl"
        >
          weleague
        </h2>
      </Link>
    </div>
  );
}

export default Logo;
