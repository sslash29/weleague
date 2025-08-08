"use client";

import { createAdmin } from "@/services-(Bussiness)/rootAdminService";
import { useActionState } from "react";
import CreateUserForm from "./CreateUserForm";

function CreateAdminForm() {
  const { createAdminMessage, createAdminFormAction } = useActionState(
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
      <CreateUserForm />
    </div>
  );
}

export default CreateAdminForm;
