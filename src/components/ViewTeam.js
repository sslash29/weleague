"use client";
import Image from "next/image";
import ViewTeamData from "./ViewTeamData";
import PlayersTypeDisplay from "./PlayersTypeDisplay";

function ViewTeam({ teamData, players }) {
  const allTimeData = JSON.parse(teamData.all_time_data || "{}");
  // Stats trackers
  let teamTotals = {
    goals: { normal: 0, freekick: 0, penalty: 0, goalToGoal: 0, ownGoals: 0 },
    saves: { normal: 0, penalty: 0 },
    assists: 0,
    tackles: { clearance: 0, shotBlock: 0, interception: 0 },
  };

  let bestPlayers = {
    topScorer: { name: null, img: null, goals: 0 },
    bestDefender: { name: null, img: null, tackles: 0 },
    bestGoalkeeper: { name: null, img: null, saves: 0 },
    bestPlaymaker: { name: null, img: null, assists: 0 },
  };

  // Loop through each gameweek
  Object.values(allTimeData).forEach((week) => {
    Object.entries(week.players).forEach(([playerName, player]) => {
      const { data, img, position } = player;

      // Goals
      const goals =
        data.goals.normalGoals +
        data.goals.freekickGoals +
        data.goals.penaltyGoals +
        data.goals.GoalToGoal;

      // Tackles
      const tackles =
        data.tackles.clearance +
        data.tackles.shotBlock +
        data.tackles.interception;

      // Saves
      const saves = data.saves.normalSaves + data.saves.penaltySaves;

      // Assists
      const assists = data.assists;

      // Update team totals
      teamTotals.goals.normal += data.goals.normalGoals;
      teamTotals.goals.freekick += data.goals.freekickGoals;
      teamTotals.goals.penalty += data.goals.penaltyGoals;
      teamTotals.goals.goalToGoal += data.goals.GoalToGoal;
      teamTotals.goals.ownGoals += data.goals.ownGoals;

      teamTotals.saves.normal += data.saves.normalSaves;
      teamTotals.saves.penalty += data.saves.penaltySaves;

      teamTotals.assists += assists;

      teamTotals.tackles.clearance += data.tackles.clearance;
      teamTotals.tackles.shotBlock += data.tackles.shotBlock;
      teamTotals.tackles.interception += data.tackles.interception;

      // Track best players
      if (goals > bestPlayers.topScorer.goals) {
        bestPlayers.topScorer = { name: playerName, img, goals };
      }

      if (tackles > bestPlayers.bestDefender.tackles) {
        bestPlayers.bestDefender = { name: playerName, img, tackles };
      }

      if (saves > bestPlayers.bestGoalkeeper.saves) {
        bestPlayers.bestGoalkeeper = { name: playerName, img, saves };
      }

      if (assists > bestPlayers.bestPlaymaker.assists) {
        bestPlayers.bestPlaymaker = { name: playerName, img, assists };
      }
    });
  });

  // ✅ Extract separate variables
  const freekickGoals = teamTotals.goals.freekick;
  const normalGoals = teamTotals.goals.normal;
  const penaltyGoals = teamTotals.goals.penalty;
  const goalToGoal = teamTotals.goals.goalToGoal;
  const ownGoals = teamTotals.goals.ownGoals;

  const totalAssists = teamTotals.assists;
  const totalTackles = { ...teamTotals.tackles }; // keep structure
  const totalSaves = { ...teamTotals.saves }; // keep structure

  // ✅ Default best players if still null
  const firstPlayerEntry = Object.entries(allTimeData)?.[0]?.[1]?.players;
  const firstPlayerName = firstPlayerEntry
    ? Object.keys(firstPlayerEntry)[0]
    : "Unknown";
  const firstPlayerImg = firstPlayerEntry
    ? Object.values(firstPlayerEntry)[0].img
    : "/default-player.png";

  if (!bestPlayers.topScorer.name)
    bestPlayers.topScorer = {
      name: firstPlayerName,
      img: firstPlayerImg,
      goals: 0,
    };
  if (!bestPlayers.bestDefender.name)
    bestPlayers.bestDefender = {
      name: firstPlayerName,
      img: firstPlayerImg,
      tackles: 0,
    };
  if (!bestPlayers.bestGoalkeeper.name)
    bestPlayers.bestGoalkeeper = {
      name: firstPlayerName,
      img: firstPlayerImg,
      saves: 0,
    };
  if (!bestPlayers.bestPlaymaker.name)
    bestPlayers.bestPlaymaker = {
      name: firstPlayerName,
      img: firstPlayerImg,
      assists: 0,
    };

  // Group players by position for display
  const normalize = (val) => (val || "").toString().trim().toLowerCase();
  const mapPosition = (pos) => {
    const p = normalize(pos);
    if (["attack", "attacker", "forward", "striker", "fw"].includes(p))
      return "attack";
    if (["midfield", "midfielder", "mid", "mf"].includes(p)) return "midfield";
    if (["defense", "defence", "defender", "back", "df"].includes(p))
      return "defense";
    if (["goalkeeper", "keeper", "gk", "goalie"].includes(p))
      return "goalkeeper";
    return "unknown";
  };

  const safePlayers = Array.isArray(players) ? players : [];
  const attackers = safePlayers.filter(
    (p) => mapPosition(p.position) === "attack"
  );
  const midfielders = safePlayers.filter(
    (p) => mapPosition(p.position) === "midfield"
  );
  const defenders = safePlayers.filter(
    (p) => mapPosition(p.position) === "defense"
  );
  const goalkeepers = safePlayers.filter(
    (p) => mapPosition(p.position) === "goalkeeper"
  );

  return (
    <div className="w-full h-full flex gap-10 translate-y-10">
      <ViewTeamData
        normalGoals={normalGoals}
        freekickGoals={freekickGoals}
        goalToGoal={goalToGoal}
        penaltyGoals={penaltyGoals}
        ownGoals={ownGoals}
        totalTackles={totalTackles}
        totalSaves={totalSaves}
        totalAssists={totalAssists}
        bestPlayers={bestPlayers}
        teamData={teamData}
      />
      <div className="h-[792px] overflow-y-scroll w-full flex flex-col justify-start bg-[#F2F2F2] p-3">
        <div className="flex w-full items-center justify-between">
          <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between w-[300px] h-full">
            <input
              type="text"
              placeholder="Search For Player..."
              className="bg-transparent outline-none w-full"
            />
            <Image
              src="/Search.svg"
              alt="Search Icon"
              width={19.5}
              height={19.5}
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-full w-fit h-fit px-2 py-2 cursor-pointer">
            <Image
              src="/Filter.svg"
              alt="Filter Icon"
              width={18.75}
              height={18.75}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-7 ">
          <PlayersTypeDisplay players={attackers} position="Attackers" />
          <PlayersTypeDisplay players={midfielders} position="Midfielders" />
          <PlayersTypeDisplay players={goalkeepers} position="Goalkeepers" />
          <PlayersTypeDisplay players={defenders} position="Defenders" />
        </div>
      </div>
    </div>
  );
}

export default ViewTeam;
