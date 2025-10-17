"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { addPlayerToTeam, applyTripleCaptain } from "@/services/userServices";
import { startTransition } from "react";

function Player({
  label,
  isActive,
  selectedPlayer,
  studentId,
  type,
  positionOnField,
  playerData,
  onAddPlayer,
  selectedPowerUp,
  team,
  setSelectedPowerUp,
}) {
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .trim();

  async function handleClick() {
    if (!selectedPlayer) return;
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("playerType", type);
    formData.append("currentTeam", JSON.stringify(team));
    formData.append("playerData", JSON.stringify(playerData));

    // --- Triple Captain flow ---
    if (selectedPowerUp === "triple-captain") {
      const hasTripleCaptain =
        (team?.mainPlayers ?? []).some((p) => p.isTripleCaptain) ||
        (team?.benchPlayers ?? []).some((p) => p.isTripleCaptain);

      if (hasTripleCaptain) {
        onAddPlayer(
          null,
          positionOnField,
          type,
          label,
          true,
          "You can only use Triple Captain on one player per week!"
        );
        return;
      }

      const boostedPlayer = {
        ...playerData,
        point_this_week: (Number(playerData?.point_this_week) || 0) * 3,
        isTripleCaptain: true,
      };

      onAddPlayer(boostedPlayer, positionOnField, type, label);

      startTransition(async () => {
        await applyTripleCaptain(formData);
      });
      setSelectedPowerUp(null);
      return;
    }

    if (!selectedPlayer) return;

    // ✅ CHECK: Maximum 2 players from the same team
    const allTeam = [...team.mainPlayers, ...team.benchPlayers];

    const currentPlayerInPosition = allTeam.find(
      (p) => p.positionOnField === Number(positionOnField)
    );

    const isReplacingSameTeam =
      currentPlayerInPosition?.team_id === selectedPlayer?.team_id;

    const playersWithTheSameTeam = allTeam.filter(
      (teamPlayer) =>
        teamPlayer?.team_id === selectedPlayer?.team_id &&
        teamPlayer.positionOnField !== Number(positionOnField)
    );

    if (playersWithTheSameTeam.length >= 2 && !isReplacingSameTeam) {
      onAddPlayer(
        null,
        positionOnField,
        type,
        label,
        true,
        "You can't add more than 2 players from the same team!"
      );
      return;
    }

    const allPlayers = [
      ...(team?.mainPlayers ?? []),
      ...(team?.benchPlayers ?? []),
    ];

    // ✅ Check if the same player is already in the same position
    const isPlayerInSamePosition = allPlayers.some(
      (p) =>
        p.id === selectedPlayer.id &&
        p.positionOnField === Number(positionOnField)
    );

    if (isPlayerInSamePosition) {
      onAddPlayer(
        null,
        positionOnField,
        type,
        label,
        true,
        `${
          selectedPlayer.full_name || selectedPlayer.name
        } is already added in this position!`
      );
      return;
    }

    const selectedPlayerPositions = allPlayers.filter(
      (p) => p.id === selectedPlayer.id
    );

    const selectedPos = normalize(
      selectedPlayer.position ??
        selectedPlayer.pos ??
        selectedPlayer.position_label
    );
    const targetPos = normalize(label);

    if (selectedPos && targetPos && selectedPos !== targetPos) {
      onAddPlayer(
        null,
        positionOnField,
        type,
        label,
        true,
        `Selected player's position (${
          selectedPlayer.position ?? selectedPlayer.pos
        }) does not match target position (${label})`
      );
      return;
    }

    // ✅ Detect if this is a position switch (same player moved to another position)
    const isPositionSwitch = selectedPlayerPositions.length > 0;

    // ✅ calculate effective price difference
    let price;
    let playerPrice;

    if (isPositionSwitch) {
      // Same player moved — no money adjustment
      price = 0;
      playerPrice = 0;
    } else {
      // New player — adjust based on cost difference
      price =
        (Number(selectedPlayer.price ?? 0) || 0) -
        (Number(playerData?.playerPrice ?? 0) || 0);

      playerPrice = parseFloat(
        selectedPlayer?.calculationPrice ??
          selectedPlayer?.price ??
          selectedPlayer?.playerPrice ??
          0
      );
    }

    // ✅ Check funds (only for new player)
    if (!isPositionSwitch) {
      const currentMoney = parseFloat(team?.moneyLeft || 0);

      if (currentMoney < playerPrice) {
        onAddPlayer(
          null,
          positionOnField,
          type,
          label,
          true,
          `Insufficient funds! You need ${playerPrice.toFixed(
            2
          )} but only have ${currentMoney.toFixed(2)}`
        );
        return;
      }
    }

    // ✅ Always override price so reducer knows correct value
    const updatedSelectedPlayer = {
      ...selectedPlayer,
      price,
    };
    console.log("updatedSelectedPlayer");
    console.log(updatedSelectedPlayer);

    onAddPlayer(updatedSelectedPlayer, positionOnField, type, label);

    // ✅ Only call server if everything is valid
    formData.append("studentId", studentId);
    formData.append("playerId", selectedPlayer?.id);
    formData.append("type", type);
    formData.append(
      "selectedPlayer",
      JSON.stringify(updatedSelectedPlayer ?? selectedPlayer)
    );
    formData.append("positionOnField", positionOnField);
    formData.append("otherPositions", JSON.stringify(selectedPlayerPositions));

    const data = await addPlayerToTeam(formData);
    if (data?.success === false) {
      onAddPlayer(null, positionOnField, type, label, true, data.message);
      return;
    }
  }

  return (
    <motion.button
      type="button"
      className="flex items-center justify-center flex-col cursor-pointer"
      id="playerSelect"
      animate={isActive ? { rotate: [0, 5, -5, 5, -5, 0] } : { rotate: 0 }}
      transition={
        isActive
          ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
          : { duration: 0.2 }
      }
      onClick={handleClick}
    >
      <Image
        id="playerSelect"
        src={playerData?.player_img || "/player.png"}
        alt={playerData?.name || "Player"}
        width={100}
        height={100}
      />
      <div className="flex flex-col items-center gap-2">
        <span className="text-md mr-2.5">{playerData?.name || label}</span>
        <span className="text-md mr-2.5">
          {playerData?.point_this_week || 0}
          {playerData?.isTripleCaptain && " (TC)"}
          {type === "bench" &&
            playerData?.point_this_week !== undefined &&
            " (Bench)"}
        </span>
      </div>
    </motion.button>
  );
}

export default Player;
