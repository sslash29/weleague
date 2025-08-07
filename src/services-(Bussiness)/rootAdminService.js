import {
  createAdminRepository,
  createModeratorRepsitory,
  deleteAdminRepository,
  deleteModeratorRepsitory,
  getReportsRepository,
} from "@/lib/db-(Persistence)/repositories/rootAdminRepository";
import bcrypt from "bcrypt";

async function createAdmin(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");

  const hashedPassword = await bcrypt.hash(password, 13);
  const updatedFormData = new FormData();
  updatedFormData.set("username", username);
  updatedFormData.set("password", hashedPassword);
  updatedFormData.set("phoneNumber", phoneNumber);
  const data = await createAdminRepository(prevState, updatedFormData);
  return data;
}

async function deleteAdmin(prevState, formData) {
  const data = await deleteAdminRepository(prevState, formData);
  return data;
}

async function getReports() {
  const data = await getReportsRepository();
  return data;
}

async function createModerator(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");

  const hashedPassword = await bcrypt.hash(password, 13);
  const updatedFormData = new FormData();
  updatedFormData.set("username", username);
  updatedFormData.set("password", hashedPassword);
  updatedFormData.set("phoneNumber", phoneNumber);
  const data = await createModeratorRepsitory(prevState, updatedFormData);
  return data;
}

async function deleteModerator(prevState, formData) {
  const data = await deleteModeratorRepsitory(prevState, formData);
  return data;
}
export {
  createAdmin,
  deleteAdmin,
  getReports,
  createModerator,
  deleteModerator,
};
