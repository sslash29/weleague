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
    phone,
    name: displayName,
  });
  if (error) {
    throw new Error(error.message || "Sign up failed");
  }
  return {
    success: false,
    message: "Go and confirm you email",
  };
}

export { createStudentQuery };
