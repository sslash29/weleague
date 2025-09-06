"use server";

import {
  addPlayerToTeamRepository,
  createReportRepository,
  getStudentTeamRepository,
} from "@/lib/db/repositories/userRepositories";

async function createReport(prevState, formData) {
  return await createReportRepository(prevState, formData);
}

async function addPlayerToTeam(prevState, formData) {
  const studentId = formData.get("studentId");
  const selectedPlayer = JSON.parse(formData.get("selectedPlayer")); // ✅ valid JSON
  const type = formData.get("type");
  const positionOnField = formData.get("positionOnField"); // ✅ comes from form
  const { mainPlayers, benchPlayers } = await getStudentTeamRepository(
    studentId
  );
  console.log("userServices");
  console.log(mainPlayers);

  const team = {
    teamName: formData.get("teamName") || "",
    mainPlayers: {
      ...mainPlayers,
      ...(type === "main"
        ? {
            [selectedPlayer.id]: {
              name: selectedPlayer.full_name,
              player_img: selectedPlayer.player_image,
              positionOnField: Number(positionOnField), // ✅ add it here
            },
          }
        : {}),
    },
    benchPlayers: {
      ...benchPlayers,
      ...(type === "bench"
        ? {
            [selectedPlayer.id]: {
              name: selectedPlayer.name,
              player_img: selectedPlayer.player_img,
              positionOnField: Number(positionOnField), // ✅ add it here
            },
          }
        : {}),
    },
  };

  formData.set("team", JSON.stringify(team)); // ✅ store as JSON string

  return await addPlayerToTeamRepository(prevState, formData);
}

async function getStudentTeam(studentId) {
  return await getStudentTeamRepository(studentId);
}

export { createReport, addPlayerToTeam, getStudentTeam };
