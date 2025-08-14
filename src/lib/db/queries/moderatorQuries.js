import { supabase } from "@/lib/supabase";

async function addPlayerrQuery(prevState, formData) {
  const fullName = formData.get("fullName");
  const playerImg = formData.get("playerImg");
  const playerType = formData.get("playerType");

  const { _, error } = supabase.from("player").insert({
    full_name: fullName,
    player_image: playerImg,
    player_type: playerType,
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

  const { _, error } = supabase.from("player").delete().eq("id", playerId);

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

async function addTeamrQuery(prevState, formData) {
  const teamName = formData.get("teamName");
  const teamCrestImg = formData.get("teamCrestImg");

  const { _, error } = supabase.from("team").insert({
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

async function deleteTeamrQuery(prevState, formData) {
  const teamId = formData.get("teamId");

  const { _, error } = supabase.from("team").delete().eq("id", teamId);

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

  const { _, error } = supabase.from("student").delete().eq("id", studentId);

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

export {
  addPlayerrQuery,
  deletePlayerrQuery,
  addTeamrQuery,
  deleteTeamrQuery,
  getStudentsQuery,
  deleteStudentQuery,
  updatePlayerWeeklyDataQuery,
  updatePlayerWeeklyPointsQuery,
  updatePlayerPointsAllTimeQuery,
};
