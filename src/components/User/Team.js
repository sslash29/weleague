"use client";

import { useOptimistic, useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";

function Team({ players, studentId, team }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Optimistic state for the team
  const [optimisticTeam, addOptimisticPlayer] = useOptimistic(
    team,
    (currentTeam, { selectedPlayer, positionOnField, type }) => {
      if (!selectedPlayer) return currentTeam;

      return {
        ...currentTeam,
        mainPlayers: {
          ...currentTeam.mainPlayers,
          ...(type === "main"
            ? {
                [selectedPlayer.id]: {
                  name: selectedPlayer.full_name,
                  player_img: selectedPlayer.player_image,
                  positionOnField: Number(positionOnField),
                },
              }
            : {}),
        },
        benchPlayers: {
          ...currentTeam.benchPlayers,
          ...(type === "bench"
            ? {
                [selectedPlayer.id]: {
                  name: selectedPlayer.full_name,
                  player_img: selectedPlayer.player_image,
                  positionOnField: Number(positionOnField),
                },
              }
            : {}),
        },
      };
    }
  );

  // 👇 Pass this down to Player via TeamPlayers
  // Fixed Team component handleAddPlayer function
  const handleAddPlayer = (selectedPlayer, positionOnField, type) => {
    console.log("handleaddplayer", { selectedPlayer, positionOnField, type });
    addOptimisticPlayer({ selectedPlayer, positionOnField, type });
  };

  return (
    <div className="flex gap-3 items-center translate-y-15">
      <div className="relative">
        <h2 className=" text-4xl font-semibold absolute bottom-[765px] z-10">
          Team Name
        </h2>

        <TeamPlayerSelect
          players={players}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      </div>

      <TeamPlayers
        selectedPlayer={selectedPlayer}
        studentId={studentId}
        team={optimisticTeam} // 👈 optimistic state
        onAddPlayer={handleAddPlayer} // 👈 give to Player via TeamPlayers
      />
    </div>
  );
}

export default Team;
