"use server";

import { addGameweekQuery } from "@/lib/db/queries/queries";
import { createClient } from "@/utils/supabase/server";

const {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
  getPlayerDataRepository,
  getBestAwardsRepository,
  addVoteRepository,
  getVoteRepository,
  getUserDataRepository,
  deleteAccountRepository,
  getStudentsRepository,
  addLeagueDataRepository,
  addMatchDateRepository,
  isThereLeagueRepository,
  getGameWeekRepository,
  addScoreRepository,
  getMatchDataRepository,
  updateScoreDataRepository,
} = require("@/lib/db/repositories/repositories");

async function getAllTeams() {
  return await getAllTeamsRepository();
}

async function getTeamData(teamId) {
  return await getTeamDataRepository(teamId);
}

async function updateReportType(prevState, formData) {
  return await updateReportTypeRepository(prevState, formData);
}

async function getPlayerTeam(playerId) {
  return await getPlayerTeamRepository(playerId);
}

async function getTeamPlayers(teamdId) {
  return await getTeamPlayersRepository(teamdId);
}

async function getPlayerData(playerId) {
  return await getPlayerDataRepository(playerId);
}

async function getBestAwards() {
  return await getBestAwardsRepository();
}

async function addVote(prevState, formData) {
  return await addVoteRepository(prevState, formData);
}
async function getVote(student_id = "aa20eca5-773e-444d-9391-489739ce3a9d") {
  const data = await getVoteRepository(student_id);
  const bestGoals = data.filter(
    (item) => item.best_award?.award_type === "bestGoal"
  );
  const bestAssists = data.filter(
    (item) => item.best_award?.award_type === "bestAssist"
  );
  const bestTackles = data.filter(
    (item) => item.best_award?.award_type === "bestTackle"
  );
  return {
    bestGoals,
    bestAssists,
    bestTackles,
  };
}

async function getUserData(studentId) {
  return await getUserDataRepository(studentId);
}

async function deleteAccount(prevState, formData) {
  return await deleteAccountRepository(prevState, formData);
}

async function getStudents() {
  return await getStudentsRepository();
}

// Add this helper function to transform database data back to the expected structure
async function transformDatabaseToGroupStage(matches, groups) {
  // Get gameweeks to organize matches properly
  const gameweeksData = await getGameWeekRepository();

  // Transform groups data
  const transformedGroups = {};
  groups.forEach((group) => {
    transformedGroups[group.name] = {
      group_name: group.name,
      teams: group.teams, // This is already in the right format (jsonb)
      matches: [], // Will be filled later
    };
  });

  // Create gameweeks structure
  const gameweeks = gameweeksData
    .map((gw) => ({
      gameweek: gw.gameweek_number,
      matches: matches
        .filter((match) => match.gameweek_id === gw.id)
        .map((match) => {
          // Find the teams from the groups to get full team data
          let homeTeam = null;
          let awayTeam = null;

          Object.values(transformedGroups).forEach((group) => {
            const home = group.teams.find((team) => team.id === match.team1);
            const away = group.teams.find((team) => team.id === match.team2);
            if (home) homeTeam = home;
            if (away) awayTeam = away;
          });

          return {
            database_id: match.id, // Add database ID immediately
            home: homeTeam
              ? {
                  id: homeTeam.id,
                  name: homeTeam.name,
                  team_img: homeTeam.team_img,
                }
              : { id: match.team1, name: "Unknown", team_img: "" },
            away: awayTeam
              ? {
                  id: awayTeam.id,
                  name: awayTeam.name,
                  team_img: awayTeam.team_img,
                }
              : { id: match.team2, name: "Unknown", team_img: "" },
            group: match.stage,
            match_date: match.match_date,
            gameweek_id: match.gameweek_id,
          };
        }),
    }))
    .filter((gw) => gw.matches.length > 0); // Only include gameweeks with matches

  return {
    groups: transformedGroups,
    gameweeks,
  };
}

