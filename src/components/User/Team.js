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
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
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

      // ✅ Check if this is a position switch
      const allCurrentPlayers = [
        ...currentTeam.mainPlayers,
        ...currentTeam.benchPlayers,
      ];

      const isPositionSwitch = allCurrentPlayers.some(
        (p) => p.id === selectedPlayer.id
      );

      const currentMoney = parseFloat(currentTeam.moneyLeft);
      let playerPrice = 0;
      let newMoneyLeft = currentMoney;

      // Only deduct money for new players, not position switches
      if (!isPositionSwitch) {
        playerPrice = parseFloat(
          selectedPlayer?.calculationPrice ??
            selectedPlayer?.price ??
            selectedPlayer?.playerPrice ??
            0
        );

        if (isNaN(currentMoney) || isNaN(playerPrice)) return currentTeam;

        if (currentMoney < playerPrice) {
          return currentTeam;
        }

        newMoneyLeft = (currentMoney - playerPrice).toFixed(2);
      }

      const newPlayer = {
        ...selectedPlayer,
        positionOnField: Number(positionOnField),
        // Apply half points if player is being added to bench
        point_this_week:
          type?.trim() === "bench"
            ? Math.floor((selectedPlayer.point_this_week || 0) / 2)
            : selectedPlayer.point_this_week,
      };

      if (type?.trim() === "main") {
        return {
          ...currentTeam,
          moneyLeft: newMoneyLeft,
          mainPlayers: [
            ...currentTeam.mainPlayers.filter(
              (p) => p.positionOnField !== Number(positionOnField)
            ),
            newPlayer,
          ],
          // Remove player from bench if switching from bench to main
          benchPlayers: currentTeam.benchPlayers.filter(
            (p) => p.id !== selectedPlayer.id
          ),
        };
      }

      if (type?.trim() === "bench") {
        return {
          ...currentTeam,
          moneyLeft: newMoneyLeft,
          benchPlayers: [
            ...currentTeam.benchPlayers.filter(
              (p) => p.positionOnField !== Number(positionOnField)
            ),
            newPlayer,
          ],
          // Remove player from main if switching from main to bench
          mainPlayers: currentTeam.mainPlayers.filter(
            (p) => p.id !== selectedPlayer.id
          ),
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

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .trim();

  const handleAddPlayer = (
    selectedPlayerArg,
    positionOnField,
    type,
    positionLabel,
    hasValidationError = false,
    serverErrorMessage = null
  ) => {
    if (serverErrorMessage) {
      setErrorMsg(`Error: ${serverErrorMessage}`);
      return;
    }

    const sel = selectedPlayerArg;
    if (!sel) return;

    const selectedPos = normalize(
      sel.position ?? sel.pos ?? sel.position_label ?? ""
    );
    const targetPos = normalize(positionLabel ?? "");

    if (selectedPos && targetPos && selectedPos !== targetPos) {
      setErrorMsg(
        `Error: Selected player's position (${
          sel.position ?? sel.pos
        }) does not match target position (${positionLabel})`
      );
      return;
    }

    if (hasValidationError) {
      setErrorMsg("Error: Validation failed while adding player.");
      return;
    }

    setErrorMsg(null);
    startTransition(() => {
      addOptimisticPlayer({ selectedPlayer: sel, positionOnField, type });
    });
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
        {/* Left Team Name */}
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

      <div className="relative flex-1">
        {/* Power-Up Buttons */}
        <div className="absolute bottom-[765px] right-0 z-10 gap-3 flex items-center">
          <button onClick={() => setSelectedPowerUp("triple-captain")}>
            Triple Captain
          </button>
          <button>Bench Boost</button>
          <button>Free Hit</button>
        </div>

        <TeamPlayers
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          team={optimisticTeam}
          onAddPlayer={handleAddPlayer}
          selectedPowerUp={selectedPowerUp}
        />
      </div>

      {errorMsg && <Notification errorMsg={errorMsg} />}
    </div>
  );
}

export default Team;
