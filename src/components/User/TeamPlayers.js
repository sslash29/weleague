"use client";

import Player from "./Player";

function TeamPlayers({ selectedPlayer, studentId, team }) {
  const selectedPos = selectedPlayer?.position?.toLowerCase();
  console.log(team, studentId);
  return (
    <div
      className="flex-1 h-[80vh] rounded-lg border relative"
      style={{
        backgroundImage: "url(/football-pitch.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Goalkeeper */}
      <div className="flex items-center gap-10 justify-center w-full absolute top-2 ml-4">
        <Player
          type="main"
          positionOnField={1}
          isActive={selectedPos === "goalkeeper"}
          label="goalkeeper"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
        />
      </div>

      {/* Defenders */}
      <div className="flex items-center gap-10 justify-center w-full absolute top-35 ml-4">
        <Player
          type="main"
          positionOnField={2}
          isActive={selectedPos === "defender"}
          label="defender"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
        />
        <Player
          type="main"
          positionOnField={3}
          studentId={studentId}
          isActive={selectedPos === "defender"}
          label="defender"
          selectedPlayer={selectedPlayer}
        />
      </div>

      {/* Midfielders */}
      <div className="flex items-center gap-30 justify-center w-full absolute top-70 ml-4">
        <Player
          type="main"
          positionOnField={4}
          studentId={studentId}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
        />
        <Player
          type="main"
          positionOnField={5}
          studentId={studentId}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
        />
        <Player
          type="main"
          positionOnField={6}
          studentId={studentId}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
        />
      </div>

      {/* Attackers */}
      <div className="flex items-center gap-10 justify-center w-full absolute top-105 ml-4">
        <Player
          type="main"
          positionOnField={7}
          isActive={selectedPos === "attacker"}
          label="attacker"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
        />
        <Player
          type="main"
          positionOnField={8}
          isActive={selectedPos === "attacker"}
          label="attacker"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
        />
      </div>

      {/* Bench */}
      <div className="flex flex-col absolute bottom-0 w-full bg-white/70 py-3 px-4 gap-3">
        <h3 className="text-3xl font-semibold text-center">Bench Players</h3>
        <div className="flex items-center px-4 justify-between">
          <Player
            type="bench"
            positionOnField={9}
            studentId={studentId}
            isActive={selectedPos === "attacker"}
            label="attacker"
            selectedPlayer={selectedPlayer}
          />
          <Player
            type="bench"
            positionOnField={10}
            studentId={studentId}
            isActive={selectedPos === "midfield"}
            label="midfield"
            selectedPlayer={selectedPlayer}
          />
          <Player
            type="bench"
            positionOnField={11}
            studentId={studentId}
            isActive={selectedPos === "defender"}
            label="defender"
            selectedPlayer={selectedPlayer}
          />
          <Player
            type="bench"
            positionOnField={12}
            studentId={studentId}
            isActive={selectedPos === "goalkeeper"}
            label="goalkeeper"
            selectedPlayer={selectedPlayer}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamPlayers;
