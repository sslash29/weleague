import { supabase } from "@/lib/supabase";
import { toNumber } from "@/utils/toNumber";
import { revalidatePath } from "next/cache";

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

  // Parse existing data (if null, start with empty array)
  let existingData = [];
  if (playerData.weekly_data_points) {
    try {
      existingData = JSON.parse(playerData.weekly_data_points);
    } catch {
      existingData = [];
    }
  }

  // Parse the new weeklyData
  const parsedWeeklyData = JSON.parse(weeklyData);

  // Add a timestamp (ISO string for consistency)
  const entryWithDate = {
    date: new Date().toISOString(), // e.g. "2025-08-20T11:45:30.123Z"
    data: parsedWeeklyData,
  };

  // Append the new entry
  existingData.push(entryWithDate);

  // Save back to Supabase
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
  console.log(playerId);

  //* Get Player Data first
  const { data: playerData, error: playerError } = await supabase
    .from("player")
    .select("points_all_time")
    .eq("id", playerId)
    .single();

  const pointsOfAllTime = playerData?.points_all_time
    ? toNumber(playerData.points_all_time) + toNumber(totalPoints)
    : toNumber(totalPoints);
  console.log(pointsOfAllTime, playerData);
  const { _, error } = await supabase
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

async function updateTeamWeeklyPointsQuery() {}
async function updateTeamPointsThisWeekQuery() {}
async function updateTeamPointsAllTimeQuery() {}
async function updateTeamAllTimeData() {}
async function getTeamPlayers(teamId) {
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
};
