"use server";

import { supabase } from "@/lib/supabase";

async function getAllTeamsQuery() {
  const { data, error } = await supabase.from("team").select("*");
  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
  return data;
}

async function getTeamDataQuery(teamId) {
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
  const reportId = formData.get("reportId");
  const reportType = formData.get("type");

  console.log(formData);

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
  const { data, error } = await supabase.from("rules").select("*");
  if (error) {
    console.error("Error fetching rule points:", error);
    return [];
  }
  return data;
}

async function getPlayerTeamQuery(playerId) {
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
  const { data, error } = await supabase.from("gameweek").select("*");

  if (error) {
    console.error("Error fetching all gameweeks:", error);
    return [];
  }
  return data;
}

async function getTeamPlayersQuery(teamId) {
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
};
