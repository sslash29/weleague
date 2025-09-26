"use client";

import { useModerator } from "@/context/moderatorContext";

function ModeratorOptions() {
  const { active, setActive } = useModerator();

  const options = [
    {
      id: "manage-players",
      label: "Manage Players",
    },

    { id: "manage-teams", label: "Manage Teams" },
    { id: "view-reports", label: "View Reports" },
    { id: "manage-users", label: "Manage Users" },
  ];

  return (
    <div className="flex flex-col mt-5">
      <h3>Options</h3>
      <div className="flex border-t border-b justify-around mt-1">
        {options.map((option) => (
          <div
            key={option.id}
            className={`opacity-70 border-l border-r p-2 cursor-pointer transition-all ${
              active === option.id ? "bg-violet-light" : "bg-white"
            }`}
            onClick={() => setActive(option.id)}
          >
            <span className="text-black opacity-100 text-xl font-medium">
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModeratorOptions;
