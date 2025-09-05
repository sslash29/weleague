"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function Player({ label, isActive }) {
  return (
    <motion.div
      className="flex items-center justify-center flex-col"
      animate={
        isActive
          ? { rotate: [0, 5, -5, 5, -5, 0] } // jiggle motion
          : { rotate: 0 }
      }
      transition={
        isActive
          ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
          : { duration: 0.2 }
      }
    >
      <Image src="/player.png" alt="Player" width={100} height={100} />
      {label && <span className="text-md mr-2.5">{label}</span>}
    </motion.div>
  );
}

export default Player;
