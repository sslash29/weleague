import Image from "next/image";

function TeamRankings({ teamData }) {
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
          const totalTacklesPoints = team.team_data?.tackles?.reduce(
            (acc, t) => acc + (t.points || 0),
            0
          );

          return (
            <div key={team.id} className="grid grid-cols-5 items-center w-full">
              {/* Team column */}
              <div className="flex items-center gap-3">
                <Image
                  src={team.team_img}
                  alt="Team Logo"
                  width={80}
                  height={80}
                  className="w-[80px] h-[80px] rounded-full"
                />
                <h3 className="text-3xl font-semibold">{team.name}</h3>
              </div>

              {/* Yellow cards */}
              <p className="text-xl text-center">{team.yellow_cards}</p>

              {/* Red cards */}
              <p className="text-xl text-center">{team.red_cards}</p>

              {/* Tackles (sum of points) */}
              <p className="text-xl text-center">{totalTacklesPoints}</p>

              {/* Index */}
              <p className="text-3xl text-center">{index + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamRankings;
