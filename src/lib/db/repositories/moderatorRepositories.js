import { Crushed } from "next/font/google";
import {
  addBestAssistVideoQuery,
  addBestGoalVideoQuery,
  addBestTackleVideoQuery,
  addCoolImgQuery,
  addPlayerDataQuery,
  addPlayerrQuery,
  addTeamQuery,
  deleteBestAwardQuery,
  deletePlayerrQuery,
  deleteTeamQuery,
  getAllBestAwardsPlayersQuery,
  getAllPlayersQuery,
  getPlayerImgByIdQuery,
  getPlayerNameByIdQuery,
  getPlayerPositionByIdQuery,
  getTeamPlayersQuery,
  updatePlayerPointsAllTimeQuery,
  updatePlayerWeeklyDataQuery,
  updatePlayerWeeklyPointsQuery,
  updateTeamAllTimeDataQuery,
  updateTeamPointsAllTimeQuery,
  updateTeamPointsThisWeekQuery,
  updateTeamWeeklyPointsQuery,
} from "../queries/moderatorQuries";
import { getCurrentGameweekQuery } from "../queries/queries";
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

async function getAllPlayers() {
  const data = await getAllPlayersQuery();
  return data;
}

async function addPlayerDataRepository(prevState, formData) {
  const currentGameweek = await getCurrentGameweekQuery();
  const currentGameweekNumber = currentGameweek.gameweek_number;
  formData.set("currentGameWeek", currentGameweekNumber);
  await addCoolImgQuery(prevState, formData);
  const data = await addPlayerDataQuery(prevState, formData);
  await updatePlayerWeeklyDataQuery(prevState, formData);
  await updatePlayerWeeklyPointsQuery(prevState, formData);
  await updatePlayerPointsAllTimeQuery(prevState, formData);
  return data;
}

async function updateTeamDataRepository(prevState, formData) {
  const currentGameweek = await getCurrentGameweekQuery();
  const currentGameweekNumber = currentGameweek.gameweek_number;
  formData.set("currentGameWeek", currentGameweekNumber);
  const playerName = await getPlayerNameByIdQuery(formData.get("playerId"));
  formData.set("playerName", playerName);
  const playerImage = await getPlayerImgByIdQuery(formData.get("playerId"));
  formData.set("playerImage", playerImage);
  const playerPosition = await getPlayerPositionByIdQuery(
    formData.get("playerId")
  );
  formData.set("playerPosition", playerPosition);
  const weeklyPoints = await updateTeamWeeklyPointsQuery(prevState, formData);
  const pointsThisWeek = await updateTeamPointsThisWeekQuery(
    prevState,
    formData
  );
  const pointsAllTime = await updateTeamPointsAllTimeQuery(prevState, formData);
  const updateAllTimeData = await updateTeamAllTimeDataQuery(
    prevState,
    formData
  );
  return { weeklyPoints, pointsThisWeek, pointsAllTime, updateAllTimeData };
}

async function getTeamPlayersRepository(teamId) {
  return await getTeamPlayersQuery(teamId);
}

async function addBestGoalVideoRepository(prevState, formData) {
  return await addBestGoalVideoQuery(prevState, formData);
}

async function addBestAssistVideoRepository(prevState, formData) {
  return await addBestAssistVideoQuery(prevState, formData);
}

async function addBestTackleVideoRepository(prevState, formData) {
  return await addBestTackleVideoQuery(prevState, formData);
}

async function addCoolImgRepository(prevState, formData) {
  return await addCoolImgQuery(prevState, formData);
}

async function getAllPlayerRepository() {
  return await getAllPlayersQuery();
}

async function deleteBestAwardRepository(prevState, formData) {
  return await deleteBestAwardQuery(prevState, formData);
}

async function getAllBestAwardsPlayersRepository() {
  return await getAllBestAwardsPlayersQuery();
}
export {
  createPlayerRepository,
  deletePlayerRepository,
  createTeamRepository,
  deleteTeamRepository,
  getAllPlayers,
  addPlayerDataRepository,
  updateTeamDataRepository,
  getTeamPlayersRepository,
  addBestGoalVideoRepository,
  addBestAssistVideoRepository,
  addBestTackleVideoRepository,
  addCoolImgRepository,
  getAllPlayerRepository,
  deleteBestAwardRepository,
  getAllBestAwardsPlayersRepository,
};
