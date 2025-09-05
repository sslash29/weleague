"use client";

import { useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";

function Team({ players }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  return (
    <div className="flex gap-3 items-center translate-y-15">
      <TeamPlayerSelect
        players={players}
        selectedPlayerId={selectedPlayerId}
        setSelectedPlayerId={setSelectedPlayerId}
      />
      <TeamPlayers selectedPlayerId={selectedPlayerId} />
    </div>
  );
}

export default Team;
