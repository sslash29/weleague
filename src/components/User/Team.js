"use client";
import { useEffect, useOptimistic, useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";
import { supabase } from "@/utils/supabase/client";

function Team({ players, studentId, team }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamState, setTeamState] = useState(team);
  const [optimisticTeam, addOptimisticPlayer] = useOptimistic(
    teamState,
    (currentTeam, action) => {
      const { selectedPlayer, positionOnField, type } = action;
      const newPlayer = {
        id: selectedPlayer.id,
        name: selectedPlayer.full_name,
        player_img: selectedPlayer.player_image,
        positionOnField: Number(positionOnField),
      };

      if (type.trim("") === "main") {
        return {
          ...currentTeam,
          mainPlayers: [
            ...currentTeam.mainPlayers.filter(
              (p) => p.positionOnField !== Number(positionOnField)
            ),
            newPlayer,
          ],
        };
      }

      if (type.trim("") === "bench") {
        return {
          ...currentTeam,
          benchPlayers: [
            ...currentTeam.benchPlayers.filter(
              (p) => p.positionOnField !== Number(positionOnField)
            ),
            newPlayer,
          ],
        };
      }

      return currentTeam;
    }
  );

  useEffect(() => {
    const channel = supabase
      .channel("student-table-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student",
        },
        (payload) => {
          "Student table updated:", payload;
          setTeamState((prev) => ({
            ...prev,
            ...payload.new, // other student info if you need it
            ...payload.new.team, // merge in the actual team structure
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddPlayer = (selectedPlayer, positionOnField, type) => {
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
        team={optimisticTeam}
        onAddPlayer={handleAddPlayer}
      />
    </div>
  );
}

export default Team;
