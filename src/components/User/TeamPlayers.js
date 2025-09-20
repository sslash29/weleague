"use client";
import Player from "./Player";

// ✅ Updated helper function to work with arrays
function findPlayerByPosition(playersArray, position) {
  if (!Array.isArray(playersArray)) {
    ("a nullable value is returned");
    return null;
  }
  return playersArray.find((p) => p.positionOnField === position);
}

function TeamPlayers({
  selectedPlayer,
  studentId,
  team,
  onAddPlayer,
  selectedPowerUp,
  setSelectedPowerUp,
}) {
  const selectedPos = selectedPlayer?.position?.toLowerCase();
  console.log(team);
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
          isActive={selectedPos === "goalkeeper" || selectedPowerUp}
          label="goalkeeper"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 1)}
          onAddPlayer={onAddPlayer}
          selectedPowerUp={selectedPowerUp}
          team={team}
          setSelectedPowerUp={setSelectedPowerUp}
        />
      </div>

      {/* Defenders */}
      <div className="flex items-center gap-10 justify-center w-full absolute top-35 ml-4">
        <Player
          type="main"
          setSelectedPowerUp={setSelectedPowerUp}
          team={team}
          positionOnField={2}
          isActive={selectedPos === "defender" || selectedPowerUp}
          label="defender"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 2)}
          onAddPlayer={onAddPlayer}
          selectedPowerUp={selectedPowerUp}
        />
        <Player
          type="main"
          positionOnField={3}
          isActive={selectedPos === "defender" || selectedPowerUp}
          setSelectedPowerUp={setSelectedPowerUp}
          label="defender"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          team={team}
          playerData={findPlayerByPosition(team.mainPlayers, 3)}
          onAddPlayer={onAddPlayer}
          selectedPowerUp={selectedPowerUp}
        />
      </div>

      {/* Midfielders */}
      <div className="flex items-center gap-30 justify-center w-full absolute top-70 ml-4">
        <Player
          type="main"
          positionOnField={4}
          setSelectedPowerUp={setSelectedPowerUp}
          isActive={selectedPos === "midfield" || selectedPowerUp}
          label="midfield"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 4)}
          onAddPlayer={onAddPlayer}
          team={team}
          selectedPowerUp={selectedPowerUp}
        />
        <Player
          type="main"
          positionOnField={5}
          team={team}
          isActive={selectedPos === "midfield" || selectedPowerUp}
          label="midfield"
          setSelectedPowerUp={setSelectedPowerUp}
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 5)}
          onAddPlayer={onAddPlayer}
          selectedPowerUp={selectedPowerUp}
        />
        <Player
          team={team}
          type="main"
          positionOnField={6}
          isActive={selectedPos === "midfield" || selectedPowerUp}
          label="midfield"
          setSelectedPowerUp={setSelectedPowerUp}
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 6)}
          onAddPlayer={onAddPlayer}
          selectedPowerUp={selectedPowerUp}
        />
      </div>

      {/* Attackers */}
      <div className="flex items-center gap-10 justify-center w-full absolute top-105 ml-4">
        <Player
          type="main"
          positionOnField={7}
          isActive={selectedPos === "attacker" || selectedPowerUp}
          label="attacker"
          selectedPlayer={selectedPlayer}
          setSelectedPowerUp={setSelectedPowerUp}
          studentId={studentId}
          team={team}
          playerData={findPlayerByPosition(team.mainPlayers, 7)}
          selectedPowerUp={selectedPowerUp}
          onAddPlayer={onAddPlayer}
        />
        <Player
          type="main"
          positionOnField={8}
          isActive={selectedPos === "attacker" || selectedPowerUp}
          label="attacker"
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          playerData={findPlayerByPosition(team.mainPlayers, 8)}
          setSelectedPowerUp={setSelectedPowerUp}
          onAddPlayer={onAddPlayer}
          team={team}
          selectedPowerUp={selectedPowerUp}
        />
      </div>

      {/* Bench */}
      <div className="flex flex-col absolute bottom-0 w-full bg-white/70 py-3 px-4 gap-3">
        <h3 className="text-3xl font-semibold text-center">Bench Players</h3>
        <div className="flex items-center px-4 justify-between">
          <Player
            type="bench"
            setSelectedPowerUp={setSelectedPowerUp}
            positionOnField={9}
            isActive={selectedPos === "attacker" || selectedPowerUp}
            label="attacker"
            selectedPlayer={selectedPlayer}
            team={team}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 9)}
            onAddPlayer={onAddPlayer}
            selectedPowerUp={selectedPowerUp}
          />
          <Player
            type="bench"
            positionOnField={10}
            isActive={selectedPos === "midfield" || selectedPowerUp}
            setSelectedPowerUp={setSelectedPowerUp}
            label="midfield"
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            team={team}
            playerData={findPlayerByPosition(team.benchPlayers, 10)}
            onAddPlayer={onAddPlayer}
            selectedPowerUp={selectedPowerUp}
          />
          <Player
            type="bench"
            positionOnField={11}
            isActive={selectedPos === "defender" || selectedPowerUp}
            label="defender"
            setSelectedPowerUp={setSelectedPowerUp}
            selectedPlayer={selectedPlayer}
            team={team}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 11)}
            onAddPlayer={onAddPlayer}
            selectedPowerUp={selectedPowerUp}
          />
          <Player
            type="bench"
            positionOnField={12}
            isActive={selectedPos === "goalkeeper" || selectedPowerUp}
            label="goalkeeper"
            setSelectedPowerUp={setSelectedPowerUp}
            selectedPlayer={selectedPlayer}
            studentId={studentId}
            playerData={findPlayerByPosition(team.benchPlayers, 12)}
            team={team}
            onAddPlayer={onAddPlayer}
            selectedPowerUp={selectedPowerUp}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamPlayers;
