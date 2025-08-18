"use client";
import { addPlayerData } from "@/services/moderatorServices";
import { startTransition, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SubmitButton from "../../SubmitButton";

function AddPlayerDataFormGoals({ playerId, setDisplay }) {
  const id = playerId;

  // ✅ Hooks must be at the top
  const router = useRouter();
  const pathname = usePathname();

  // State for inputs
  const [formValues, setFormValues] = useState({
    freekick: "",
    normal: "",
    penalty: "",
    goalToGoal: "",
    ownGoal: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    // Only allow numbers (or empty string for typing/deleting)
    if (/^\d*$/.test(value)) {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("playerId", id);

    // Convert empty values to "0"
    Object.entries(formValues).forEach(([key, value]) => {
      const finalValue = value === "" ? "0" : value;
      formData.append(key, finalValue);
    });

    // Merge any existing query params from earlier "Add More" steps so the
    // final submission includes fields appended to the URL by previous steps.
    // Skip playerId because we already set it above.
    const currentParams = new URLSearchParams(window.location.search);
    for (const [key, value] of currentParams.entries()) {
      if (key === "playerId") continue;
      if (!formData.has(key)) {
        formData.append(key, value);
      }
    }

    startTransition(async () => {
      const res = await addPlayerData({}, formData);
      if (res && res.message) setStatusMessage(res.message);
    });
  }

  function handleAddMore(e) {
    e.preventDefault();

    // Grab existing params from current URL
    const currentParams = new URLSearchParams(window.location.search);

    // Keep playerId as a single value
    currentParams.set("playerId", id);

    // Append new values so we don't overwrite earlier sections
    Object.entries(formValues).forEach(([key, value]) => {
      const finalValue = value === "" ? "0" : value;
      currentParams.append(key, finalValue);
    });

    // Push updated URL
    router.push(`${pathname}?${currentParams.toString()}`);

    setDisplay("saves");
  }

  return (
    <div className="flex h-dvh w-dvw justify-center translate-y-30">
      <div className="flex flex-col">
        <div className="flex flex-col justify-center">
          <h2 className="text-5xl font-bold">Add Player</h2>
          <h2 className="text-5xl font-bold">Weekly Data</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-4">
          <label className="font-semibold text-xl">Goals:</label>
          <div className="flex items-center flex-wrap content-start w-[450px] justify-between gap-y-3">
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Freekick"
              name="freekick"
              value={formValues.freekick}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Normal"
              name="normal"
              value={formValues.normal}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Penalty"
              name="penalty"
              value={formValues.penalty}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Goal-To-Goal"
              name="goalToGoal"
              value={formValues.goalToGoal}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Own Goal"
              name="ownGoal"
              value={formValues.ownGoal}
              onChange={handleChange}
              inputMode="numeric"
            />
          </div>

          <button
            type="button"
            className="mt-4 p-2 rounded-lg bg-[#eeee] text-black flex items-center gap-3 justify-center text-lg font-semibold cursor-pointer transition-all hover:scale-95 w-full hover:bg-violet-light"
            onClick={handleAddMore}
          >
            Add More <img src="/PlusIcon.svg" alt="Submit" />
          </button>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

export default AddPlayerDataFormGoals;
