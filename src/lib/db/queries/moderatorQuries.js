import { supabase } from "@/lib/supabase";
import { toNumber } from "@/utils/toNumber";
import { revalidatePath } from "next/cache";

// --- Helpers for team data shape management ---
// Normalize stored JSON (string) to an object keyed by GameWeekX.
// We previously stored arrays like [{ GameWeek3: {...} }]; convert that to an object.
function normalizeGameweekStore(raw) {
  if (!raw) return {};
  let parsed;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }

  // If it's already an object keyed by GameWeek{n}, keep it
  if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
    return parsed;
  }

  // If it's an array of single-key objects, merge into a single object
  if (Array.isArray(parsed)) {
    const obj = {};
    for (const entry of parsed) {
      if (entry && typeof entry === "object") {
        const key = Object.keys(entry)[0];
        if (key) obj[key] = entry[key];
      }
    }
    return obj;
  }

  return {};
}

// Ensure a gameweek entry exists with players map.
function ensureGameweek(obj, gameWeekKey) {
  if (!obj[gameWeekKey] || typeof obj[gameWeekKey] !== "object") {
    obj[gameWeekKey] = { date: new Date().toISOString(), players: {} };
  } else {
    // Ensure nested players exists
    if (
      !obj[gameWeekKey].players ||
      typeof obj[gameWeekKey].players !== "object"
    ) {
      obj[gameWeekKey].players = {};
    }
    // Always refresh date on update
    obj[gameWeekKey].date = new Date().toISOString();
  }
}

async function addPlayerrQuery(prevState, formData) {
  const fullName = formData.get("fullName");
  const playerImg = formData.get("playerImg"); // File
  // UI may send either `position` or `playerType`; prefer `position` if present
  const playerType = formData.get("position") || formData.get("playerType");
  const className = formData.get("class");
  const team = formData.get("teamId");
  console.log(team);

  if (!fullName || !playerImg || typeof playerImg === "string") {
    return {
      success: false,
      message: "Missing or invalid player data (name/image).",
    };
  }

  // Build a stable, unique path inside the bucket
  const fileExt = playerImg.name?.split(".").pop() || "bin";
  const safeName = playerImg.name?.replace(/[^a-zA-Z0-9_.-]/g, "_") || "upload";
  const filePath = `${Date.now()}-${safeName}`;

  // Upload the image to Supabase Storage
  const arrayBuffer = await playerImg.arrayBuffer();
  const { data: uploadData, error: playerImgError } = await supabase.storage
    .from("player_images")
    .upload(filePath, arrayBuffer, {
      contentType: playerImg.type || `image/${fileExt}`,
      upsert: false,
    });

  if (playerImgError) {
    return {
      success: false,
      message: playerImgError.message,
    };
  }

  // Get a public URL for the uploaded image
  const {
    data: { publicUrl: playerImgUrl },
    error: publicUrlError,
  } = supabase.storage
    .from("player_images")
    .getPublicUrl(uploadData?.path || filePath);

  if (publicUrlError) {
    return {
      success: false,
      message: publicUrlError.message,
    };
  }

  // Insert the player record
  const { error } = await supabase.from("player").insert({
    full_name: fullName,
    player_image: playerImgUrl,
    position: playerType,
    class: className,
    team_id: team,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player added successfully",
  };
}

async function deletePlayerrQuery(prevState, formData) {
  console.log(formData);
  const playerId = formData.get("playerId");
  const { error } = await supabase.from("player").delete().eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/moderator/manage-players");
  return {
    success: true,
    message: "Player deleted successfully",
  };
}

async function addTeamQuery(prevState, formData) {
  const teamName = formData.get("teamName");
  const teamCrestImg = formData.get("teamCrestImg");
  const className = formData.get("class");

  const fileExt = teamCrestImg.name?.split(".").pop() || "bin";
  const safeName =
    teamCrestImg.name?.replace(/[^a-zA-Z0-9_.-]/g, "_") || "upload";
  const filePath = `${Date.now()}-${safeName}`;

  // Upload the image to Supabase Storage
  const arrayBuffer = await teamCrestImg.arrayBuffer();
  const { data: uploadData, error: teamCrestImgError } = await supabase.storage
    .from("team_crest_images")
    .upload(filePath, arrayBuffer, {
      contentType: teamCrestImg.type || `image/${fileExt}`,
      upsert: false,
    });

  if (teamCrestImgError) {
    return {
      success: false,
      message: teamCrestImgError.message,
    };
  }

  // Get a public URL for the uploaded image
  const {
    data: { publicUrl: teamCrestImgUrl },
    error: publicUrlError,
  } = supabase.storage
    .from("team_crest_images")
    .getPublicUrl(uploadData?.path || filePath);

  if (publicUrlError) {
    return {
      success: false,
      message: publicUrlError.message,
    };
  }

  const { error } = await supabase.from("team").insert({
    name: teamName,
    team_img: teamCrestImgUrl,
    class: className,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Team added successfully",
  };
}

async function deleteTeamQuery(prevState, formData) {
  const teamId = formData.get("teamId");
  console.log(formData);
  const { error } = await supabase.from("team").delete().eq("id", teamId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/moderator/manage-teams");
  return {
    success: true,
    message: "Team deleted successfully",
  };
}

async function getStudentsQuery() {
  const { data, error } = await supabase.from("student").select("*");

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return data;
}

async function deleteStudentQuery(prevState, formData) {
  const studentId = formData.get("studentId");

  const { error } = await supabase.from("student").delete().eq("id", studentId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Student deleted successfully",
  };
}

async function updatePlayerWeeklyDataQuery(prevState, formData) {
  const weeklyData = formData.get("weeklyData"); // stringified JSON
  const playerId = formData.get("playerId");
  const currentGameWeek = formData.get("currentGameWeek");

  // Get the existing weekly_data_points for the player
  const { data: playerData, error: playerError } = await supabase
    .from("player")
    .select("weekly_data_points")
    .eq("id", playerId)
    .single();

  if (playerError) {
    return {
      success: false,
      message: playerError.message,
    };
  }

  // Parse existing data (if null, start with an empty array)
  let existingData = [];
  if (playerData.weekly_data_points) {
    try {
      // It's stored as a JSON string, so we parse it.
      existingData = JSON.parse(playerData.weekly_data_points);
      // Ensure it's an array
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (e) {
      // If parsing fails, start with an empty array
      existingData = [];
    }
  }

  // Parse the new weeklyData from the form
  const parsedWeeklyData = JSON.parse(weeklyData);

  // Find the index of the entry for the current game week
  const gameWeekKey = `GameWeek${currentGameWeek}`;
  const existingEntryIndex = existingData.findIndex(
    (entry) => Object.keys(entry)[0] === gameWeekKey
  );

  if (existingEntryIndex !== -1) {
    // If an entry for the current game week exists, update it
    existingData[existingEntryIndex] = {
      [gameWeekKey]: {
        date: new Date().toISOString(),
        data: parsedWeeklyData,
      },
    };
  } else {
    // If no entry exists, append a new one
    existingData.push({
      [gameWeekKey]: {
        date: new Date().toISOString(),
        data: parsedWeeklyData,
      },
    });
  }

  // Save the updated array back to Supabase
  const { error } = await supabase
    .from("player")
    .update({
      weekly_data_points: JSON.stringify(existingData),
    })
    .eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player Updated Successfully",
  };
}

async function updatePlayerWeeklyPointsQuery(prevState, formData) {
  const totalPoints = formData.get("totalPoints");
  const playerId = formData.get("playerId");

  const { _, error } = await supabase
    .from("player")
    .update({
      point_this_week: totalPoints,
    })
    .eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player Updated Successfully",
  };
}

async function updatePlayerPointsAllTimeQuery(prevState, formData) {
  const totalPoints = formData.get("totalPoints");
  const playerId = formData.get("playerId");
  const currentGameWeek = formData.get("currentGameWeek");

  // 1. Get weekly_data_points
  const { data: playerWeekly, error: weeklyError } = await supabase
    .from("player")
    .select("weekly_data_points")
    .eq("id", playerId)
    .single();

  if (weeklyError) {
    return {
      success: false,
      message: weeklyError.message,
    };
  }

  let lastRecordedGameWeek = null;

  if (playerWeekly?.weekly_data_points) {
    try {
      const parsed = JSON.parse(playerWeekly.weekly_data_points);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const lastEntry = parsed[parsed.length - 1];
        lastRecordedGameWeek = Object.keys(lastEntry)[0]; // e.g. "GameWeek3"
      }
    } catch {
      lastRecordedGameWeek = null;
    }
  }

  // 2. Get existing all-time points
  const { data: playerData, error: playerError } = await supabase
    .from("player")
    .select("points_all_time")
    .eq("id", playerId)
    .single();

  if (playerError) {
    return {
      success: false,
      message: playerError.message,
    };
  }

  let pointsOfAllTime = toNumber(playerData?.points_all_time);

  // 3. Decide whether to add or just update
  const gameWeekKey = `GameWeek${currentGameWeek}`;
  if (lastRecordedGameWeek === gameWeekKey) {
    // Same gameweek → just overwrite (no addition)
    pointsOfAllTime = totalPoints; // no change
  } else {
    // New gameweek → add
    pointsOfAllTime += toNumber(totalPoints);
  }

  // 4. Update
  const { error } = await supabase
    .from("player")
    .update({
      points_all_time: pointsOfAllTime,
    })
    .eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player Updated Successfully",
  };
}

async function getAllPlayersQuery() {
  const { data, error } = await supabase.from("player").select("*");
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return data;
}

async function addPlayerDataQuery(prevState, formData) {
  const playerId = formData.get("playerId");
  const weeklyData = formData.get("weeklyData");

  const { error } = await supabase
    .from("player")
    .update({
      weekly_data: weeklyData,
    })
    .eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player data added successfully",
  };
}

async function updateTeamWeeklyPointsQuery(prevState, formData) {
  const teamId = formData.get("teamId");
  const weeklyData = formData.get("weeklyData"); // stringified player's weekly data
  const totalPoints = toNumber(formData.get("totalPoints"));
  const currentGameWeek = formData.get("currentGameWeek");
  const playerId = formData.get("playerId");

  const playerName = (
    formData.get("playerName") ||
    (await getPlayerNameById(playerId)) ||
    `Player_${playerId || "unknown"}`
  ).toString();
  const gameWeekKey = `GameWeek${currentGameWeek}`;

  // 1) Fetch existing weekly_points
  const { data: teamData, error: teamError } = await supabase
    .from("team")
    .select("weekly_points")
    .eq("id", teamId)
    .single();

  if (teamError) {
    return { success: false, message: teamError.message };
  }

  const base = normalizeGameweekStore(teamData?.weekly_points);
  ensureGameweek(base, gameWeekKey);

  // 2) Update/insert this player's entry for the current gameweek
  let parsedWeeklyData = {};
  try {
    parsedWeeklyData = JSON.parse(weeklyData);
  } catch {
    parsedWeeklyData = {};
  }

  base[gameWeekKey].players[playerName] = {
    points: Number(totalPoints) || 0,
    data: parsedWeeklyData,
  };

  // 3) Save back
  const { error: updateError } = await supabase
    .from("team")
    .update({ weekly_points: JSON.stringify(base) })
    .eq("id", teamId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Team Updated Successfully" };
}

async function updateTeamPointsThisWeekQuery(prevState, formData) {
  const teamId = formData.get("teamId");
  const currentGameWeek = formData.get("currentGameWeek");
  const gameWeekKey = `GameWeek${currentGameWeek}`;

  // Read weekly_points and sum this week's players' points
  const { data: teamData, error: teamError } = await supabase
    .from("team")
    .select("weekly_points")
    .eq("id", teamId)
    .single();

  if (teamError) {
    return { success: false, message: teamError.message };
  }

  const base = normalizeGameweekStore(teamData?.weekly_points);
  const week = base[gameWeekKey];
  let weekSum = 0;
  if (week && week.players) {
    for (const p of Object.values(week.players)) {
      weekSum += Number(p?.points || 0);
    }
  }

  const { error: updateError } = await supabase
    .from("team")
    .update({ points_this_week: weekSum })
    .eq("id", teamId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Team Updated Successfully" };
}
async function updateTeamPointsAllTimeQuery(prevState, formData) {
  const teamId = formData.get("teamId");

  // 1. Read weekly_points and sum all players' points across all gameweeks
  const { data: teamData, error: teamError } = await supabase
    .from("team")
    .select("weekly_points")
    .eq("id", teamId)
    .single();

  if (teamError) {
    return { success: false, message: teamError.message };
  }

  const base = normalizeGameweekStore(teamData?.weekly_points);
  let total = 0;
  for (const gw of Object.values(base)) {
    if (gw && gw.players) {
      for (const p of Object.values(gw.players)) {
        total += Number(p?.points || 0);
      }
    }
  }

  const { error: updateError } = await supabase
    .from("team")
    .update({ points_all_time: total })
    .eq("id", teamId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Team Updated Successfully" };
}

async function updateTeamAllTimeDataQuery(prevState, formData) {
  const weeklyData = formData.get("weeklyData"); // stringified JSON
  const teamId = formData.get("teamId");
  const currentGameWeek = formData.get("currentGameWeek");
  const totalPoints = toNumber(formData.get("totalPoints"));
  const playerName = formData.get("playerName");
  const gameWeekKey = `GameWeek${currentGameWeek}`;

  // Get the existing all_time_data for the team
  const { data: teamData, error: teamError } = await supabase
    .from("team")
    .select("all_time_data")
    .eq("id", teamId)
    .single();

  if (teamError) {
    return { success: false, message: teamError.message };
  }

  const base = normalizeGameweekStore(teamData?.all_time_data);
  ensureGameweek(base, gameWeekKey);

  let parsedWeeklyData = {};
  try {
    parsedWeeklyData = JSON.parse(weeklyData);
  } catch {
    parsedWeeklyData = {};
  }

  base[gameWeekKey].players[playerName] = {
    points: Number(totalPoints) || 0,
    data: parsedWeeklyData,
  };

  // Save back to Supabase
  const { error } = await supabase
    .from("team")
    .update({ all_time_data: JSON.stringify(base) })
    .eq("id", teamId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Player Updated Successfully" };
}

async function getTeamPlayersQuery(teamId) {
  const { data, error } = await supabase
    .from("player")
    .select("*")
    .eq("team_id", teamId);
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}

async function getPlayerNameByIdQuery(playerId) {
  if (!playerId) return null;
  const { data, error } = await supabase
    .from("player")
    .select("full_name")
    .eq("id", playerId)
    .single();
  if (error) return null;
  return data?.full_name || null;
}
export {
  addPlayerrQuery,
  deletePlayerrQuery,
  addTeamQuery,
  deleteTeamQuery,
  getStudentsQuery,
  deleteStudentQuery,
  updatePlayerWeeklyDataQuery,
  updatePlayerWeeklyPointsQuery,
  updatePlayerPointsAllTimeQuery,
  getAllPlayersQuery,
  addPlayerDataQuery,
  getTeamPlayersQuery,
  updateTeamWeeklyPointsQuery,
  updateTeamPointsThisWeekQuery,
  updateTeamPointsAllTimeQuery,
  updateTeamAllTimeDataQuery,
  getPlayerNameByIdQuery,
};
