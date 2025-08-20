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
    .eq("id", teamId);
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
export {
  getAllTeamsQuery,
  getTeamDataQuery,
  updateReportTypeQuery,
  getRulePointsQuery,
};