async function createGroupStage() {
  const isThereLeague = await isThereLeagueRepository();
  if (isThereLeague.isThereLeague) {
    // Transform database data to expected structure
    return await transformDatabaseToGroupStage(
      isThereLeague.data.data,
      isThereLeague.data.groups
    );
  }

  // get all teams from repo
  const teams = await getAllTeamsRepository();
  if (!teams || teams.length === 0) {
    throw new Error("No teams available");
  }

  // shuffle teams (Fisher-Yates shuffle)
  const shuffled = [...teams];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // split into groups of 4
  const groups = {};
  let groupIndex = 0;
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  for (let i = 0; i < shuffled.length; i += 4) {
    const groupTeams = shuffled.slice(i, i + 4);
    const groupName = `group ${alphabet[groupIndex]}`;

    // build matches (round robin, no score)
    const matches = [];
    for (let a = 0; a < groupTeams.length; a++) {
      for (let b = a + 1; b < groupTeams.length; b++) {
        matches.push({
          home: {
            id: groupTeams[a].id,
            name: groupTeams[a].name,
            team_img: groupTeams[a].team_img,
          },
          away: {
            id: groupTeams[b].id,
            name: groupTeams[b].name,
            team_img: groupTeams[b].team_img,
          },
          group: groupName, // keep track of which group
        });
      }
    }

    groups[groupName] = {
      group_name: groupName,
      teams: groupTeams.map((t) => ({
        id: t.id,
        name: t.name,
        team_img: t.team_img,
        points: t.points_all_time,
      })),
      matches,
    };
    groupIndex++;
  }

  // collect all matches from groups
  const allMatches = Object.values(groups).flatMap((g) => g.matches);

  // shuffle matches globally
  for (let i = allMatches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allMatches[i], allMatches[j]] = [allMatches[j], allMatches[i]];
  }

  // build gameweeks with 5 matches each
  const gameweeks = [];
  let weekIndex = 1;

  while (allMatches.length > 0) {
    const weekMatches = [];
    const usedGroups = new Set();

    // try to add up to 5 matches from different groups
    for (let i = 0; i < allMatches.length && weekMatches.length < 5; i++) {
      const match = allMatches[i];
      if (!usedGroups.has(match.group)) {
        weekMatches.push(match);
        usedGroups.add(match.group);
        allMatches.splice(i, 1); // remove match from pool
        i--; // adjust index after removal
      }
    }

    if (weekMatches.length > 0) {
      gameweeks.push({
        gameweek: weekIndex,
        matches: weekMatches,
      });
      weekIndex++;
    } else {
      break;
    }
  }

  return { groups, gameweeks };
}

async function addLeagueData(prevState, formData) {
  const isThereLeague = await isThereLeagueRepository();
  if (isThereLeague.isThereLeague) {
    return {
      success: false,
      message:
        "there is already a league created you need to get the admins approvement",
    };
  }
  try {
    const groupStageString = formData.get("groupStage");
    // Add error handling and JSON parsing
    if (!groupStageString) {
      return { success: false, error: "No groupStage data provided" };
    }
    let groupStage;
    try {
      groupStage = JSON.parse(groupStageString);
    } catch (error) {
      return { success: false, error: "Invalid JSON in groupStage data" };
    }
    // Add additional validation
    if (!groupStage.groups || !groupStage.gameweeks) {
      return { success: false, error: "Invalid groupStage structure" };
    }

    // 1️⃣ Create Gameweeks first and get their IDs
    const gameweekIds = {};
    for (let i = 0; i < groupStage.gameweeks.length; i++) {
      const gameweek = groupStage.gameweeks[i];
      const gameweekData = await addGameweekQuery(
        gameweek.gameweek_number || i + 1
      );
      gameweekIds[i] = gameweekData.id; // Store the gameweek ID using index as key
    }

    // 2️⃣ Groups
    const groups = Object.values(groupStage.groups).map((g) => ({
      name: g.group_name,
      teams: g.teams, // jsonb column, can store full object
    }));

    // 3️⃣ Matches with gameweek_id
    const matches = groupStage.gameweeks.flatMap((gw, gameweekIndex) =>
      gw.matches.map((m) => ({
        team1: m.home.id,
        team2: m.away.id,
        stage: m.group,
        gameweek_id: gameweekIds[gameweekIndex], // Add the gameweek ID
        match_date: null, // set later if needed
      }))
    );

    // Call repository function directly with data
    const [matchesResult, groupsResult] = await addLeagueDataRepository(
      matches,
      groups
    );

    return {
      success: true,
      message: "League data added successfully!",
      groupsResult,
      matchesResult,
      gameweekIds, // Include gameweek IDs in response
    };
  } catch (error) {
    console.error("Error adding league data:", error);
    return {
      success: false,
      error: error.message || "An error occurred while adding league data",
    };
  }
}

async function addMatchDate(prevState, formData) {
  return await addMatchDateRepository(prevState, formData);
}

