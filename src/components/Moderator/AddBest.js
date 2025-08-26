"use client";

import { useActionState } from "react";
import CreateUserForm from "../CreateUserForm";
import { addBestAward } from "@/services/moderatorServices";

function AddBest({ players }) {
  const [addBestState, addBestFormAction] = useActionState(addBestAward, {});
  const inputs = [
    {
      name: "video",
      placeholder: "Video URL",
      type: "file",
      typeofFile: "video/mp4",
    },
  ];

  // First dropdown: Award type
  const awardOptions = [
    { id: 1, name: "Best Goal", value: "bestGoal" },
    { id: 2, name: "Best Assist", value: "bestAssist" },
    { id: 3, name: "Best Tackle", value: "bestTackle" },
  ];

  const playerOptions = players.map((player) => ({
    id: player.id,
    name: player.full_name,
    value: player.id,
  }));

  return (
    <div>
      <CreateUserForm
        inputs={inputs}
        formAction={addBestFormAction}
        formState={addBestState}
        submitButtonText="Submit"
        selectOptions={[
          {
            name: "awardType", // field name in form
            label: "Award Type", // label above select
            options: awardOptions, // options array
            valueKey: "value", // which key to use as <option value=...>
            displayKey: "name", // which key to show in UI
          },
          {
            name: "playerId",
            label: "Player",
            options: playerOptions,
            valueKey: "id",
            displayKey: "name",
          },
        ]}
      />
    </div>
  );
}

export default AddBest;
