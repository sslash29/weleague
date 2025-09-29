"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
async function getAllTeamsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team").select("*");
  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
  return data;
}

async function getTeamDataQuery(teamId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team")
    .select("*")
    .eq("id", teamId)
    .single();
  if (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
  return data;
}

async function updateReportTypeQuery(prevState, formData) {
  const supabase = await createClient();
  const reportId = formData.get("reportId");
  const reportType = formData.get("type");

  formData;

  const { error } = await supabase
    .from("report")
    .update({ state: reportType })
    .eq("id", reportId);

  if (error) {
    console.error("Error updating report type:", error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Report type updated successfully",
  };
}

async function getRulePointsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rules").select("*");
  if (error) {
    console.error("Error fetching rule points:", error);
    return [];
  }
  return data;
}

async function getPlayerTeamQuery(playerId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player")
    .select("team_id")
    .eq("id", playerId);

  if (error) {
    console.error("Error fetching player team:", error);
    return null;
  }
  return data;
}

async function getCurrentGameweekQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gameweek")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching latest gameweek:", error);
    return null;
  }
  return data;
}

async function getAllGameWeeksQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("gameweek").select("*");

  if (error) {
    console.error("Error fetching all gameweeks:", error);
    return [];
  }
  return data;
}

async function getTeamPlayersQuery(teamId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player")
    .select("*")
    .eq("team_id", teamId);

  if (error) {
    console.error("Error fetching team players:", error);
    return [];
  }
  return data;
}

async function getPlayerDataQuery(playerId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player")
    .select("*")
    .eq("id", playerId)
    .single();

  if (error) {
    console.error("Error fetching player data:", error);
    return null;
  }
  return data;
}

async function getBestGoalVideoQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("best_award")
    .select(
      `
      *,
      player:player_id (
        full_name,
        player_image,
        team:team_id (
          name
        )
      )
    `
    )
    .eq("award_type", "bestGoal");

  if (error) {
    console.error("Error fetching best goal videos:", error);
    return [];
  }
  return data;
}

async function getBestAssistVideoQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("best_award")
    .select(
      `
      *,
      player:player_id (
        full_name,
        player_image,
        team:team_id (
          name
        )
      )
    `
    )
    .eq("award_type", "bestAssist");

  if (error) {
    console.error("Error fetching best assist videos:", error);
    return [];
  }
  return data;
}

async function getBestTackleVideoQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("best_award")
    .select(
      `
      *,
      player:player_id (
        full_name,
        player_image,
        team:team_id (
          name
        )
      )
    `
    )
    .eq("award_type", "bestTackle");

  if (error) {
    console.error("Error fetching best tackle videos:", error);
    return [];
  }
  return data;
}

async function addVoteQuery(prevState, formData) {
  const supabase = await createClient();
  const userFullName = formData.get("fullName");
  const awardId = formData.get("awardId");
  const studentId = formData.get("studentId");
  const prevVote = formData.get("prevVote");
  const prevAwardId = formData.get("prevAwardId");
  formData;
  if (!awardId) {
    return {
      success: false,
      message: "Award ID is required",
    };
  }

  const { data, error } = await supabase
    .from("best_award")
    .select("no_of_votes")
    .eq("id", awardId);

  if (prevVote.length > 1) {
    const { error } = await supabase
      .from("best_award")
      .update({
        no_of_votes: data[0].no_of_votes === 0 ? 0 : data[0].no_of_votes - 1,
      })
      .eq("id", prevAwardId);

    const { data: updateData, error: bestAwardVoteNumberError } = await supabase
      .from("best_award")
      .update({ no_of_votes: data[0].no_of_votes + 1 })
      .eq("id", awardId)
      .select();

    const { error: deleteVoteError } = await supabase
      .from("votes_assignment")
      .delete()
      .eq("id", prevVote);
    const { _, error: votingAssignmentError } = await supabase
      .from("votes_assignment")
      .insert({
        student_id: studentId,
        award_id: awardId,
      });
    return {
      success: true,
      message: "Vote updated successfully",
    };
  }
  // ✅ Increment no_of_vote
  const { data: updateData, error: bestAwardVoteNumberError } = await supabase
    .from("best_award")
    .update({ no_of_votes: data[0].no_of_votes + 1 })
    .eq("id", awardId)
    .select();

  if (bestAwardVoteNumberError) {
    throw new Error(bestAwardVoteNumberError);

    return {
      success: false,
      message: bestAwardVoteNumberError.message,
    };
  }

  const { _, error: votingAssignmentError } = await supabase
    .from("votes_assignment")
    .insert({
      student_id: studentId,
      award_id: awardId,
    });

  if (votingAssignmentError) {
    throw new Error(JSON.stringify(votingAssignmentError));
    return {
      success: false,
      message: votingAssignmentError.message,
    };
  }

  return {
    success: true,
    message: "Vote added successfully",
    updatedAward: updateData,
  };
}

