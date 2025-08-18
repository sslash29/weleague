"use server";

import { supabase } from "@/lib/supabase";

async function createReportQuery(prevState, formData) {
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

export { createReportQuery };
