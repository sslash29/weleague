"use client";

import { useState } from "react";

function ViewReports({ reports = [] }) {
  const [open, setOpen] = useState(() => new Set());
  console.log(reports);

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
              className="bg-white border rounded-lg p-4 max-w-[800px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">
                    {r?.report_type || "Report"}
                  </h3>
                  {created && (
                    <p className="text-xs text-gray-500 mt-1">{created}</p>
                  )}
                </div>
                <button
                  onClick={() => toggle(id)}
                  className="bg-[#333333] text-white text-sm font-semibold px-3 py-1 rounded-md"
                >
                  {open.has(id) ? "Hide" : "View"}
                </button>
              </div>
              {open.has(id) && (
                <div className="mt-4">
                  <div className="border rounded-md p-3 min-h-[120px] whitespace-pre-wrap text-gray-800">
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewReports;
