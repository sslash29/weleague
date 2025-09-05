"use client";

import Player from "./Player";

function TeamPlayers({ selectedPlayerId }) {
  const isActive = selectedPlayerId !== null;

  return (
    <div
      className="flex-1 h-[80vh] rounded-lg border relative"
      style={{
        backgroundImage: "url(/football-pitch.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center gap-10 justify-center w-full absolute top-2 ml-4">
        <Player isActive={isActive} />
        <Player isActive={isActive} />
      </div>
      <div className="flex items-center gap-10 justify-center w-full absolute top-35 ml-4">
        <Player isActive={isActive} />
        <Player isActive={isActive} />
      </div>

      <div className="flex items-center gap-30 justify-center w-full absolute top-70 ml-4">
        <Player isActive={isActive} />
        <Player isActive={isActive} />
        <Player isActive={isActive} />
      </div>

      <div className="flex items-center gap-10 justify-center w-full absolute top-105 ml-4">
        <Player isActive={isActive} />
        <Player isActive={isActive} />
      </div>

      {/* Bench */}
      <div className="flex flex-col absolute bottom-0 w-full bg-white/70 py-3 px-4 gap-3">
        <h3 className="text-3xl font-semibold text-center">Bench Players</h3>
        <div className="flex items-center px-4 justify-between">
          <Player label="attacker" isActive={isActive} />
          <Player label="midfield" isActive={isActive} />
          <Player label="defender" isActive={isActive} />
          <Player label="goalkeeper" isActive={isActive} />
        </div>
      </div>
    </div>
  );
}

export default TeamPlayers;
