"use client";

import Link from "next/link";
import TeamDisplayer from "./TeamDisplayer";
import { useOptimistic } from "react";

function ManageTeams({ teams }) {
  const [optimisticTeamState, addOptimistic] = useOptimistic(
    teams,
    (currentState, optimisticValue) => {
      return currentState.filter((team) => team.id !== optimisticValue.id);
    }
  );
  return (
    <div className="border p-3 mt-5 h-[78vh] flex flex-wrap content-start gap-x-5 gap-y-5 relative overflow-y-scroll">
      {teams.length === 0 ? (
        <li>No teams found</li>
      ) : (
        optimisticTeamState.map((team) => (
          <div key={team.id}>
            <TeamDisplayer
              team={team}
              onDelete={(team) => addOptimistic(team)}
            />
          </div>
        ))
      )}
      <Link
        href="/moderator/create-team"
        className="absolute bottom-5 right-3 border px-3 py-1 font-semibold cursor-pointer transition-all hover:scale-95 text-lg rounded-full z-10"
      >
        Create Team
      </Link>
    </div>
  );
}

export default ManageTeams;
