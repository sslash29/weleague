import { supabase } from "@/lib/supabase";

async function addPlayerrQuery(prevState, formData) {
  const fullName = formData.get("fullName");
  const playerImg = formData.get("playerImg"); // File
  // UI may send either `position` or `playerType`; prefer `position` if present
  const playerType = formData.get("position") || formData.get("playerType");

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
  const playerId = formData.get("playerId");

  const { error } = await supabase.from("player").delete().eq("id", playerId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Player deleted successfully",
  };
}

async function addTeamQuery(prevState, formData) {
  const teamName = formData.get("teamName");
  const teamCrestImg = formData.get("teamCrestImg");

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

  const { error } = await supabase.from("team").insert({
    name: teamName,
    team_img: teamCrestImg,
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

  const { error } = await supabase.from("team").delete().eq("id", teamId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

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
  const weeklyData = formData.get("weeklyData");
  const playerId = formData.get("playerId");

  const { _, error } = await supabase
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
    message: "Player Updated Successfully",
  };
}

async function updatePlayerWeeklyPointsQuery(prevState, formData) {
  const weeklyData = formData.get("weeklyData");
  const playerId = formData.get("playerId");

  const { _, error } = await supabase
    .from("player")
    .update({
      weekly_points: weeklyData,
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
  const pointsOfAllTime = formData.get("pointsOfAllTime");
  const playerId = formData.get("playerId");

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
};
