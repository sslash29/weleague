import Image from "next/image";
import ViewTeamStats from "./ViewTeamStats";

function ViewTeamData({
  teamData,
  freekickGoals,
  normalGoals,
  goalToGoal,
  penaltyGoals,
  ownGoals,
  totalTackles,
  totalSaves,
  totalAssists,
  bestPlayers,
}) {
  return (
    <div className="h-full w-full flex flex-col justify-center bg-[#F2F2F2] p-3  gap-y-7">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2 items-center ">
          <Image
            src={teamData.team_img}
            alt="Team Logo"
            width={125}
            height={125}
            className="w-[125px] h-[125px] rounded-full"
          />
          <h2 className="text-5xl font-medium">{teamData.name}</h2>
        </div>
        <div className="flex flex-col items-center text-5xl font-medium w-[180px]">
          <span>Class</span>
          <span>{teamData.class}</span>
        </div>
      </div>
      <div className="flex flex-col gap-7">
        <div className="flex items-start justify-between">
          <ViewTeamStats
            titleName="Goals"
            items={[
              { label: "Freekick", value: freekickGoals },
              { label: "Normal", value: normalGoals },
              { label: "Goal-To-Goal", value: goalToGoal },
              { label: "Penalty", value: penaltyGoals },
              { label: "Own Goals", value: ownGoals },
            ]}
          />
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <h3 className="font-regular text-2xl w-[180px] text-center">
              Top Scorer
            </h3>
            <Image
              src={bestPlayers.topScorer.img}
              alt="Top Scorer"
              width={85}
              height={85}
              className="w-[85px] h-[85px] rounded-full"
            />
          </div>
        </div>
        <div className="flex items-start justify-between">
          <ViewTeamStats
            titleName="Tackles"
            items={[
              { label: "Clearance", value: totalTackles.clearance },
              { label: "Shot Block", value: totalTackles.shotBlock },
              { label: "Interception", value: totalTackles.interception },
            ]}
          />
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <h3 className="font-regular text-2xl w-[180px] text-center">
              Top Defender
            </h3>
            <Image
              src={bestPlayers.bestDefender.img}
              alt="Best Defender"
              width={85}
              height={85}
              className="w-[85px] h-[85px] rounded-full"
            />
          </div>
        </div>
        <div className="flex items-start justify-between">
          <ViewTeamStats
            titleName="Saves"
            items={[
              { label: "Normal", value: totalSaves.normal },
              { label: "Penalty", value: totalSaves.penalty },
            ]}
          />
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <h3 className="font-regular text-2xl w-[180px] text-center">
              Top Saver
            </h3>
            <Image
              src={bestPlayers.bestGoalkeeper.img}
              alt="Top Goalkeeper"
              width={85}
              height={85}
              className="w-[85px] h-[85px] rounded-full"
            />
          </div>
        </div>
        <div className="flex items-start justify-between">
          <ViewTeamStats
            titleName="Assists"
            items={[{ label: "Total", value: totalAssists }]}
          />
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <h3 className="font-regular text-2xl w-[180px] text-center">
              Top Playmaker
            </h3>
            <Image
              src={bestPlayers.bestPlaymaker.img}
              alt="Top Playemaker"
              width={85}
              height={85}
              className="w-[85px] h-[85px] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTeamData;
