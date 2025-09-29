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
  const team1Score = formData.get("team1Score") || null;
  const team2Score = formData.get("team2Score") || null;
  const teamPlayersData = JSON.parse(formData.get("teamPlayersData") || "[]");

  // Fetch both team data
  const [selectedTeamData, team1Data, team2Data] = await Promise.all([
    getTeamData(selectedTeamId),
    getTeamData(team1Id),
    getTeamData(team2Id),
  ]);

  console.log("Selected Team:", selectedTeamData);
  console.log("Team 1:", team1Data);
  console.log("Team 2:", team2Data);

  // Ensure stats is an array
  const oldScoreData = Array.isArray(selectedTeamData?.stats)
    ? selectedTeamData.stats
    : [];

  // Find if teams array already exists in the last entry
  let teamsArray = [];
  if (oldScoreData.length > 0) {
    const lastEntry = oldScoreData[oldScoreData.length - 1];
    if (lastEntry.teams) {
      teamsArray = lastEntry.teams;
    }
  }

  // Find the selected team in the teams array or create new team objects
  let team1Entry = teamsArray.find((t) => t.teamId === team1Id) || {
    teamId: team1Id,
    teamName: team1Data.name,
    score: team1Score,
    data: [],
  };

  let team2Entry = teamsArray.find((t) => t.teamId === team2Id) || {
    teamId: team2Id,
    teamName: team2Data.name,
    score: team2Score,
    data: [],
  };

  // Get player name from the player ID
  const playerData = teamPlayersData.find((p) => p.id === player);
  const playerName = playerData?.name || "Unknown Player";

  // Add the new player event to the selected team's data array
  if (selectedTeamId === team1Id) {
    team1Entry.data.push({
      playerId: player,
      playerName: playerName,
      event: event,
    });
    team1Entry.score = team1Score; // Update score
  } else if (selectedTeamId === team2Id) {
    team2Entry.data.push({
      playerId: player,
      playerName: playerName,
      event: event,
    });
    team2Entry.score = team2Score; // Update score
  }

  // Build new entry with updated teams
  const newEntry = {
    teams: [team1Entry, team2Entry],
  };

  // Replace or append the entry
  const updatedScoreData =
    oldScoreData.length > 0 && oldScoreData[oldScoreData.length - 1].teams
      ? [...oldScoreData.slice(0, -1), newEntry]
      : [...oldScoreData, newEntry];

  // Add to formData
  formData.append("scoreData", JSON.stringify(updatedScoreData));

  return await addScoreRepository(prevState, formData);
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
};
