"use server";

import { createClient } from "@/utils/supabase/server";

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
        phone_number: phone ?? undefined,
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

async function getUserQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message || "Failed to retrieve user");
  }
  return data;
}

export { createStudentQuery, getUserQuery };
