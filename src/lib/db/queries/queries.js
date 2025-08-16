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

export { getAllTeamsQuery };
