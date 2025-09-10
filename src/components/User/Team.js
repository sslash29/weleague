"use client";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";
import { supabase } from "@/utils/supabase/client";
import Notification from "../Notifcation";
import { updateTeamName } from "@/services/userServices";

function Team({ players, studentId, team }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamState, setTeamState] = useState(team);
  const [errorMsg, setErrorMsg] = useState(null);

  const [editingTeamName, setEditingTeamName] = useState(false);
  const [tempTeamName, setTempTeamName] = useState(team?.teamName || "");

  const [optimisticTeam, addOptimisticPlayer] = useOptimistic(
    teamState,
    (currentTeam, action) => {
      if (action.type === "updateTeamName") {
        return {
          ...currentTeam,
          teamName: action.teamName,
        };
      }

      const { selectedPlayer, positionOnField, type } = action;

      const currentMoney = parseFloat(currentTeam.moneyLeft);
      const playerPrice = parseFloat(selectedPlayer.price);

      if (currentMoney < playerPrice) return currentTeam;

      const newPlayer = {
        id: selectedPlayer.id,
        name: selectedPlayer.full_name,
        player_img: selectedPlayer.player_image,
        positionOnField: Number(positionOnField),
      };

      const newMoneyLeft = (currentMoney - playerPrice).toFixed(2);

      if (type.trim() === "main") {
        return {
          ...currentTeam,
          moneyLeft: newMoneyLeft,
          mainPlayers: [
            ...currentTeam.mainPlayers.filter(
              (p) => p.positionOnField !== Number(positionOnField)
            ),
            newPlayer,
          ],
        };
      }

      if (type.trim() === "bench") {
        return {
          ...currentTeam,
          moneyLeft: newMoneyLeft,
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
          console.log("Student table updated:", payload);
          setTeamState((prev) => ({
            ...prev,
            ...payload.new,
            ...payload.new.team,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddPlayer = (
    selectedPlayer,
    positionOnField,
    type,
    position,
    hasValidationError = false,
    serverErrorMessage = null
  ) => {
    if (hasValidationError) {
      if (serverErrorMessage) {
        setErrorMsg(`Error: ${serverErrorMessage}`);
      } else if (selectedPlayer) {
        setErrorMsg(
          `Error: Selected player's position (${selectedPlayer.position}) does not match target position (${position})`
        );
      }
      return;
    }

    if (!selectedPlayer) return;

    setErrorMsg(null);
    addOptimisticPlayer({ selectedPlayer, positionOnField, type });
  };

  const handleTeamNameCommit = () => {
    if (!tempTeamName.trim()) {
      setEditingTeamName(false);
      return;
    }

    setEditingTeamName(false);
    startTransition(async () => {
      addOptimisticPlayer({ type: "updateTeamName", teamName: tempTeamName });
      await updateTeamName(tempTeamName, studentId);
    });
  };

  return (
    <div className="flex gap-3 items-center translate-y-15 relative">
      <div className="relative">
        {editingTeamName ? (
          <input
            className="text-4xl font-semibold absolute bottom-[765px] z-10 bg-transparent border-b-2 border-gray-400 outline-none"
            value={tempTeamName}
            autoFocus
            onChange={(e) => setTempTeamName(e.target.value)}
            onBlur={handleTeamNameCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTeamNameCommit();
              if (e.key === "Escape") setEditingTeamName(false);
            }}
          />
        ) : (
          <h2
            className="text-4xl font-semibold absolute bottom-[765px] z-10 cursor-pointer"
            onDoubleClick={() => setEditingTeamName(true)}
          >
            {optimisticTeam.teamName || "Team Name"}
          </h2>
        )}

        <TeamPlayerSelect
          players={players}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          moneyLeft={optimisticTeam.moneyLeft}
        />
      </div>

      <TeamPlayers
        selectedPlayer={selectedPlayer}
        studentId={studentId}
        team={optimisticTeam}
        onAddPlayer={handleAddPlayer}
      />

      {errorMsg && <Notification errorMsg={errorMsg} />}
    </div>
  );
}

export default Team;
