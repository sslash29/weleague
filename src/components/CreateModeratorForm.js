"use client";

import { createModerator } from "@/services/rootAdminService";
import { useActionState } from "react";
import CreateUserForm from "./CreateUserForm";

function CreateModeratorForm() {
  const [createModeratorState, createModeratorFormAction] = useActionState(
    createModerator,
    {}
  );

  const inputs = [
    {
      name: "username",
      placeholder: "username...",
    },
    {
      name: "password",
      type: "password",
      placeholder: "password...",
    },
    {
      name: "phoneNumber",
      type: "number",
      placeholder: "phone number...",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createModeratorFormAction}
        formState={createModeratorState}
      />
    </div>
  );
}

export default CreateModeratorForm;
