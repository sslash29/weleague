"use client";
import CreateUserForm from "@/components/CreateUserForm";
import { addScoreData } from "@/services/services";
import { useActionState } from "react";

function CreateScoreDataForm({
  team1Players,
  team2Players,
  team1,
  team2,
  matchId,
}) {
  const [scoreDataState, scoreDataFormAction] = useActionState(addScoreData);
  const teamPlayers = [...team1Players, ...team2Players];
  const teamPlayersOption = teamPlayers.map((player) => ({
    id: player.id,
    name: player.full_name,
  }));

  const inputs = [
    { type: "hidden", value: matchId, name: "matchId" },
    // Add hidden inputs for both team IDs
    { type: "hidden", value: team1.id, name: "team1Id" },
    { type: "hidden", value: team2.id, name: "team2Id" },
    // Add hidden input for team players mapping
    {
      type: "hidden",
      value: JSON.stringify(teamPlayersOption),
      name: "teamPlayersData",
    },
    {
      type: "number",
      name: "team1Score",
      placeholder: `${team1.name} Score`,
    },
    {
      type: "number",
      name: "team2Score",
      placeholder: `${team2.name} Score`,
    },
  ];

  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        selectOptions={[
          {
            name: "winner",
            label: "winner",
            options: [team1, team2],
            valueKey: "id",
            displayKey: "name",
          },
          {
            name: "team",
            label: "player team",
            options: [team1, team2],
            valueKey: "id",
            displayKey: "name",
          },
          {
            name: "player",
            label: "player",
            options: teamPlayersOption,
            valueKey: "id",
            displayKey: "name",
          },
          {
            name: "event",
            label: "Goal",
            displayKey: "name",
            valueKey: "name",
            options: [
              { id: 1, name: "Goal" },
              { id: 2, name: "Assist" },
            ],
          },
        ]}
        formAction={scoreDataFormAction}
        formState={scoreDataState}
      />
    </div>
  );
}

export default CreateScoreDataForm;
