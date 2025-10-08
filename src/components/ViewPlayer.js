import Image from "next/image";
import { useMemo } from "react";
import ViewStats from "./ViewStats";
import PlayerChart from "./PlayerChart";

function ViewPlayer({ playerData, teamData }) {
  const latestStats = useMemo(() => {
    try {
      const arr = JSON.parse(playerData.weekly_data_points);
      if (!Array.isArray(arr) || arr.length === 0) return null;

      // Get the latest gameweek object (last element)
      const lastGameWeek = arr[arr.length - 1];
      const gameKey = Object.keys(lastGameWeek)[0];
      return lastGameWeek[gameKey].data;
    } catch (e) {
      console.error("Error parsing stats", e);
      return null;
    }
  }, [playerData.weekly_data_points]);
  latestStats;

  if (!latestStats) return <p>No stats available</p>;
  return (
    <div className="w-[700px] h-fit p-2 py-6 bg-[#f5f3f3]">
      {/* The Navbar */}
      <div className="flex items-end justify-between bg-[#EBEBEB] rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Image
            src={playerData.player_image || "/football-svgrepo-com.svg"}
            alt="Player Image"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-full"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl">{playerData.full_name}</h2>
            <div className="flex items-center gap-1.5 ml-2 opacity-50">
              <span className=" text-sm">{playerData.age} years old</span>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <span className=" text-sm">{playerData.class}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-3xl">Team</h3>
          <Image
            src={teamData.team_img}
            height={65}
            width={65}
            className="rounded-full"
            alt="player-img"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <ViewStats
              titleName="Goals"
              items={[
                {
                  label: "Freekick Goals",
                  value: latestStats.goals.freekickGoals,
                },
                { label: "Normal Goals", value: latestStats.goals.normalGoals },
                { label: "Goal To Goal", value: latestStats.goals.GoalToGoal },
                {
                  label: "Penalty Goals",
                  value: latestStats.goals.penaltyGoals,
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <ViewStats
              titleName="Tackles"
              items={[
                {
                  label: "Clearance",
                  value: latestStats.tackles.clearance,
                },
                {
                  label: "Shot Block",
                  value: latestStats.tackles.shotBlock,
                },
                {
                  label: "Interception",
                  value: latestStats.tackles.interception,
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <ViewStats
              titleName="Saves"
              items={[
                { label: "Normal Saves", value: latestStats.saves.normalSaves },
                {
                  label: "Penalty Saves",
                  value: latestStats.saves.penaltySaves,
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <ViewStats
              titleName="Assists"
              items={[
                {
                  label: "Total Assists",
                  value: latestStats.assists,
                },
              ]}
            />
          </div>
        </div>
        <div>
          <PlayerChart
            data={[
              latestStats.goals.freekickGoals +
                latestStats.goals.normalGoals +
                latestStats.goals.GoalToGoal +
                latestStats.goals.penaltyGoals, // Shooting
              latestStats.tackles.clearance +
                latestStats.tackles.shotBlock +
                latestStats.tackles.interception, // Defending
              latestStats.saves.normalSaves + latestStats.saves.penaltySaves, // Saving
              latestStats.assists, // Playmaking
              latestStats.goals.freekickGoals + latestStats.goals.GoalToGoal, // Long Shots
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewPlayer;
