"use client";

import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";

function Team({ players }) {
  return (
    <div className="flex gap-3 items-center translate-y-15">
      <TeamPlayerSelect players={players} />
      <TeamPlayers />
    </div>
  );
}

export default Team;
