"use client";

import { createStudent, logIn } from "@/services/server/services";
import CreateUserForm from "../CreateUserForm";
import { useActionState } from "react";

function LogIn() {
  const [logInState, logInFormAction] = useActionState(logIn, {});

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
    },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={logInFormAction}
        formState={logInState}
      />
    </div>
  );
}

export default LogIn;
