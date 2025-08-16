import {
  addPlayerrQuery,
  addTeamQuery,
  deletePlayerrQuery,
  deleteTeamQuery,
  getAllPlayersQuery,
  updatePlayerPointsAllTimeQuery,
  updatePlayerWeeklyDataQuery,
  updatePlayerWeeklyPointsQuery,
} from "../queries/moderatorQuries";
import {
  deleteStudentQuery,
  getStudentsQuery,
} from "../queries/rootAdminQueries";

async function createPlayerRepository(prevState, formData) {
  const data = await addPlayerrQuery(prevState, formData);
  return data;
}

async function deletePlayerRepository(prevState, formData) {
  const data = await deletePlayerrQuery(prevState, formData);
  return data;
}

async function createTeamRepository(prevState, formData) {
  const data = await addTeamQuery(prevState, formData);
  return data;
}

async function deleteTeamRepository(prevState, formData) {
  const data = await deleteTeamQuery(prevState, formData);
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

async function updatePlayerDataRepository(prevState, formData) {
  const playerWeeklyData = await updatePlayerWeeklyDataQuery(
    prevState,
    formData
  );
  const playerWeeklyPoints = await updatePlayerWeeklyPointsQuery(
    prevState,
    formData
  );
  const playerPointAllTime = await updatePlayerPointsAllTimeQuery(
    prevState,
    formData
  );
  return { playerWeeklyData, playerWeeklyPoints, playerPointAllTime };
}

async function getAllPlayers() {
  const data = await getAllPlayersQuery();
  return data;
}

export {
  createPlayerRepository,
  deletePlayerRepository,
  createTeamRepository,
  deleteTeamRepository,
  getStudentsRepository,
  deleteStudentRepository,
  updatePlayerDataRepository,
  getAllPlayers,
};
