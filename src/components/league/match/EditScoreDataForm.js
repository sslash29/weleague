"use client";
import { useState } from "react";
import { updateScoreData } from "@/services/services";

function EditScoreDataForm({ scoreData, matchId }) {
  const [parsedData, setParsedData] = useState(() => {
    try {
      return JSON.parse(scoreData);
    } catch (e) {
      console.error("Failed to parse scoreData:", e);
      return [];
    }
  });

  const handleDelete = async (teamId, dataIndex) => {
    // Create a deep clone of the data
    const updatedData = JSON.parse(JSON.stringify(parsedData));

    // Find the team and remove the specific data entry
    const lastEntry = updatedData[updatedData.length - 1];
    if (lastEntry?.teams) {
      const team = lastEntry.teams.find((t) => t.teamId === teamId);
      if (team && team.data) {
        team.data.splice(dataIndex, 1);
      }
    }

    // Update in database
    const formData = new FormData();
    formData.append("matchId", matchId);
    formData.append("scoreData", JSON.stringify(updatedData));

    const result = await updateScoreData(null, formData);

    if (result?.success) {
      setParsedData(updatedData);
    }
  };

  const handleScoreUpdate = async (teamId, newScore) => {
    // Create a deep clone of the data
    const updatedData = JSON.parse(JSON.stringify(parsedData));

    // Find the team and update the score
    const lastEntry = updatedData[updatedData.length - 1];
    if (lastEntry?.teams) {
      const team = lastEntry.teams.find((t) => t.teamId === teamId);
      if (team) {
        team.score = newScore;
      }
    }

    // Update in database
    const formData = new FormData();
    formData.append("matchId", matchId);
    formData.append("scoreData", JSON.stringify(updatedData));

    const result = await updateScoreData(null, formData);

    if (result?.success) {
      setParsedData(updatedData);
    }
  };

  // Get the latest entry
  const latestEntry = parsedData[parsedData.length - 1];
  const teams = latestEntry?.teams || [];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Edit Match Score Data</h2>

      {teams.map((team) => (
        <div key={team.teamId} className="border rounded-lg p-4 bg-[#f9f9f9]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{team.teamName}</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Score:</label>
              <input
                type="number"
                value={team.score}
                onChange={(e) => handleScoreUpdate(team.teamId, e.target.value)}
                className="w-16 p-1 rounded bg-white border border-gray-300 text-center"
              />
            </div>
          </div>

          {team.data && team.data.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Goals & Assists:
              </p>
              {team.data.map((playerEvent, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-3 rounded border border-gray-200"
                >
                  <div className="flex gap-3 items-center">
                    <span className="font-medium">
                      {playerEvent.playerName}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        playerEvent.event === "Goal"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {playerEvent.event}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(team.teamId, index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No goals or assists yet
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EditScoreDataForm;
