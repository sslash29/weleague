"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { addPlayerToTeam, applyTripleCaptain } from "@/services/userServices";
import { startTransition, useActionState } from "react";

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
}) {
  const [tripleCaptainState, tripleCaptainAction] = useActionState(
    applyTripleCaptain,
    {}
  );

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .trim();

  console.log(playerData);

  async function handleClick() {
    if (type === "bench" && selectedPowerUp === "bench-boost") {
      //?  you will make each player double their points in the ui then you will call to updated in the server
      //? so then you will need to updated in the team componenet
      const updatedPlayerData = {
        ...playerData,
        point_this_week: playerData.point_this_week * 2,
        isBenchBoost: true,
      };
      onAddPlayer(updatedPlayerData, positionOnField, type, label);
    }
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

      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("playerType", type);
      formData.append("currentTeam", JSON.stringify(team));
      formData.append("playerData", JSON.stringify(playerData));

      startTransition(() => {
        tripleCaptainAction(formData);
      });

      return;
    }

    if (!selectedPlayer) return;

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

    // ✅ Check if this is a position switch (same player, different position)
    const isPositionSwitch = selectedPlayerPositions.length > 0;

    // ✅ calculate effective price difference
    let price;
    let playerPrice;

    if (isPositionSwitch) {
      // For position switches, no money change needed
      price = 0;
      playerPrice = 0;
    } else {
      // For new players, calculate the price difference
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

    // ✅ Check if user has enough money before proceeding (only for new players)
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

    // ✅ always override price so reducer sees correct value
    const updatedSelectedPlayer = {
      ...selectedPlayer,
      price,
    };

    onAddPlayer(updatedSelectedPlayer, positionOnField, type, label);

    // ✅ Only call server if we have enough money
    const formData = new FormData();
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
          {(() => {
            let points = playerData?.point_this_week || 0;

            // Apply half points for bench players
            if (type === "bench") {
              if (selectedPowerUp === "bench-boost") {
                return points;
              }
              points = Math.floor(points / 2);
            }

            return points;
          })()}
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
