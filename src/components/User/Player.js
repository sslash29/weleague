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

  async function handleClick() {
    if (selectedPowerUp === "triple-captain") {
      const hasTripleCaptain =
        team.mainPlayers.some((p) => p.isTripleCaptain) ||
        team.benchPlayers.some((p) => p.isTripleCaptain);

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
        point_this_week: playerData.point_this_week * 3,
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

    if (
      selectedPlayer?.position?.toLowerCase() === label.toLowerCase() &&
      playerData?.id !== selectedPlayer?.id
    ) {
      const price = selectedPlayer.price - playerData?.playerPrice;
      const updatedSelectedPlayer = {
        ...selectedPlayer,
        calculationPrice: price,
      };

      console.log(
        price,
        updatedSelectedPlayer,
        selectedPlayer.price,
        playerData?.playerPrice
      );

      onAddPlayer(
        playerData ? updatedSelectedPlayer : selectedPlayer,
        positionOnField,
        type,
        label,
        true
      );

      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("playerId", selectedPlayer?.id);
      formData.append("type", type);
      formData.append(
        "selectedPlayer",
        JSON.stringify(playerData ? updatedSelectedPlayer : selectedPlayer)
      );
      formData.append("positionOnField", positionOnField);

      const data = await addPlayerToTeam(formData);

      if (data.success === false) {
        onAddPlayer(
          null,
          positionOnField,
          type,
          label,
          true,
          data.message // ❌ Pass error message for Notification
        );
        return;
      }
    }
  }

  return (
    <form>
      <motion.button
        className="flex items-center justify-center flex-col cursor-pointer"
        id="playerSelect"
        animate={isActive ? { rotate: [0, 5, -5, 5, -5, 0] } : { rotate: 0 }}
        transition={
          isActive
            ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        formAction={handleClick}
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
            {playerData?.point_this_week}
            {playerData?.isTripleCaptain && " (TC)"}
          </span>
        </div>
      </motion.button>
    </form>
  );
}

export default Player;
