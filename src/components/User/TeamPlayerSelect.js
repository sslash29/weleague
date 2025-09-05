"use client";

import { useState } from "react";
import Image from "next/image";

function TeamPlayerSelect({ players = [] }) {
  const [search, setSearch] = useState("");

  // Filter players directly (React 19 handles re-render perf)
  const filteredPlayers = players.filter(
    (p) =>
      p?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p?.team?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p?.position?.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to truncate names
  const truncateName = (name, maxLength = 10) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  return (
    <div className="relative border h-[80vh] rounded-lg  flex flex-col w-[570px]">
      {/* Header */}
      <div className="grid grid-cols-4 bg-[#F2F2F2] rounded-lg mb-3 px-2 pr-0 py-3 items-center">
        <h2 className="text-3xl font-bold mr-10">Players</h2>
        <span className="text-xl text-center font-semibold">Team</span>
        <span className="text-xl text-center font-semibold">Position</span>
        <h2 className="text-xl font-semibold text-center">Value</h2>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center px-2 pr-15 mb-4">
        <div className="flex items-center w-fit text-lg">
          <input
            placeholder="Search for player..."
            className="border-b p-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Image
            src="/Search.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="-translate-x-6"
          />
        </div>
        <Image src="/Filter2.svg" alt="Filter Icon" width={20} height={20} />
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col gap-8 px-2 pr-0 overflow-y-auto">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <div
              key={player.id || index}
              className="grid grid-cols-4 items-center w-full"
            >
              {/* Player column */}
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src={
                    typeof player.player_image === "string"
                      ? player.player_image
                      : "/football-svgrepo-com.svg"
                  }
                  alt="Player Image"
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] rounded-full"
                />
                <h3 className="text-xl font-semibold">
                  {truncateName(player.full_name)}
                </h3>
              </div>

              <p className="text-lg text-center">
                {player.team?.name || "No Team"}
              </p>
              <p className="text-lg text-center">{player.position}</p>
              <p className="text-lg text-center font-bold">{player.price}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No players found
          </p>
        )}
      </div>
    </div>
  );
}

export default TeamPlayerSelect;
