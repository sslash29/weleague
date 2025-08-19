"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { updateReportType } from "@/services/services";

function ViewReports({ reports = [] }) {
  const [hoveredReportId, setHoveredReportId] = useState(null);
  //* It's Uses for animation purposes
  const [selectedAnimation, setIsSelectedAnimation] = useState(null);
  const [reportTypeState, reportTypeFormAction] = useActionState(
    updateReportType,
    {}
  );

  if (!reports || reports.length === 0) {
    return (
      <div className="w-full h-[700px] border flex items-center justify-center rounded-md">
        <h2 className="text-3xl font-semibold text-gray-700">No reports 🎉</h2>
      </div>
    );
  }

  // Define all possible states with icon mapping
  const stateOptions = [
    { value: "resolved", icon: "ResolvedGreen.svg" },
    { value: "cancelled", icon: "Cancel.svg" },
    { value: "pending", icon: "Pending.svg" },
  ];

  return (
    <div className="w-full h-[700px] border rounded-md p-4 overflow-y-auto mt-4">
      <div className="flex flex-col gap-6">
        {reports.map((r, idx) => {
          const id = r?.id ?? idx;
          const created = r?.created_at
            ? new Date(r.created_at).toLocaleString()
            : null;

          // Fallback to resolved if state is missing
          const currentState = r?.state || "resolved";

          // Rearrange so current state always comes first, others follow
          const orderedOptions = [
            stateOptions.find((o) => o.value === currentState),
            ...stateOptions.filter((o) => o.value !== currentState),
          ];

          return (
            <div
              key={id}
              className="bg-[#f2f2f2]/70 rounded-lg p-4 w-[500px] relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold">
                    {r?.report_type || "Report"}
                  </h3>
                  <span className="opacity-50">{r.report_type}</span>
                </div>
                <button className="bg-[#4D4D4D] rounded-md text-white font-semibold px-2 py-1">
                  View
                </button>
              </div>

              {/* Body */}
              <div className="mt-4">
                <div className="border rounded-xl p-3 min-h-[120px] whitespace-pre-wrap text-gray-800 text-sm">
                  {r?.report_text || "No description provided."}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                  {r?.state && (
                    <span className="px-2 py-0.5 border rounded-full">
                      State: {r.state}
                    </span>
                  )}
                  {r?.not_accepted && (
                    <span className="px-2 py-0.5 border rounded-full">
                      Not Accepted: {r.not_accepted}
                    </span>
                  )}
                  {r?.student_id && (
                    <span className="px-2 py-0.5 border rounded-full">
                      Student: {String(r.student_id).slice(0, 8)}…
                    </span>
                  )}
                </div>
              </div>

              {/* Footer + Hover actions */}
              <div className="w-full flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{created}</p>

                <div
                  className="flex flex-col justify-center gap-4 absolute top-[231px] right-0 w-[50px] items-center"
                  onMouseEnter={() => setHoveredReportId(r.id)}
                  onMouseLeave={() => setHoveredReportId(null)}
                >
                  <form action={reportTypeFormAction}>
                    <input hidden name="reportId" value={r.id} />

                    {
                      <button
                        type="submit"
                        name="type"
                        value={orderedOptions[0].value}
                        className="cursor-pointer"
                      >
                        <img
                          src={orderedOptions[0].icon}
                          alt={orderedOptions[0].value}
                        />
                      </button>
                    }

                    {/* Show other options on hover */}
                    <AnimatePresence>
                      {hoveredReportId === r.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="flex flex-col justify-center gap-4 mt-1"
                        >
                          {orderedOptions.slice(1).map((opt) => (
                            <button
                              key={opt.value}
                              type="submit"
                              name="type"
                              value={opt.value}
                              className="cursor-pointer"
                            >
                              <img src={opt.icon} alt={opt.value} />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewReports;
