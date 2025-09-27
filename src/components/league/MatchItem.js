"use client";
import Image from "next/image";
import { useState } from "react";

export default function MatchItem({ match, addMatchDateAction }) {
  const [matchDate, setMatchDate] = useState(match.match_date || "");

  return (
    <form>
      <input
        type="hidden"
        value={match.database_id || match.id}
        name="matchId"
      />
      <div className="flex items-center justify-between border rounded-xl p-3 shadow-sm bg-gray-50">
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
        <span className="text-sm text-gray-400 italic">{match.group}</span>
      </div>
      {/* Date Input with individual state */}
      <input
        type="date"
        name="matchDate"
        value={matchDate}
        onChange={(e) => setMatchDate(e.target.value)}
        className="mt-2 border rounded-md p-2"
      />
      {/* Submit Button - only show if we have a database_id */}
      {match.database_id || match.id ? (
        <button
          formAction={addMatchDateAction}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Date
        </button>
      ) : (
        <button
          disabled
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          League Not Approved Yet
        </button>
      )}
    </form>
  );
}
