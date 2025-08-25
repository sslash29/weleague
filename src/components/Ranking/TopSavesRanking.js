"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function TopSavesRanking({ playerData }) {
  const router = useRouter();

  function handlePlayerClick(player) {
    router.push(`/player/${player.id}`);
  }

  // ✅ Extract saves count (normal + penalty)
  const playersWithSaves = useMemo(() => {
    return (playerData || []).map((p) => {
      const normal = p.weekly_data?.saves?.normalSaves || 0;
      const penalty = p.weekly_data?.saves?.penaltySaves || 0;
      return {
        ...p,
        saves: normal + penalty,
      };
    });
  }, [playerData]);

  // ✅ Sort by saves
  const sortedPlayers = useMemo(() => {
    return [...playersWithSaves].sort(
      (a, b) => (b.saves || 0) - (a.saves || 0)
    );
  }, [playersWithSaves]);

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Saves Ranking</h2>
        <span className="text-2xl text-center">Saves</span>
        <span className="text-2xl text-center">Team</span>
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

            <p className="text-xl text-center">{player.saves}</p>
            <p className="text-xl text-center">{player.team?.name}</p>
            <p className="text-xl text-center">{player.age}</p>
            <p
              className="text-4xl text-center"
              style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
            >
              {index + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopSavesRanking;
