"use client";

import Player from "./Player";

// ✅ helper function to get player by position
function findPlayerByPosition(players, position) {
  return Object.values(players).find((p) => p.positionOnField === position);
}

function TeamPlayers({ selectedPlayer, studentId, team, onAddPlayer }) {
  const selectedPos = selectedPlayer?.position?.toLowerCase();

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
          playerData={findPlayerByPosition(team.mainPlayers, 1)}
          onAddPlayer={onAddPlayer}
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
          playerData={findPlayerByPosition(team.mainPlayers, 2)}
          onAddPlayer={onAddPlayer}
        />
        <Player
          type="main"
          positionOnField={3}
          isActive={selectedPos === "defender"}
          label="defender"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 3)}
          onAddPlayer={onAddPlayer}
        />
      </div>

      {/* Midfielders */}
      <div className="flex items-center gap-30 justify-center w-full absolute top-70 ml-4">
        <Player
          type="main"
          positionOnField={4}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 4)}
          onAddPlayer={onAddPlayer}
        />
        <Player
          type="main"
          positionOnField={5}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 5)}
          onAddPlayer={onAddPlayer}
        />
        <Player
          type="main"
          positionOnField={6}
          isActive={selectedPos === "midfield"}
          label="midfield"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 6)}
          onAddPlayer={onAddPlayer}
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
          playerData={findPlayerByPosition(team.mainPlayers, 7)}
          onAddPlayer={onAddPlayer}
        />
        <Player
          type="main"
          positionOnField={8}
          isActive={selectedPos === "attacker"}
          label="attacker"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 8)}
          onAddPlayer={onAddPlayer}
        />
      </div>

      {/* Bench */}
      <div className="flex flex-col absolute bottom-0 w-full bg-white/70 py-3 px-4 gap-3">
        <h3 className="text-3xl font-semibold text-center">Bench Players</h3>
        <div className="flex items-center px-4 justify-between">
          <Player
            type="bench"
            positionOnField={9}
            isActive={selectedPos === "attacker"}
            label="attacker"
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 9)}
            onAddPlayer={onAddPlayer}
          />
          <Player
            type="bench"
            positionOnField={10}
            isActive={selectedPos === "midfield"}
            label="midfield"
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 10)}
            onAddPlayer={onAddPlayer}
          />
          <Player
            type="bench"
            positionOnField={11}
            isActive={selectedPos === "defender"}
            label="defender"
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 11)}
            onAddPlayer={onAddPlayer}
          />
          <Player
            type="bench"
            positionOnField={12}
            isActive={selectedPos === "goalkeeper"}
            label="goalkeeper"
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 12)}
            onAddPlayer={onAddPlayer}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamPlayers;
