"use server";

import { getRulePointsRepository } from "@/lib/db/repositories/repositories";
import {
  createAdminRepository,
  createModeratorRepsitory,
  deleteAdminRepository,
  deleteModeratorRepsitory,
  deleteStudentRepository,
  getAllAdminsRepository,
  getAllModeratorsRepository,
  getAllReportsRepository,
  getSuspentionStatisticsRepository,
  updateRulePointsRepository,
  viewMostUsedPlayerRepository,
} from "@/lib/db/repositories/rootAdminRepository";
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

async function getAllAdmins() {
  const data = getAllAdminsRepository();
  return data;
}

async function getAllModerators() {
  const data = await getAllModeratorsRepository();
  return data;
}

async function getReports() {
  const data = await getAllReportsRepository();
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

async function getSuspentionStatistics() {
  const data = await getSuspentionStatisticsRepository();
  return data;
}

async function getAllReports() {
  const data = await getAllReportsRepository();
  return data;
}

async function deleteStudent(prevState, formData) {
  return await deleteStudentRepository(prevState, formData);
}

async function viewMostUsedPlayer() {
  return await viewMostUsedPlayerRepository();
}

async function getRulePoints() {
  return await getRulePointsRepository();
}

async function updateRulePoints(prevState, formData) {
  return await updateRulePointsRepository(prevState, formData);
}

export {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  getReports,
  createModerator,
  deleteModerator,
  getSuspentionStatistics,
  getAllReports,
  getAllModerators,
  deleteStudent,
  viewMostUsedPlayer,
  getRulePoints,
  updateRulePoints,
};
