"use client";
import { addPlayerData } from "@/services/moderatorServices";
import { startTransition, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SubmitButton from "../../SubmitButton";

function AddPlayerDataFormAdditonal({ playerId, setDisplay }) {
  const id = playerId;
  const [statusMessage, setStatusMessage] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  // State for inputs
  const [formValues, setFormValues] = useState({
    assists: "",
    redCards: "",
    yellowCards: "",
    coolImg: null, // store File object
  });

  function handleChange(e) {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setFormValues((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setFormValues((prev) => ({ ...prev, [name]: value }));
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("playerId", id);

    Object.entries(formValues).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value); // append file
      } else {
        const finalValue = value === "" ? "0" : value;
        formData.append(key, finalValue);
      }
    });

    // Merge existing query params except playerId
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

    // Append numeric/text fields (skip file since it can’t go in URL)
    Object.entries(formValues).forEach(([key, value]) => {
      if (!(value instanceof File)) {
        const finalValue = value === "" ? "0" : value;
        currentParams.append(key, finalValue);
      }
    });

    // Push updated URL
    router.push(`${pathname}?${currentParams.toString()}`);

    setDisplay("goals");
  }

  return (
    <div className="flex h-dvh w-dvw justify-center translate-y-30">
      <div className="flex flex-col">
        <div className="flex flex-col justify-center">
          <h2 className="text-5xl font-bold">Add Player</h2>
          <h2 className="text-5xl font-bold">Weekly Data</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-4">
          <label className="font-semibold text-xl">Additional:</label>
          <div className="flex items-center flex-wrap content-start w-[450px] justify-between gap-y-3">
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Assists"
              name="assists"
              value={formValues.assists}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Red Cards"
              name="redCards"
              value={formValues.redCards}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              placeholder="Yellow Cards"
              name="yellowCards"
              value={formValues.yellowCards}
              onChange={handleChange}
              inputMode="numeric"
            />
            <input
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-[200px]"
              name="coolImg"
              onChange={handleChange}
              type="file"
            />
          </div>

          <button
            type="button"
            className="mt-4 p-2 rounded-lg bg-[#303030] text-white flex items-center gap-3 justify-center text-lg font-semibold cursor-pointer transition-all hover:scale-95 w-full hover:bg-violet-light"
            onClick={handleAddMore}
          >
            Go Back{" "}
            <img
              src="/SubmitArrowIcon.svg"
              alt="Submit"
              className="rotate-180"
            />
          </button>

          <SubmitButton />
          {statusMessage && (
            <p className="text-green-600 font-medium mt-2">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddPlayerDataFormAdditonal;
