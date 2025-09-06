"use client";

import { useState } from "react";
import TeamPlayers from "./TeamPlayers";
import TeamPlayerSelect from "./TeamPlayerSelect";

function Team({ players, studentId, team }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="flex gap-3 items-center translate-y-15">
      <div className="relative">
        <h2 className=" text-4xl font-semibold absolute bottom-[765px] z-10">
          Team Name
        </h2>
        <TeamPlayerSelect
          players={players}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      </div>
      <TeamPlayers
        selectedPlayer={selectedPlayer}
        studentId={studentId}
        team={team}
      />
    </div>
  );
}

export default Team;
