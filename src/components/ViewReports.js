"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { updateReportType } from "@/services/services";

function ViewReports({ reports = [] }) {
  const [isHover, setIsHover] = useState(false);
  const [reportTypeState, reportTypeFormAction] = useActionState(
    updateReportType,
    {}
  );

  if (!reports || reports.length === 0)
    return (
      <div className="w-full h-[700px] border flex items-center justify-center rounded-md">
        <h2 className="text-3xl font-semibold text-gray-700">No reports 🎉</h2>
      </div>
    );

  return (
    <div className="w-full h-[700px] border rounded-md p-4 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {reports.map((r, idx) => {
          const id = r?.id ?? idx;
          const created = r?.created_at
            ? new Date(r.created_at).toLocaleString()
            : null;

          return (
            <div
              key={id}
              className="bg-[#f2f2f2]/70 rounded-lg p-4 w-[500px] relative"
            >
              <div className="flex items-center justify-between gap-4 ">
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
              <div className="w-full flex justify-between items-center  ">
                <p className="text-xs text-gray-500 mt-1">{created}</p>
                <AnimatePresence>
                  <div
                    className="flex flex-col justify-center gap-4 absolute top-[231px] right-0 w-[50px] items-center"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                  >
                    <form action={reportTypeFormAction}>
                      <input hidden name="reportId" value={r.id} />
                      <button
                        type="submit"
                        name="type"
                        value="resolved"
                        className="cursor-pointer"
                      >
                        <img src="Resolved.svg" alt="Resolved" />
                      </button>

                      {/* Show others on hover */}
                      {isHover && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="flex flex-col justify-center gap-4"
                        >
                          <button
                            type="submit"
                            name="type"
                            value="cancelled"
                            className="cursor-pointer"
                          >
                            <img src="Cancel.svg" alt="cancel" />
                          </button>
                          <button
                            type="submit"
                            name="type"
                            value="pending"
                            className="cursor-pointer"
                          >
                            <img src="Pending.svg" alt="pending" />
                          </button>
                        </motion.div>
                      )}
                    </form>
                  </div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewReports;
