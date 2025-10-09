"use client";

import { useState } from "react";
import { useRootAdmin } from "@/context/rootAdminContext";

function RootAdminOptions({ adminType }) {
  const { active, setActive } = useRootAdmin();
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const options = [
    { id: "view-suspension-statistics", label: "View Suspension Statistics" },
    ...(adminType === "root-admin"
      ? [{ id: "manage-admins", label: "Manage Admins" }]
      : []),
    { id: "manage-moderators", label: "Manage Moderators" },
    { id: "view-reports", label: "View Reports" },
    { id: "manage-users", label: "Manage Users" },
    { id: "manage-teams", label: "Manage Teams" },
  ];

  const totalPages = Math.ceil(options.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const currentOptions = options.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="flex flex-col mt-5">
      <h3>Options</h3>
      <div className="flex border-t border-b justify-between items-center mt-1 w-full">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className={`p-2 transition-opacity ${
            page === 0 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
          }`}
        >
          <img
            src="/smallArrow.svg"
            alt="left arrow"
            className="w-4 h-4 rotate-90"
          />
        </button>

        {/* Options */}
        <div className="flex justify-between w-full">
          {currentOptions.map((option) => (
            <div
              key={option.id}
              className={`opacity-70 border-l border-r p-2 cursor-pointer transition-all min-w-[200px] text-center ${
                active === option.id ? "bg-violet-light" : "bg-white"
              }`}
              onClick={() => setActive(option.id)}
            >
              <span className="text-black opacity-100 text-xl font-medium whitespace-nowrap">
                {option.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className={`p-2 transition-opacity ${
            page === totalPages - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:opacity-80"
          }`}
        >
          <img
            src="/smallArrow.svg"
            alt="right arrow"
            className="w-4 h-4 -rotate-90"
          />
        </button>
      </div>
    </div>
  );
}

export default RootAdminOptions;
