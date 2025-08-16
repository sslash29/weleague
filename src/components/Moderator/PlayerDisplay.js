"use client";

import Image from "next/image";

function PlayerDisplay({ player }) {
  if (!player) return null;
  return (
    <div className="flex flex-col border p-3 w-[calc(1260px/3)] gap-10 rounded-lg ">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-1 items-center">
          <Image
            src={player?.player_image || "/football-svgrepo-com.svg"}
            alt={player?.full_name ? `${player.full_name} photo` : "player-img"}
            width={80}
            height={80}
            className="rounded-full w-[80px] h-[80px] object-cover"
          />
          <h4 className="text-2xl font-semibold">{player.full_name}</h4>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl">Team</span>
          <Image
            src={player?.teamImg || "/football-svgrepo-com.svg"}
            alt={player?.team_name ? `${player.team_name} logo` : "team-img"}
            width={45}
            height={45}
            className="rounded-full w-[45px] h-[45px] object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg">class: {player.class || "2/2"}</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-white rounded-md bg-[#333333] font-semibold hover:bg-violet-normal-hover transition-all cursor-pointer hover:scale-90 ">
            Add Data
          </button>
          <button className="font-semibold px-4 py-2 text-white rounded-md bg-red-normal hover:bg-red-normal-hover transition-all cursor-pointer hover:scale-90">
            Delete Player
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerDisplay;
