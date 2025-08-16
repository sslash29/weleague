"use client";

import { createPlayer } from "@/services/moderatorServices";
import { useActionState } from "react";
import CreateUserForm from "./CreateUserForm";

function CreatePlayerForm() {
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
      name: "playerImg",
      type: "file",
      placeholder: "Player Image",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createPlayerFormAction}
        formState={createPlayerState}
      />
    </div>
  );
}

export default CreatePlayerForm;
