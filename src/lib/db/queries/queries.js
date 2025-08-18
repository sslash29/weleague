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
export { getAllTeamsQuery, getTeamDataQuery };