async function getVoteQuery(student_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("votes_assignment")
    .select("*, best_award:best_award(award_type, id)")
    .eq("student_id", student_id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return data;
}

async function getUserDataQuery(studentId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student")
    .select("full_name, phone_number, email, class")
    .eq("auth_user_id", studentId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  console.log(data);
  return data;
}

async function deleteAccountQuery(prevState, formData) {
  const userID = formData.get("userId");

  if (!userID) {
    return { success: false, message: "Missing userId" };
  }

  // Make sure this client is created with the service role key
  const supabase = await createClient();

  const { error } = await supabase.auth.admin.deleteUser(userID);

  if (error) {
    console.error("❌ Failed to delete user:", error); // logs the full object
    return { success: false, message: error.message, status: error.status };
  }

  console.log("✅ User deleted:", userID);
  redirect("/");
}

async function getStudentsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("student").select("*");

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return data;
}

async function addGroupQuery(groups) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("group").insert(groups).select();

  if (error) throw new Error(error.message);
  return data;
}

async function addMatchQuery(matches) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("match").insert(matches).select();

  if (error) throw new Error(error.message);
  return data;
}

async function addMatchDateQuery(prevState, formData) {
  const supabase = await createClient();
  const date = formData.get("matchDate");
  const matchId = formData.get("matchId");
  console.log(formData);
  const { data, error } = await supabase
    .from("match")
    .update({
      match_date: date,
    })
    .eq("id", matchId)
    .single();
  console.log(data);
  if (error) throw new Error(error.message);
  return {
    success: true,
    message: "sucessfully updated date of match",
  };
}

async function getMatchesQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match")
    .select("*")
    .order("gameweek_id"); // Order by gameweek for better organization
  if (error) throw new Error(error.message);
  return data;
}

async function getGroupsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("group").select("*");
  if (error) throw new Error(error.message);
  return data;
}

async function addGameweekQuery(gameweekNumber) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gameweek")
    .insert({
      gameweek_number: gameweekNumber,
    })
    .select() // Add select to get the inserted data
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function getGameWeekQuery() {
  const supabase = await createClient();
  const { data: gameweeksData, error } = await supabase
    .from("gameweek")
    .select("*")
    .order("gameweek_number");

  if (error) throw new Error(error.message);
  return gameweeksData;
}

// this adds the score and the winner
async function addScoreQuery(prevState, formData) {
  const supabase = await createClient();
  const scoreData = formData.get("scoreData");
  const winner = formData.get("winner") || null;
  const matchId = formData.get("matchId");
  console.log(formData);
  const { data, error } = await supabase
    .from("match")
    .update({
      winner,
      stats: scoreData,
    })
    .eq("id", matchId);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "updated score sucessfully" };
}



export {
  getAllTeamsQuery,
  getTeamDataQuery,
  updateReportTypeQuery,
  getTeamPlayersQuery,
  getRulePointsQuery,
  getPlayerTeamQuery,
  getCurrentGameweekQuery,
  getAllGameWeeksQuery,
  getPlayerDataQuery,
  getBestTackleVideoQuery,
  getBestAssistVideoQuery,
  getBestGoalVideoQuery,
  addVoteQuery,
  getVoteQuery,
  getUserDataQuery,
  deleteAccountQuery,
  getStudentsQuery,
  addGroupQuery,
  addMatchQuery,
  addMatchDateQuery,
  getMatchesQuery,
  getGroupsQuery,
  addGameweekQuery,
  getGameWeekQuery,
  addScoreQuery,
};
