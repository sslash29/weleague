"use client";

import { createPlayer, createTeam } from "@/services/moderatorServices";
import { useActionState } from "react";
import CreateUserForm from "../CreateUserForm";

function CreateTeamForm() {
  const [createTeamState, createTeamFormAction] = useActionState(
    createTeam,
    {}
  );

  const inputs = [
    {
      name: "teamName",
      placeholder: "Team Name",
    },
    {
      name: "class",
      placeholder: "Class",
      type: "class",
    },
    {
      name: "teamCrestImg",
      type: "file",
      placeholder: "Team Crest Image",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createTeamFormAction}
        formState={createTeamState}
      />
    </div>
  );
}

export default CreateTeamForm;
