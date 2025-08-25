"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function TeamRankings({ teamData }) {
  const router = useRouter();
  function calculateStats(all_time_data) {
    if (!all_time_data) return { goals: 0, assists: 0, tackles: 0 };

    let goals = 0;
    let assists = 0;
    let tackles = 0;

    let parsed;
    try {
      parsed = JSON.parse(all_time_data);
    } catch (err) {
      console.error("Invalid all_time_data JSON:", err);
      return { goals, assists, tackles };
    }

    Object.values(parsed).forEach((gameWeek) => {
      Object.values(gameWeek.players).forEach((player) => {
        // Sum goals
        goals += Object.values(player.data.goals).reduce(
          (acc, g) => acc + g,
          0
        );
        // Sum assists
        assists += player.data.assists || 0;
        // Sum tackles
        tackles += Object.values(player.data.tackles).reduce(
          (acc, t) => acc + t,
          0
        );
      });
    });

    return { goals, assists, tackles };
  }

  function handleTeamClick(team) {
    router.push(`/teams/${team.id}`);
  }

  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15">
      {/* Header */}
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-5 px-4 py-3 items-center">
        <h2 className="text-4xl font-bold">Teams</h2>
        <span className="text-2xl text-center">Goals</span>
        <span className="text-2xl text-center">Assists</span>
        <span className="text-2xl text-center">Tackles</span>
        <h2 className="text-4xl font-bold text-center">No.</h2>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-4 px-4">
        {teamData.map((team, index) => {
          const { goals, assists, tackles } = calculateStats(
            team.all_time_data
          );

          return (
            <div key={team.id} className="grid grid-cols-5 items-center w-full">
              {/* Team column */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleTeamClick(team)}
              >
                <Image
                  src={team.team_img}
                  alt="Team Logo"
                  width={80}
                  height={80}
                  className="w-[80px] h-[80px] rounded-full"
                />
                <h3 className="text-3xl font-semibold">{team.name}</h3>
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
                style={{
                  fontFamily: "var(--font-instrument-sans), sans-serif",
                }}
              >
                {index + 1}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamRankings;
