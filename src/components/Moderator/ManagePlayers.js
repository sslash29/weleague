"use client";
import Link from "next/link";
import PlayerDisplay from "./PlayerDisplay";
import { useOptimistic } from "react";

function ManagePlayers({ players }) {
  const [optimisticPlayerState, addOptimistic] = useOptimistic(
    players,
    (currentState, optimisticValue) => {
      return currentState.filter((player) => player.id !== optimisticValue.id);
    }
  );
  return (
    <div className="border p-3 mt-5 h-[78vh] flex flex-wrap content-start gap-x-5 gap-y-5 relative overflow-y-scroll">
      {players.length === 0 ? (
        <li className="ml-5">No players found</li>
      ) : (
        optimisticPlayerState.map((player) => (
          <div key={player.id} className="h-fit">
            <PlayerDisplay
              player={player}
              onDelete={(player) => addOptimistic(player)}
            />
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
