"use client";

import { toNumber } from "@/utils/toNumber";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function TopAssistRanking({ playerData }) {
  const router = useRouter();

  // ✅ Extract assists only
  function extractAssists(weeklyDataPoints) {
    if (!weeklyDataPoints) return 0;

    let parsed;
    try {
      parsed =
        typeof weeklyDataPoints === "string"
          ? JSON.parse(weeklyDataPoints)
          : weeklyDataPoints;
    } catch (e) {
      console.error("Invalid weekly_data_points format:", e);
      return 0;
    }

    // Normalize to array of weeks
    const weeks = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object"
      ? Object.values(parsed)
      : [];

    let totalAssists = 0;

    weeks.forEach((week) => {
      try {
        if (
          !week ||
          (typeof week === "object" && Object.keys(week).length === 0)
        )
          return;

        let data;
        if (week && typeof week === "object") {
          if (week.data) {
            data = week.data;
          } else {
            const firstKey = Object.keys(week)[0];
            const maybeGW = firstKey ? week[firstKey] : undefined;
            if (maybeGW && typeof maybeGW === "object" && maybeGW.data) {
              data = maybeGW.data;
            }
          }
        }

        if (!data || typeof data !== "object") return;

        // ✅ Assists (just add them up)
        totalAssists += toNumber(data.assists || 0);
      } catch (err) {
        console.warn("Skipping malformed weekly entry:", err);
      }
    });

    return totalAssists;
  }

  function handlePlayerClick(player) {
    router.push(`/player/${player.id}`);
  }

  // ✅ Players with only assists
  const playersWithAssists = useMemo(() => {
    return (playerData || []).map((p) => ({
      ...p,
      assists: extractAssists(p.weekly_data_points),
    }));
  }, [playerData]);

  // ✅ Sort by assists only
  const sortedPlayers = useMemo(() => {
    return [...playersWithAssists].sort(
      (a, b) => (b.assists || 0) - (a.assists || 0)
    );
  }, [playersWithAssists]);

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Assist Ranking</h2>
        <span className="text-2xl text-center">Assists</span>
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

            <p className="text-xl text-center">{player.assists}</p>
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

export default TopAssistRanking;
