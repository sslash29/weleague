"use client";
import { addLeagueData } from "@/services/services";
import Image from "next/image";
import { useActionState } from "react";

function GroupStage({ groupStage }) {
  const { gameweeks } = groupStage;
  const [approveLeagueState, approveLeagueAction] = useActionState(
    addLeagueData,
    {}
  );

  console.log(groupStage);

  return (
    <div className="p-6 space-y-8">
      {gameweeks.map((gw) => (
        <div
          key={gw.gameweek}
          className="border rounded-2xl shadow-md p-4 bg-white"
        >
          <h2 className="text-xl font-bold mb-4">Gameweek {gw.gameweek}</h2>
          <div className="space-y-4">
            {gw.matches.map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-xl p-3 shadow-sm bg-gray-50"
              >
                {/* Home Team */}
                <div className="flex items-center space-x-3">
                  <Image
                    src={match.home.team_img}
                    alt={match.home.name}
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                  />
                  <span className="font-medium">{match.home.name}</span>
                </div>
                {/* VS */}
                <span className="text-gray-500 font-semibold">vs</span>
                {/* Away Team */}
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{match.away.name}</span>
                  <Image
                    src={match.away.team_img}
                    alt={match.away.name}
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                  />
                </div>
                {/* Group Tag */}
                <span className="text-sm text-gray-400 italic">
                  {match.group}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <form>
        <input
          type="hidden"
          value={JSON.stringify(groupStage)}
          name="groupStage"
        />
        <button
          className="cursor-pointer hover:scale-110"
          formAction={approveLeagueAction}
          type="submit"
        >
          Approve
        </button>
      </form>

      {/* Show error or success messages */}
      {approveLeagueState.error && (
        <div className="text-red-500 p-2 bg-red-50 rounded">
          Error: {approveLeagueState.error}
        </div>
      )}
      {approveLeagueState.success && (
        <div className="text-green-500 p-2 bg-green-50 rounded">
          {approveLeagueState.message}
        </div>
      )}
    </div>
  );
}

export default GroupStage;
