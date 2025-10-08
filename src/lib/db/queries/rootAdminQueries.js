"use server";

import { createClient } from "@/utils/supabase/server";

async function addAdminQuery(prevState, formData) {
  const supabase = await createClient();
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");

  const { _, error } = await supabase.from("admin").insert({
    username,
    password,
    phone_number: phoneNumber,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Admin added successfully" };
}

async function deleteAdminQuery(prevState, formData) {
  const supabase = await createClient();
  const adminId = formData.get("adminId");
  const { _, error } = await supabase.from("admin").delete().eq("id", adminId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Admin deleted successfully" };
}

async function getAllAdminsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin").select("*");
  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function getReportsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("report")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function addModeratorQuery(prevState, formData) {
  const supabase = await createClient();
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");

  const { _, error } = await supabase.from("moderator").insert({
    username,
    password,
    phone_number: phoneNumber,
  });

  if (error) return { success: false, message: error.message };

  return { success: true, message: "Moderator Added Successfully" };
}

async function deleteModeratorQuery(prevState, formData) {
  const supabase = await createClient();
  const moderatorId = formData.get("moderatorId");
  const { _, error } = await supabase
    .from("moderator")
    .delete()
    .eq("id", moderatorId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Moderator deleted successfully" };
}

async function getTeamsYellowCardsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team").select("yellow_cards");

  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function getTeamsRedCardsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team").select("red_cards");

  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function getAllReportsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("report").select("*");

  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function getAllModeratorsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("moderator").select("*");

  if (error) {
    return { success: false, message: error.message };
  }

  return data;
}

async function deleteStudentQuery(prevState, formData) {
  const supabase = await createClient();
  const studentId = formData.get("studentId");
  console.log(studentId);

  const { _, error } = await supabase
    .from("student")
    .delete()
    .eq("id", studentId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Student deleted successfully" };
}

async function viewMostUsedPlayerQuery() {
  const supabase = await createClient();

  // 1. Get all assignments
  const { data: assignments, error: assignmentError } = await supabase
    .from("players_assignemnt")
    .select("player_id");

  if (assignmentError) {
    console.error("Error fetching assignments:", assignmentError);
    return null;
  }

  if (!assignments || assignments.length === 0) {
    return null; // no data
  }

  // 2. Count usage
  const usageMap = {};
  for (const row of assignments) {
    if (!row.player_id) continue;
    usageMap[row.player_id] = (usageMap[row.player_id] || 0) + 1;
  }

  // 3. Find most used player_id
  let mostUsedId = null;
  let maxCount = 0;
  for (const [playerId, count] of Object.entries(usageMap)) {
    if (count > maxCount) {
      mostUsedId = playerId;
      maxCount = count;
    }
  }

  if (!mostUsedId) return null;

  // 4. Fetch full player data
  const { data: playerData, error: playerError } = await supabase
    .from("player")
    .select("*")
    .eq("id", mostUsedId)
    .single();

  if (playerError) {
    console.error("Error fetching player data:", playerError);
    return null;
  }

  // 5. Return player + usage count
  return {
    ...playerData,
    usage_count: maxCount,
  };
}

async function updateRulePointsQuery(prevState, formData) {
  const supabase = await createClient();
  const rulesPointsString = formData.get("rulePoints");
  const rulesPoints = JSON.parse(rulesPointsString);

  // Remove id and created_at - they'll be auto-generated by the database
  const { id, created_at, ...insertData } = rulesPoints;

  const { data, error } = await supabase.from("rules").insert(insertData);

  if (error) throw new Error(error.message);
  return { data };
}

export {
  addAdminQuery,
  deleteAdminQuery,
  getAllAdminsQuery,
  getReportsQuery,
  addModeratorQuery,
  deleteModeratorQuery,
  getTeamsYellowCardsQuery,
  getTeamsRedCardsQuery,
  getAllReportsQuery,
  getAllModeratorsQuery,
  deleteStudentQuery,
  viewMostUsedPlayerQuery,
  updateRulePointsQuery,
};
