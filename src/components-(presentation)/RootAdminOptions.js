"use client";

import { useRootAdmin } from "@/context/rootAdminContext";

function RootAdminOptions() {
  const { active, setActive } = useRootAdmin();

  const options = [
    {
      id: "view-suspension-statistics",
      label: "View Suspension Statistics",
    },
    { id: "manage-admins", label: "Manage Admins" },
    { id: "manage-moderators", label: "Manage Moderators" },
    { id: "view-reports", label: "View Reports" },
  ];

  return (
    <div className="flex flex-col">
      <h3>Options</h3>
      <div className="flex border-t border-b justify-around">
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

export default RootAdminOptions;
