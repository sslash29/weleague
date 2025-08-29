"use client";

import { createPlayer } from "@/services/moderatorServices";
import { useActionState } from "react";
import CreateUserForm from "../CreateUserForm";

function CreatePlayerForm({ teams }) {
  const [createPlayerState, createPlayerFormAction] = useActionState(
    createPlayer,
    {}
  );

  const inputs = [
    {
      name: "fullName",
      placeholder: "Full Name",
    },
    {
      name: "position",
      placeholder: "Position",
    },
    {
      name: "price",
      placeholder: "Price",
      type: "price",
    },
    {
      name: "class",
      type: "class",
      placeholder: "Class",
    },
    {
      name: "playerImg",
      type: "file",
      placeholder: "Player Image",
    },
  ];

  const options = teams.map((team) => ({
    id: team.id,
    name: team.name,
    img: team.teamImg,
  }));
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createPlayerFormAction}
        formState={createPlayerState}
        selectOptions={[
          {
            name: "teamId",
            label: "Team",
            options: options,
            valueKey: "id",
            displayKey: "name",
          },
        ]}
      />
    </div>
  );
}

export default CreatePlayerForm;
