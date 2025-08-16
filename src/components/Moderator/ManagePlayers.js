import Link from "next/link";
import PlayerDisplay from "./PlayerDisplay";

function ManagePlayers({ players }) {
  console.log(players);
  return (
    <div className="border p-3 mt-5 h-[78vh] flex gap-5 relative ">
      {players.length === 0 ? (
        <li>No players found</li>
      ) : (
        players.map((player) => (
          <div key={player.id}>
            <PlayerDisplay player={player} />
          </div>
        ))
      )}
      <Link
        href="/moderator/create-player"
        className="absolute bottom-5 right-3 border px-3 py-1 font-semibold cursor-pointer transition-all hover:scale-95 text-lg rounded-full z-10"
      >
        Create Player
      </Link>
    </div>
  );
}

export default ManagePlayers;
