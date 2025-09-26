"use server";

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

async function createGroupStage() {
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

    console.log(groupStage);

    // 1️⃣ Groups
    const groups = Object.values(groupStage.groups).map((g) => ({
      name: g.group_name,
      teams: g.teams, // jsonb column, can store full object
    }));

    // 2️⃣ Matches
    const matches = groupStage.gameweeks.flatMap((gw) =>
      gw.matches.map((m) => ({
        team1: m.home.id,
        team2: m.away.id,
        stage: m.group,
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
    };
  } catch (error) {
    console.error("Error adding league data:", error);
    return {
      success: false,
      error: error.message || "An error occurred while adding league data",
    };
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
};
