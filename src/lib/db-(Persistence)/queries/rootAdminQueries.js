import { supabase } from "@/lib/supabase";

async function addAdminQuery(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");

  const { data, error } = await supabase.from("admin").insert({
    username,
    password,
    phone_number: phoneNumber,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Admin added successfully",
  };
}

async function deleteAdminQuery(prevState, formData) {
  const adminId = formData.get("adminId");
  const { data, error } = await supabase
    .from("admin")
    .delete()
    .eq("id", adminId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Admin deleted successfully",
  };
}

async function getReportsQuery() {
  const { data, error } = await supabase
    .from("report")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return data;
}

async function addModeratorQuery(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");
  const { data, error } = await supabase.from("moderator").insert({
    username,
    password,
    phone_number: phoneNumber,
  });

  if (error)
    return {
      success: false,
      message: error.message,
    };

  return {
    success: true,
    message: "Moderator Added Successfully",
  };
}

async function deleteModeratorQuery(prevState, formData) {
  const moderatorId = formData.get("moderatorId");
  const { data, error } = await supabase
    .from("moderator")
    .delete()
    .eq("id", moderatorId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Moderator deleted successfully",
  };
}

export {
  addAdminQuery,
  deleteAdminQuery,
  getReportsQuery,
  addModeratorQuery,
  deleteModeratorQuery,
};
