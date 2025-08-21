import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { useRef } from "react";

function PlayersTypeDisplay({ players, position }) {
  const list = Array.isArray(players) ? players : [];
  const scrollRef = useRef(null);
  const x = useMotionValue(0);

  const handleDrag = (_, info) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= info.delta.x; // 👈 link drag to scroll
    }
  };

  return (
    <div className="flex flex-col select-none">
      <h3 className="text-2xl font-semibold">{position}</h3>

      <div
        ref={scrollRef}
        className="w-[590px] max-w-full overflow-x-auto flex gap-3 
                   scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} // no real constraint, since scroll handles bounds
          style={{ x }}
          onDrag={handleDrag} // 👈 sync drag with scroll
          className="flex items-center justify-start gap-3 flex-nowrap cursor-grab active:cursor-grabbing"
        >
          {list.map((player, idx) => {
            const name = player?.name || player?.full_name || "Unknown";
            const img =
              player?.img || player?.player_image || "/default-player.png";
            const key = player?.id || `${position}-${idx}`;

            return (
              <div
                className="flex flex-col items-center bg-white p-2 py-4 w-[180px] "
                key={key}
              >
                <Image
                  src={img}
                  alt={name}
                  width={85}
                  height={85}
                  draggable={false}
                  className="w-[85px] h-[85px] rounded-full object-cover select-none"
                />
                <h3 className="text-lg font-medium mt-2">{name}</h3>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default PlayersTypeDisplay;
