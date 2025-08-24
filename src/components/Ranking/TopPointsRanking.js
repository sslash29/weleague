"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function TopPointsRanking({ playerData }) {
  const router = useRouter();

  function handlePlayerClick(player) {
    router.push(`/player/${player.id}`);
  }

  // ✅ Attach points directly
  const playersWithPoints = useMemo(() => {
    return (playerData || []).map((p) => ({
      ...p,
      points: p.points_all_time || 0,
    }));
  }, [playerData]);

  // ✅ Sort by points_all_time
  const sortedPlayers = useMemo(() => {
    return [...playersWithPoints].sort(
      (a, b) => (b.points || 0) - (a.points || 0)
    );
  }, [playersWithPoints]);

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Points Ranking</h2>
        <span className="text-2xl text-center">Points</span>
        <span className="text-2xl text-center">Team Name</span>
        <span className="text-2xl text-center">Age</span>
        <h2 className="text-4xl font-bold text-center">No.</h2>
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col gap-8 px-4 overflow-y-auto">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="grid grid-cols-5 items-center w-full">
            {/* Player column */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handlePlayerClick(player)}
            >
              <Image
                src={player.player_image || "/football-svgrepo-com.svg"}
                alt="Player Image"
                width={80}
                height={80}
                className="w-[80px] h-[80px] rounded-full"
              />
              <h3 className="text-3xl font-semibold">{player.full_name}</h3>
            </div>

            <p className="text-xl text-center">{player.points}</p>
            <p className="text-xl text-center">{player.team?.name}</p>
            <p className="text-xl text-center">{player.age}</p>
            <p className="text-4xl text-center">{index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPointsRanking;
