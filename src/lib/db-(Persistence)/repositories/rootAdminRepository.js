import {
  addAdminQuery,
  addModeratorQuery,
  deleteAdminQuery,
  deleteModeratorQuery,
  getReportsQuery,
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

export {
  createAdminRepository,
  deleteAdminRepository,
  getReportsRepository,
  createModeratorRepsitory,
  deleteModeratorRepsitory,
};
