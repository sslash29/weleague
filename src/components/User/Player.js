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

    // Check for position validation error
    if (selectedPlayer.position.toLowerCase() !== label.toLowerCase()) {
      onAddPlayer(selectedPlayer, positionOnField, type, label, true);
      return;
    }

    // Add player optimistically first
    onAddPlayer(selectedPlayer, positionOnField, type, label, false);

    // ✅ Server call only happens after successful validation
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("playerId", selectedPlayer.id);
    formData.append("type", type);
    formData.append("selectedPlayer", JSON.stringify(selectedPlayer));
    formData.append("positionOnField", positionOnField);

    const data = await addPlayerToTeam(formData);

    // Handle server errors by calling onAddPlayer with error info
    if (data.success === false) {
      // Pass the server error message back to parent
      onAddPlayer(null, positionOnField, type, label, true, data.message);
      return;
    }

    console.log(data);
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
