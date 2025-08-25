"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function createStudentQuery(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const phone = formData.get("phoneNumber");
  const password = formData.get("password");
  const displayName = formData.get("fullName");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName ?? undefined,
        phone_number: phone || "",
      },
    },
  });
  if (error) {
    throw new Error(error.message || "Sign up failed");
  }
  return {
    success: false,
    message: "Go and confirm you email",
  };
}

async function logInQuery(prevState, formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: "Invalid credentials" };
  }

  // login succeeded
  if (data?.user) {
    redirect("/"); // ✅ correct usage
  }

  return { success: false, message: "Unexpected login error" };
}

async function getUserQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return {
      success: false,
      message: "your not logged in ",
    };
  }
  return data;
}

async function signOutQuery() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Log out failed");
  }
  return { success: true, message: "logged out sucessfully" };
}

export { createStudentQuery, getUserQuery, logInQuery, signOutQuery };
