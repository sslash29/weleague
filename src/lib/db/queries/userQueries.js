"use server";

import { createClient } from "@/utils/supabase/server";

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
      team, // if `team` column is jsonb, Supabase will accept JSON.parse(team)
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

export {
  createReportQuery,
  addPlayerToAssignmentQuery,
  addPlayerToStudentTeamQuery,
  getStudentTeamQuery,
};
