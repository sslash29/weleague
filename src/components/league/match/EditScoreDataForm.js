"use client";

import { updateMatchFacts } from "@/services/services";
import { useState, useMemo, useActionState } from "react";

function MatchEventsEditor({ team1, team2, matchId, matchData }) {
  // Parse and process match data
  const initialEvents = useMemo(() => {
    const parseAndCountEvents = (jsonString) => {
      if (!jsonString || jsonString === "[]") return [];
      try {
        const events = JSON.parse(jsonString);
        const countMap = new Map();
        events.forEach((event) => {
          const key = event.playerId;
          if (countMap.has(key)) {
            countMap.get(key).count += 1;
          } else {
            countMap.set(key, {
              playerId: event.playerId,
              playerName: event.playerName,
              count: 1,
            });
          }
        });
        return Array.from(countMap.values());
      } catch (e) {
        console.error("Error parsing events:", e);
        return [];
      }
    };

    const team1Goals = parseAndCountEvents(matchData.team_1_goals);
    const team2Goals = parseAndCountEvents(matchData.team_2_goal);
    const team1Assists = parseAndCountEvents(matchData.team_1_assists);
    const team2Assists = parseAndCountEvents(matchData.team_2_assists);

    const team1Score = team1Goals.reduce((sum, goal) => sum + goal.count, 0);
    const team2Score = team2Goals.reduce((sum, goal) => sum + goal.count, 0);

    return {
      team1Score,
      team2Score,
      winner: matchData.winner,
      team_1_goals: team1Goals,
      team_2_goals: team2Goals,
      team_1_assists: team1Assists,
      team_2_assists: team2Assists,
    };
  }, [matchData]);

  const [events, setEvents] = useState(initialEvents);
  const [formState, formAction] = useActionState(updateMatchFacts, null);

  const handleDeleteEvent = (type, teamKey, index) => {
    setEvents((prev) => {
      const updatedEvents = { ...prev };
      updatedEvents[teamKey] = [...updatedEvents[teamKey]];
      updatedEvents[teamKey].splice(index, 1);
      if (type === "goal") {
        if (teamKey === "team_1_goals") updatedEvents.team1Score -= 1;
        if (teamKey === "team_2_goals") updatedEvents.team2Score -= 1;
      }
      return updatedEvents;
    });
  };

  const getWinnerName = () => {
    if (!events.winner) return "No winner yet";
    if (events.winner === team1.id) return team1.name;
    if (events.winner === team2.id) return team2.name;
    return "Unknown";
  };

  return (
    <form action={formAction} className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Match Events</h1>

      {/* Match Score */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">{team1.name}</h2>
          <p className="text-3xl font-bold">{events.team1Score}</p>
        </div>
        <span className="text-2xl font-bold">-</span>
        <div className="text-center">
          <h2 className="text-2xl font-semibold">{team2.name}</h2>
          <p className="text-3xl font-bold">{events.team2Score}</p>
        </div>
      </div>

      {/* Winner */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold">Winner:</h3>
        <p className="text-lg">{getWinnerName()}</p>
      </div>

      {/* Goals and Assists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team 1 Goals */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{team1.name} Goals</h3>
          <ul className="space-y-2">
            {events.team_1_goals.map((goal, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {goal.playerName} ({goal.count})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteEvent("goal", "team_1_goals", index)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Team 2 Goals */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{team2.name} Goals</h3>
          <ul className="space-y-2">
            {events.team_2_goals.map((goal, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {goal.playerName} ({goal.count})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteEvent("goal", "team_2_goals", index)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Team 1 Assists */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{team1.name} Assists</h3>
          <ul className="space-y-2">
            {events.team_1_assists.map((assist, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {assist.playerName} ({assist.count})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteEvent("assist", "team_1_assists", index)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Team 2 Assists */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{team2.name} Assists</h3>
          <ul className="space-y-2">
            {events.team_2_assists.map((assist, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {assist.playerName} ({assist.count})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteEvent("assist", "team_2_assists", index)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hidden inputs for formAction */}
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="eventsData" value={JSON.stringify(events)} />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Save All Changes
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500"
          onClick={() => setEvents(initialEvents)} // reset to initial state
        >
          Cancel
        </button>
      </div>

      {/* Show response feedback */}
      {formState && (
        <p
          className={`mt-4 text-sm ${
            formState.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {formState.message}
        </p>
      )}
    </form>
  );
}

export default MatchEventsEditor;
