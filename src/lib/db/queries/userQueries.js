"use server";

import { createClient } from "@/utils/supabase/server";
import { formatDynamicAPIAccesses } from "next/dist/server/app-render/dynamic-rendering";

async function createReportQuery(prevState, formData) {
  const supabase = await createClient();
  const userFullName = formData.get("fullName");
  const phoneNumber = formData.get("phoneNumber");
  const problemType = formData.get("problemType");
  const problemDescription = formData.get("problemDescription");

  const { _, error } = await supabase.from("report").insert({
    student_name: userFullName,
    student_number: phoneNumber,
    report_type: problemType,
    report_text: problemDescription,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Report Submitted successfully",
  };
}

async function addPlayerToAssignmentQuery(playerId, studentId) {
  const supabase = await createClient();
  console.log("player");
  console.log(studentId, playerId);
  const { data, error } = await supabase.from("players_assignemnt").insert({
    player_id: playerId,
    student_id: studentId,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

async function addPlayerToStudentTeamQuery(formData) {
  const supabase = await createClient();
  const team = formData.get("team"); // this is now a JSON string
  const studentId = formData.get("studentId");

  const { data, error } = await supabase
    .from("student")
    .update({
      team,
    })
    .eq("auth_user_id", studentId)
    .select("team");

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

async function getStudentTeamQuery(studentId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student")
    .select("team")
    .eq("auth_user_id", studentId);

  if (error)
    return {
      success: false,
      message: error.message,
    };
  return data;
}

async function updateTeamNameQuery(newTeamName, studentId) {
  const supabase = await createClient();

  // 1. Get current team JSON
  const { data, error } = await supabase
    .from("student")
    .select("team")
    .eq("auth_user_id", studentId)
    .single(); // ensure only one row

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data || !data.team) {
    return { success: false, message: "No team found for this student" };
  }

  // 2. Parse team JSON (in case it's stored as string)
  let currentTeam;
  try {
    currentTeam =
      typeof data.team === "string" ? JSON.parse(data.team) : data.team;
  } catch (err) {
    return { success: false, message: "Invalid team JSON format" };
  }

  // 3. Update team name
  const updatedTeam = { ...currentTeam, teamName: newTeamName };

  // 4. Save back to DB
  const { data: updated, updateError } = await supabase
    .from("student")
    .update({ team: updatedTeam }) // Supabase handles JSONB
    .eq("auth_user_id", studentId)
    .select("team")
    .single();

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, team: updated.team };
}

async function applyTripleCaptainQuery(prevState, formData) {
  console.log(formData);
  const supabase = await createClient();

  const team = formData.get("team");
  const studentId = formData.get("studentId");
  const currentWeek = formData.get("currentWeek");
  const { error } = await supabase
    .from("student")
    .update({
      team,
      triple_captain_used: true,
      triple_captain_week: currentWeek,
    })
    .eq("auth_user_id", studentId);

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: "added triple captain to player succesfuly",
  };
}
async function isTripleCaptainUsedQuery(studentId) {
  const supabase = await createClient();
  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("triple_captain_used, triple_captain_week")
    .eq("auth_user_id", studentId)
    .single();

  if (studentError) throw new Error(studentError.message);
  return student;
}
export {
  createReportQuery,
  addPlayerToAssignmentQuery,
  addPlayerToStudentTeamQuery,
  getStudentTeamQuery,
  updateTeamNameQuery,
  applyTripleCaptainQuery,
  isTripleCaptainUsedQuery,
};
