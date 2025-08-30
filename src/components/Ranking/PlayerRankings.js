"use client";

import { toNumber } from "@/utils/toNumber";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

function PlayerRankings({ playerData }) {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null); // track which image to show

  // Motion values (no React re-renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Target positions for cursor, used by lerp loop
  const targetX = useRef(0);
  const targetY = useRef(0);

  // Capture mouse and update targets only
  useEffect(() => {
    function handleMove(e) {
      targetX.current = e.clientX - 217;
      targetY.current = e.clientY - 301;
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // LERP animation loop for easing toward target
  useEffect(() => {
    let rafId;
    const lerpFactor = 0.18; // 0..1, higher = faster follow

    const tick = () => {
      const cx = x.get();
      const cy = y.get();
      x.set(cx + (targetX.current - cx) * lerpFactor);
      y.set(cy + (targetY.current - cy) * lerpFactor);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [x, y]);

  // Extract stats helper
  function extractStats(weeklyDataPoints) {
    if (!weeklyDataPoints)
      return { goals: 0, assists: 0, tackles: 0, saves: 0 };

    let parsed;
    try {
      parsed =
        typeof weeklyDataPoints === "string"
          ? JSON.parse(weeklyDataPoints)
          : weeklyDataPoints;
    } catch (e) {
      console.error("Invalid weekly_data_points format:", e);
      return { goals: 0, assists: 0, tackles: 0, saves: 0 };
    }

    const weeks = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object"
      ? Object.values(parsed)
      : [];

    let total = { goals: 0, assists: 0, tackles: 0, saves: 0 };

    weeks.forEach((week) => {
      try {
        if (
          !week ||
          (typeof week === "object" && Object.keys(week).length === 0)
        )
          return;

        let data;
        if (week && typeof week === "object") {
          if (week.data) {
            data = week.data;
          } else {
            const firstKey = Object.keys(week)[0];
            const maybeGW = firstKey ? week[firstKey] : undefined;
            if (maybeGW && typeof maybeGW === "object" && maybeGW.data) {
              data = maybeGW.data;
            }
          }
        }

        if (!data || typeof data !== "object") return;

        const goals = Object.entries(data.goals || {}).reduce(
          (sum, [key, val]) => (key !== "ownGoals" ? sum + toNumber(val) : sum),
          0
        );

        const tackles = Object.values(data.tackles || {}).reduce(
          (sum, val) => sum + toNumber(val),
          0
        );

        const saves = Object.values(data.saves || {}).reduce(
          (sum, val) => sum + toNumber(val),
          0
        );

        total.goals += goals;
        total.assists += toNumber(data.assists || 0);
        total.tackles += tackles;
        total.saves += saves;
      } catch (err) {
        console.warn("Skipping malformed weekly entry:", err);
      }
    });

    return total;
  }

  function handlePlayerClick(player) {
    router.push(`/player/${player.id}`);
  }

  const playersWithStats = useMemo(() => {
    return (playerData || []).map((p) => ({
      ...p,
      _stats: extractStats(p.weekly_data_points),
    }));
  }, [playerData]);

  const sortedPlayers = useMemo(() => {
    const arr = [...playersWithStats];
    arr.sort((a, b) => {
      const aStats = a._stats || {};
      const bStats = b._stats || {};
      const aTotal =
        (aStats.goals || 0) + (aStats.assists || 0) + (aStats.tackles || 0);
      const bTotal =
        (bStats.goals || 0) + (bStats.assists || 0) + (bStats.tackles || 0);
      return bTotal - aTotal;
    });
    return arr;
  }, [playersWithStats]);

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Teams</h2>
        <span className="text-2xl text-center">Goals</span>
        <span className="text-2xl text-center">Assists</span>
        <span className="text-2xl text-center">Tackles</span>
        <h2 className="text-4xl font-bold text-center">No.</h2>
      </div>

      <div className="flex-1 flex flex-col gap-5 px-4 overflow-y-auto">
        {sortedPlayers.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            index={index}
            onClick={() => handlePlayerClick(player)}
            setIsHover={setIsHover}
            setHoveredImage={setHoveredImage}
          />
        ))}

        <AnimatePresence mode="wait">
          {isHover && hoveredImage && (
            <motion.div
              key={hoveredImage} // important for transition
              className="absolute p-4 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{ x, y }}
            >
              <Image
                src={hoveredImage}
                alt="Player Cool Image"
                width={217}
                height={301}
                className="rounded-xl shadow-lg w-[217px] h-[301px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PlayerRankings;

function PlayerRow({ player, index, onClick, setIsHover, setHoveredImage }) {
  const { goals, assists, tackles } = player._stats || {
    goals: 0,
    assists: 0,
    tackles: 0,
  };

  return (
    <div
      className="grid grid-cols-5 items-center w-full relative min-h-[150px]"
      onMouseEnter={() => {
        if (player.cool_img) {
          setIsHover(true);
          setHoveredImage(player.cool_img);
        }
      }}
      onMouseLeave={() => {
        setIsHover(false);
        setHoveredImage(null);
      }}
    >
      {/* Player column */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
        <Image
          src={player.player_image || "/football-svgrepo-com.svg"}
          alt="Player Image"
          width={80}
          height={80}
          className="w-[80px] h-[80px] rounded-full"
        />
        <h3 className="text-3xl font-semibold">{player.full_name}</h3>
      </div>

      {/* Goals */}
      <p className="text-xl text-center">{goals}</p>

      {/* Assists */}
      <p className="text-xl text-center">{assists}</p>

      {/* Tackles */}
      <p className="text-xl text-center">{tackles}</p>

      {/* Index */}
      <p
        className="text-3xl text-center"
        style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
      >
        {index + 1}
      </p>
    </div>
  );
}
