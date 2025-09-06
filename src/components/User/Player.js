"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { startTransition, useActionState } from "react";
import { addPlayerToTeam } from "@/services/userServices";

function Player({
  label,
  isActive,
  selectedPlayer,
  studentId,
  type,
  positionOnField,
}) {
  const [playerState, setPlayersFormAction] = useActionState(
    addPlayerToTeam,
    {}
  );
  function handleClick() {
    if (!selectedPlayer) return;
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("playerId", selectedPlayer?.id);
    formData.append("type", type);
    formData.append("selectedPlayer", JSON.stringify(selectedPlayer));
    formData.append("positionOnField", positionOnField);
    startTransition(async () => {
      await setPlayersFormAction(formData);
    });
  }

  return (
    <motion.div
      className="flex items-center justify-center flex-col"
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
        src="/player.png"
        alt="Player"
        width={100}
        height={100}
      />
      {label && <span className="text-md mr-2.5">{label}</span>}
    </motion.div>
  );
}

export default Player;
