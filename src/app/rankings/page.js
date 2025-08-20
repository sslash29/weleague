import Link from "next/link";

function page() {
  return (
    <div>
      <Link href="/rankings/team-ranking">Team Ranking</Link>
      <Link href="/rankings/player-ranking">Player Ranking</Link>
    </div>
  );
}

export default page;
