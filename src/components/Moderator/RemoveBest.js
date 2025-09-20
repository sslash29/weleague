"use client";

import { useActionState } from "react";
import CreateUserForm from "../CreateUserForm";
import { deleteBestAward } from "@/services/moderatorServices";

function RemoveBest({ players }) {
  const [addBestState, addBestFormAction] = useActionState(deleteBestAward, {});

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

export default RemoveBest;
