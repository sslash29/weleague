import {
  addAdminQuery,
  addModeratorQuery,
  deleteAdminQuery,
  deleteModeratorQuery,
  getAllReports,
  getReportsQuery,
  getTeamsRedCardsQuery,
  getTeamsYellowCardsQuery,
} from "../queries/rootAdminQueries";

async function createAdminRepository(prevState, formData) {
  const data = await addAdminQuery(prevState, updatedFormData);
  return data;
}

async function deleteAdminRepository(prevState, formData) {
  const data = await deleteAdminQuery(prevState, formData);
  return data;
}

async function getReportsRepository() {
  const data = await getReportsQuery();
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
  const data = await getAllReports();
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
};
