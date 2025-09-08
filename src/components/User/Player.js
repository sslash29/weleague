"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { addPlayerToTeam } from "@/services/userServices";

function Player({
  label,
  isActive,
  selectedPlayer,
  studentId,
  type,
  positionOnField,
  playerData,
  onAddPlayer,
}) {
  async function handleClick() {
    if (!selectedPlayer) return;

    if (selectedPlayer.position.toLowerCase() !== label.toLowerCase()) {
      onAddPlayer(selectedPlayer, positionOnField, type, label, true);
      return;
    }

    onAddPlayer(selectedPlayer, positionOnField, type, label, false);

    // ✅ Server call only happens after successful validation
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("playerId", selectedPlayer.id);
    formData.append("type", type);
    formData.append("selectedPlayer", JSON.stringify(selectedPlayer));
    formData.append("positionOnField", positionOnField);

    await addPlayerToTeam(formData);
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
        <span className="text-md mr-2.5">{playerData?.name || label}</span>
      </motion.button>
    </form>
  );
}

export default Player;
