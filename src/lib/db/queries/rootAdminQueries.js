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

  const { _, error } = await supabase
    .from("student")
    .delete()
    .eq("id", studentId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Student deleted successfully" };
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
};
