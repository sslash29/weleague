"use client";

import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/globalContext";
import Notifcation from "./Notifcation";
import BackButton from "./BackButton";

function CreateUserForm({
  inputs,
  formAction,
  formState,
  submitButtonText,
  isRedirect = false,
  redirect = "admin",
  isOption = false,
  options,
}) {
  const router = useRouter();
  const { notification, setNotification } = useGlobal();

  // Redirect after success
  useEffect(() => {
    if (isRedirect === true && formState?.message) {
      const timer = setTimeout(() => {
        router.push(`/${redirect}`);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isRedirect, formState, router, redirect]);

  // Handle image validation (5MB limit)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setNotification("Max image size is 5MB");
      e.target.value = null; // reset the input
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-4 relative ">
      {inputs?.map((input) => (
        <div key={input.name} className="flex flex-col">
          <input
            id={input.name}
            name={input.name}
            type={input.type || "text"}
            placeholder={input.placeholder}
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0"
            required
            onChange={input.type === "file" ? handleFileChange : undefined}
          />
        </div>
      ))}

      {isOption && Array.isArray(options) && options.length > 0 && (
        <div className="flex flex-col">
          <select
            id="teamId"
            name="teamId"
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0"
            required
          >
            <option value="">Select team</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <SubmitButton submitButtonText={submitButtonText} />
      {formState?.message && (
        <p className="text-sm text-[#a0a0a0] font-medium">
          {formState.message}
        </p>
      )}
      {notification && <Notifcation errorMsg={notification} />}
      <BackButton />
    </form>
  );
}

function SubmitButton({ submitButtonText }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="p-2 mt-1 text-white bg-black rounded-lg hover:bg-violet-normal-hover disabled:bg-gray-400 transition-all cursor-pointer"
    >
      {pending ? "Submitting..." : submitButtonText || "Submit"}
    </button>
  );
}

export default CreateUserForm;
