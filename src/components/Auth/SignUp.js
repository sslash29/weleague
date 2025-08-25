"use client";

import { createStudent } from "@/services/server/services";
import CreateUserForm from "../CreateUserForm";
import { useActionState } from "react";

function SignUp() {
  const [createStudentState, createStudentFormAction] = useActionState(
    createStudent,
    {}
  );

  const inputs = [
    {
      name: "fullName",
      type: "text",
      placeholder: "Full Name",
    },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
    },
    {
      name: "phoneNumber",
      type: "tel",
      placeholder: "Phone Number",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createStudentFormAction}
        formState={createStudentState}
      />
    </div>
  );
}

export default SignUp;
