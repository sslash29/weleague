"use client";
import CreateUserForm from "@/components/CreateUserForm";
import { updatePlayerPrice } from "@/services/services";
import { useActionState } from "react";

function EditPlayerPrice({ players }) {
  const [scoreDataState, scoreDataFormAction] =
    useActionState(updatePlayerPrice);

  const inputs = [
    {
      name: "newPlayerPrice",
      placeholder: "Enter new player price",
      type: "price",
    },
  ];

  const selectOptions = [
    {
      name: "playerId",
      label: "Player",
      options: players || [],
      valueKey: "id",
      displayKey: "full_name",
    },
  ];

  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        selectOptions={selectOptions}
        formAction={scoreDataFormAction}
        formState={scoreDataState}
        submitButtonText="Update Player Price"
      />
    </div>
  );
}

export default EditPlayerPrice;