// Updated addScoreData function
async function addScoreData(prevState, formData) {
  const player = formData.get("player");
  const event = formData.get("event"); // Goal or Assist
  const selectedTeamId = formData.get("team");
  const team1Id = formData.get("team1Id");
  const team2Id = formData.get("team2Id");
  const teamPlayersData = JSON.parse(formData.get("teamPlayersData") || "[]");

  const matchDataResult = await getMatchDataRepository(formData.get("matchId"));
  // getMatchDataQuery returns an array, so we need the first element
  const matchData = Array.isArray(matchDataResult)
    ? matchDataResult[0]
    : matchDataResult;

  console.log("Raw matchData from repository:", matchData);

  // Parse existing goals and assists for both teams
  // The JSONB columns are returned as strings, so we need to parse them
  let team1Goals = [];
  let team2Goals = [];
  let team1Assists = [];
  let team2Assists = [];

  try {
    // Parse team 1 goals
    if (matchData?.team_1_goals) {
      const parsed =
        typeof matchData.team_1_goals === "string"
          ? JSON.parse(matchData.team_1_goals)
          : matchData.team_1_goals;
      team1Goals = Array.isArray(parsed) ? [...parsed] : [];
    }

    // Parse team 2 goals
    if (matchData?.team_2_goal) {
      const parsed =
        typeof matchData.team_2_goal === "string"
          ? JSON.parse(matchData.team_2_goal)
          : matchData.team_2_goal;
      team2Goals = Array.isArray(parsed) ? [...parsed] : [];
    }

    // Parse team 1 assists
    if (matchData?.team_1_assists) {
      const parsed =
        typeof matchData.team_1_assists === "string"
          ? JSON.parse(matchData.team_1_assists)
          : matchData.team_1_assists;
      team1Assists = Array.isArray(parsed) ? [...parsed] : [];
    }

    // Parse team 2 assists
    if (matchData?.team_2_assists) {
      const parsed =
        typeof matchData.team_2_assists === "string"
          ? JSON.parse(matchData.team_2_assists)
          : matchData.team_2_assists;
      team2Assists = Array.isArray(parsed) ? [...parsed] : [];
    }
  } catch (error) {
    console.error("Error parsing match data:", error);
  }

  console.log("Parsed existing data:", {
    team1Goals,
    team2Goals,
    team1Assists,
    team2Assists,
  });

  // Get player name
  const playerData = teamPlayersData.find(
    (p) => String(p.id) === String(player)
  );
  const playerName = playerData?.name || "Unknown Player";

  console.log("playerData", playerData);

  // Create new event object for each goal/assist
  const newEvent = {
    playerId: player,
    playerName,
  };

  // Determine which team and event type, then add to the appropriate array
  if (String(selectedTeamId) === String(team1Id)) {
    if (event === "Goal") {
      team1Goals.push(newEvent);
    } else if (event === "Assist") {
      team1Assists.push(newEvent);
    }
  } else if (String(selectedTeamId) === String(team2Id)) {
    if (event === "Goal") {
      team2Goals.push(newEvent);
    } else if (event === "Assist") {
      team2Assists.push(newEvent);
    }
  }

  console.log("Updated arrays before setting formData:", {
    team1Goals,
    team2Goals,
    team1Assists,
    team2Assists,
  });

  // Set all score data in formData
  formData.set("team1Goals", JSON.stringify(team1Goals));
  formData.set("team2Goals", JSON.stringify(team2Goals));
  formData.set("team1Assists", JSON.stringify(team1Assists));
  formData.set("team2Assists", JSON.stringify(team2Assists));

  return await addScoreRepository(prevState, formData);
}

async function updateScoreData(prevState, formData) {
  const matchId = formData.get("matchId");
  const scoreData = formData.get("scoreData");

  try {
    const result = await updateScoreDataRepository(matchId, scoreData);

    if (result.error) {
      return { success: false, message: result.error };
    }

    return { success: true, message: "Score data updated successfully" };
  } catch (error) {
    console.error("Error updating score data:", error);
    return { success: false, message: "Failed to update score data" };
  }
}

export {
  getAllTeams,
  getTeamData,
  updateReportType,
  getPlayerTeam,
  getTeamPlayers,
  getPlayerData,
  getBestAwards,
  addVote,
  getVote,
  getUserData,
  deleteAccount,
  getStudents,
  createGroupStage,
  addLeagueData,
  addMatchDate,
  addScoreData,
  updateScoreData,
};
