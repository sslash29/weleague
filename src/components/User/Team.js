"use client";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";
import { supabase } from "@/utils/supabase/client";
import Notification from "../Notifcation";
import { applyBenchBoost, updateTeamName } from "@/services/userServices";
import { getCurrentDate } from "@/utils/helpers";

function Team({
  players,
  studentId,
  team,
  isTripleCaptainUsed: isTripleCaptainUsedProp,
  benchBoostUsed: benchBoostUsedProp,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamState, setTeamState] = useState(team);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [tempTeamName, setTempTeamName] = useState(team?.teamName || "");
  const [benchBoostUsed, setBenchBoostUsed] = useState(benchBoostUsedProp);
  const [isTripleCaptainUsed, setIsTripleCaptainUsed] = useState(
    isTripleCaptainUsedProp
  );

  const [optimisticTeam, addOptimisticPlayer] = useOptimistic(
    teamState,
    (currentTeam, action) => {
      if (action.type === "updateTeamName") {
        return { ...currentTeam, teamName: action.teamName };
      }

      const { selectedPlayer, positionOnField, type } = action;
      const allCurrentPlayers = [
        ...currentTeam.mainPlayers,
        ...currentTeam.benchPlayers,
      ];
      console.log("currentTeam");
      console.log(currentTeam);
      console.log("all current players");
      console.log(allCurrentPlayers);
      const isPositionSwitch = allCurrentPlayers.some(
        (p) => p.id === selectedPlayer.id
      );
      const playersWithTheSameTeam = allCurrentPlayers.filter(
        (teamPlayer) =>
          teamPlayer?.team_id === selectedPlayer?.team_id &&
          teamPlayer.positionOnField !== Number(positionOnField)
      );
      console.log("playerswiththesameteam");
      console.log(playersWithTheSameTeam);
      if (playersWithTheSameTeam.length >= 2) {
        setErrorMsg("can't add more than 2 players from the same team");
        return currentTeam;
      }

      const currentMoney = parseFloat(currentTeam.moneyLeft);
      let playerPrice = 0;
      let newMoneyLeft = currentMoney;

      if (!isPositionSwitch) {
        playerPrice = parseFloat(
          selectedPlayer?.calculationPrice ??
            selectedPlayer?.price ??
            selectedPlayer?.playerPrice ??
            0
        );
        if (isNaN(currentMoney) || isNaN(playerPrice)) return currentTeam;
        if (currentMoney < playerPrice) return currentTeam;
        newMoneyLeft = (currentMoney - playerPrice).toFixed(2);
      }

      const newPlayer = {
        ...selectedPlayer,
        positionOnField: Number(positionOnField),
        team_id: selectedPlayer.team_id || selectedPlayer.team?.id,
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
          mainPlayers: currentTeam.mainPlayers.filter(
            (p) => p.id !== selectedPlayer.id
          ),
        };
      }

      return currentTeam;
    }
  );

  // 🔔 Realtime subscription for power-ups
  useEffect(() => {
    const channel = supabase
      .channel("student-table-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student",
          filter: `auth_user_id=eq.${studentId}`,
        },
        (payload) => {
          const updated = payload.new;
          if (updated) {
            setBenchBoostUsed(updated.bench_boost_used);
            setIsTripleCaptainUsed(updated.triple_captain_used);
            // Only update team-related fields, don't mix student and team data
            if (updated.team) {
              setTeamState((prev) => ({
                ...prev,
                ...updated.team,
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

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

  // 🚀 Handle Bench Boost selection
  useEffect(() => {
    (async function () {
      if (selectedPowerUp === "bench-boost") {
        try {
          const { data, error } = await supabase
            .from("student")
            .select("bench_boost_used, bench_boost_month")
            .eq("auth_user_id", studentId)
            .single();

          if (error) throw error;

          const currentDate = getCurrentDate();
          const currentMonth = currentDate.split("-")[1];
          const studentMonth = data?.bench_boost_month
            ? data.bench_boost_month.split("-")[1]
            : null;

          if (data?.bench_boost_used && studentMonth === currentMonth) {
            setErrorMsg("Error: You can only Bench Boost once per month!");
            setSelectedPowerUp(null);
            return;
          }

          const boostedTeam = {
            ...teamState,
            benchPlayers: (teamState?.benchPlayers || []).map((p) => ({
              ...p,
              point_this_week: (Number(p.point_this_week) || 0) * 2,
              isBenchBoost: true,
            })),
          };

          setTeamState(boostedTeam);
          setSelectedPowerUp(null);

          const formData = new FormData();
          formData.append("currentTeam", JSON.stringify(teamState));
          formData.append("studentId", studentId);
          formData.append("currentDate", currentDate);

          await applyBenchBoost(formData);
        } catch (err) {
          console.error("❌ Bench Boost error:", err);
          setErrorMsg(
            err.message || "Error applying Bench Boost. Please try again."
          );
          setSelectedPowerUp(null);
        }
      }
    })();
  }, [selectedPowerUp, studentId, teamState]);

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
          <button
            onClick={() =>
              !isTripleCaptainUsed && setSelectedPowerUp("triple-captain")
            }
            disabled={isTripleCaptainUsed}
            className={`px-3 py-1 rounded ${
              isTripleCaptainUsed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Triple Captain
          </button>

          <button
            onClick={() => !benchBoostUsed && setSelectedPowerUp("bench-boost")}
            disabled={benchBoostUsed}
            className={`px-3 py-1 rounded ${
              benchBoostUsed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Bench Boost
          </button>
        </div>

        <TeamPlayers
          selectedPlayer={selectedPlayer}
          studentId={studentId}
          team={optimisticTeam}
          onAddPlayer={handleAddPlayer}
          selectedPowerUp={selectedPowerUp}
          setSelectedPowerUp={setSelectedPowerUp}
        />
      </div>

      {errorMsg && <Notification errorMsg={errorMsg} />}
    </div>
  );
}

export default Team;
