"use client";
import { updateRulePoints } from "@/services/rootAdminService";
import { useActionState, useState } from "react";

const RulesPointsEditor = ({ rules }) => {
  const [rulePoints, setRulePoints] = useState({
    id: rules?.id || "",
    created_at: rules?.created_at || "",
    goal: rules?.goal || 3,
    assist: rules?.assist || 3,
    freekick_goal: rules?.freekick_goal || 10,
    goal_clearance: rules?.goal_clearance || 2,
    tackle: rules?.tackle || 0.5,
    shot_block: rules?.shot_block || 0.2,
    yellow_card: rules?.yellow_card || -1,
    red_card: rules?.red_card || -3,
    clean_sheet: rules?.clean_sheet || 3,
    save: rules?.save || 2,
    goal_conceeded: rules?.goal_conceeded || -1,
    goal_to_goal: rules?.goal_to_goal || 12,
    penalty_save: rules?.penalty_save || 2,
  });

  const [state, formAction] = useActionState(updateRulePoints, null);

  const handleInputChange = (field, value) => {
    setRulePoints((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const formatLabel = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Fantasy Points Rules
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure point values for different player actions
          </p>
        </div>

        <form>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(rulePoints)
                .filter((key) => key !== "id" && key !== "created_at")
                .map((key) => (
                  <div key={key} className="flex flex-col">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700 mb-2"
                    >
                      {formatLabel(key)}
                    </label>
                    <input
                      id={key}
                      type="number"
                      step="0.1"
                      value={rulePoints[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <span
                      className={`text-xs mt-1 ${
                        rulePoints[key] >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {rulePoints[key] >= 0 ? "+" : ""}
                      {rulePoints[key]} points
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <input
            type="hidden"
            name="rulePoints"
            value={JSON.stringify(rulePoints)}
          />

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                formAction={formAction}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RulesPointsEditor;
