"use client";

import { createReport } from "@/services/userServices";
import CreateUserForm from "../CreateUserForm";
import { useActionState } from "react";

function CreateReport() {
  const [createReportState, createReportFormAction] = useActionState(
    createReport,
    {}
  );

  const inputs = [
    {
      name: "fullName",
      placeholder: "Full Name",
      type: "text",
    },
    {
      name: "phoneNumber",
      placeholder: "Phone Number",
      type: "tel",
    },
    {
      name: "problemDescription",
      type: "textarea",
      placeholder: "Explain",
    },
  ];

  const options = [
    {
      id: 1,
      name: "Account Deletion",
    },
    {
      id: 2,
      name: "Bug or Website",
    },
    {
      id: 3,
      name: "Wrong Player Data",
    },
  ];
  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={createReportFormAction}
        formState={createReportState}
        isOption={true}
        options={options}
        optionName="problemType"
      />
    </div>
  );
}

export default CreateReport;
