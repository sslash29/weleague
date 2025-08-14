"use server";

import {
  addAdminQuery,
  addModeratorQuery,
  deleteAdminQuery,
  deleteModeratorQuery,
  getAllAdminsQuery,
  getAllModeratorsQuery,
  getAllReportsQuery,
  getTeamsRedCardsQuery,
  getTeamsYellowCardsQuery,
} from "../queries/rootAdminQueries";

async function createAdminRepository(prevState, formData) {
  const data = await addAdminQuery(prevState, formData);
  return data;
}

async function deleteAdminRepository(prevState, formData) {
  const data = await deleteAdminQuery(prevState, formData);
  return data;
}

async function getAllAdminsRepository() {
  const data = await getAllAdminsQuery();
  return data;
}

async function getAllModeratorsRepository() {
  const data = await getAllModeratorsQuery();
  return data;
}

async function getReportsRepository() {
  const data = await getAllReportsQuery();
  return data;
}

async function createModeratorRepsitory(prevState, formData) {
  const data = await addModeratorQuery(prevState, formData);
  return data;
}

async function deleteModeratorRepsitory(prevState, formData) {
  const data = await deleteModeratorQuery(prevState, formData);
  return data;
}

async function getSuspentionStatisticsRepository() {
  const yellowCards = await getTeamsYellowCardsQuery();
  const redCards = await getTeamsRedCardsQuery();
  return { yellowCards, redCards };
}

async function getAllReportsRepository() {
  const data = await getAllReportsQuery();
  return data;
}

async function getStudentsRepository() {
  const data = await getStudentsQuery();
  return data;
}

async function deleteStudentRepository(prevState, formData) {
  const data = await deleteStudentQuery(prevState, formData);
  return data;
}
export {
  createAdminRepository,
  deleteAdminRepository,
  getReportsRepository,
  createModeratorRepsitory,
  deleteModeratorRepsitory,
  getSuspentionStatisticsRepository,
  getAllReportsRepository,
  getAllAdminsRepository,
  getAllModeratorsRepository,
  getStudentsRepository,
  deleteStudentRepository,
};
