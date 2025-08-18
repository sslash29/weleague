"use client";

import { createAdmin } from "@/services/rootAdminService";
import { useActionState } from "react";
import CreateUserForm from "../CreateUserForm";

function CreateAdminForm() {
  const [createAdminState, createAdminFormAction] = useActionState(
    createAdmin,
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
        formAction={createAdminFormAction}
        formState={createAdminState}
        isRedirect={true}
        redirect="admin"
        isBack={false}
      />
    </div>
  );
}

export default CreateAdminForm;
