"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/globalContext";
import Notifcation from "./Notifcation";
import BackButton from "./BackButton";
import SubmitButton from "./SubmitButton";

function CreateUserForm({
  inputs,
  formAction,
  formState,
  submitButtonText,
  isRedirect = false,
  redirect = "admin",
  isOption = false,
  options,
  optionName = "teamId",
  isBack = true,
  optionValue = "name",
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

  // Prevent digits in text inputs and prevent letters in tel/number inputs
  const handleKeyDown = (e, type) => {
    // allow shortcuts and navigation
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key;
    const isControlKey = [
      "Backspace",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Delete",
    ].includes(key);
    if (isControlKey) return;

    if (type === "text") {
      // block digits
      if (/^\d$/.test(key)) e.preventDefault();
    } else if (type === "tel" || type === "number") {
      // block letters
      if (/^[a-zA-Z]$/.test(key)) e.preventDefault();
    }
  };

  const handlePaste = (e, type) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    if (!paste) return;
    if (type === "text") {
      if (/\d/.test(paste)) {
        e.preventDefault();
        setNotification(
          "Pasted value contains numbers which are not allowed here"
        );
      }
    } else if (type === "tel" || type === "number") {
      if (/[a-zA-Z]/.test(paste)) {
        e.preventDefault();
        setNotification(
          "Pasted value contains letters which are not allowed here"
        );
      }
    }
  };

  // Sanitize on input (covers mobile/IMEs where keydown may not catch everything)
  const handleInput = (e, type) => {
    if (type === "text") {
      const cleaned = e.target.value.replace(/\d+/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
    } else if (type === "tel" || type === "number") {
      const cleaned = e.target.value.replace(/[a-zA-Z]+/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
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
            inputMode={
              input.type === "number"
                ? "numeric"
                : input.type === "tel"
                ? "tel"
                : "text"
            }
            onKeyDown={(e) => handleKeyDown(e, input.type || "text")}
            onPaste={(e) => handlePaste(e, input.type || "text")}
            onInput={(e) => handleInput(e, input.type || "text")}
            onChange={input.type === "file" ? handleFileChange : undefined}
          />
        </div>
      ))}

      {isOption && Array.isArray(options) && options.length > 0 && (
        <div className="flex flex-col">
          <select
            id={optionName}
            name={optionName}
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0"
            required
          >
            <option value="">Select team</option>
            {options.map((option) => (
              <option
                key={option.id}
                value={
                  optionValue.toLowerCase() === "name" ? option.name : option.id
                }
              >
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
      {isBack && <BackButton />}
    </form>
  );
}

export default CreateUserForm;
