"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function TopDefenderRanking({ playerData }) {
  const router = useRouter();

  function handlePlayerClick(player) {
    router.push(`/player/${player.id}`);
  }

  // ✅ Extract defence = interception + clearance + shotBlock
  const playersWithDefence = useMemo(() => {
    return (playerData || []).map((p) => {
      let parsed;
      try {
        parsed =
          typeof p.weekly_data === "string"
            ? JSON.parse(p.weekly_data)
            : p.weekly_data;
      } catch (e) {
        parsed = {};
      }

      const interception = parsed?.tackles?.interception || 0;
      const clearance = parsed?.tackles?.clearance || 0;
      const shotBlock = parsed?.tackles?.shotBlock || 0;

      return {
        ...p,
        defence: interception + clearance + shotBlock,
      };
    });
  }, [playerData]);

  // ✅ Sort by defence
  const sortedPlayers = useMemo(() => {
    return [...playersWithDefence].sort(
      (a, b) => (b.defence || 0) - (a.defence || 0)
    );
  }, [playersWithDefence]);

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Defender Ranking</h2>
        <span className="text-2xl text-center">Defence</span>
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

            <p className="text-xl text-center">{player.defence}</p>
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

export default TopDefenderRanking;
