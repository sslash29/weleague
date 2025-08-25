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
    } else if (type === "tel") {
      // E.164: + followed by 8–15 digits, first digit 1-9
      const input = e.currentTarget;
      const value = input.value;
      const selStart = input.selectionStart ?? value.length;
      const selEnd = input.selectionEnd ?? value.length;
      const selectionLength = Math.max(0, selEnd - selStart);

      const isDigit = /^\d$/.test(key);
      const isPlus = key === "+";

      // allow '+' only at the start and only once (or when replacing a selection starting at 0)
      if (isPlus) {
        const alreadyHasPlus = value.includes("+");
        const plusAtStart = selStart === 0; // typing at start
        if (alreadyHasPlus || !plusAtStart) {
          e.preventDefault();
          return;
        }
        return; // allow
      }

      // prevent leading zero right after '+' (first significant digit must be 1-9)
      if (isDigit && value === "+" && key === "0") {
        e.preventDefault();
        return;
      }

      // allow only digits otherwise
      if (!isDigit) {
        e.preventDefault();
        return;
      }

      // enforce max of 15 digits total (excluding the '+')
      const currentDigits = value.replace(/\D/g, "");
      const willExceed = currentDigits.length >= 15 && selectionLength === 0;
      if (willExceed) {
        e.preventDefault();
      }
    } else if (type === "number") {
      // block letters for numeric fields
      if (/^[a-zA-Z]$/.test(key)) e.preventDefault();
    } else if (type === "price") {
      // allow digits and a single decimal point
      const isDigit = /^\d$/.test(key);
      const isDot = key === ".";
      if (!isDigit && !isDot) {
        e.preventDefault();
        return;
      }
      if (isDot && e.currentTarget.value.includes(".")) {
        e.preventDefault();
      }
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
    } else if (type === "tel") {
      // Validate resulting value against E.164 when pasting
      const input = e.currentTarget;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const next =
        input.value.slice(0, start) +
        paste.replace(/\s+/g, "") +
        input.value.slice(end);
      if (!/^\+[1-9]\d{7,14}$/.test(next)) {
        e.preventDefault();
        setNotification(
          "Phone number must be in E.164 format, e.g. +123456789"
        );
      }
    } else if (type === "number") {
      if (/[a-zA-Z]/.test(paste)) {
        e.preventDefault();
        setNotification(
          "Pasted value contains letters which are not allowed here"
        );
      }
    } else if (type === "price") {
      // allow only digits with at most one decimal point
      if (!/^\d*\.?\d*$/.test(paste)) {
        e.preventDefault();
        setNotification("Please paste a valid decimal number");
      }
    }
  };

  // Sanitize on input (covers mobile/IMEs where keydown may not catch everything)
  const handleInput = (e, type) => {
    if (type === "text") {
      const cleaned = e.target.value.replace(/\d+/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
    } else if (type === "tel") {
      // Keep only digits and a single leading '+' and cap to 15 digits
      let value = e.target.value.replace(/[^\d+]/g, "");
      if (value.startsWith("+")) {
        // remove any additional '+'
        value = "+" + value.slice(1).replace(/[+]/g, "");
      } else {
        // remove all '+' if not at start
        value = value.replace(/[+]/g, "");
      }

      // limit to 15 digits (excluding '+')
      const digits = value.replace(/\D/g, "");
      if (digits.length > 15) {
        const trimmed = digits.slice(0, 15);
        value = value.startsWith("+") ? "+" + trimmed : trimmed;
      }
      if (value !== e.target.value) e.target.value = value;
    } else if (type === "number") {
      const cleaned = e.target.value.replace(/[a-zA-Z]+/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
    } else if (type === "price") {
      // keep digits and a single dot
      let value = e.target.value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts.shift() + "." + parts.join("");
      }
      if (value !== e.target.value) e.target.value = value;
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
                : input.type === "price"
                ? "decimal"
                : "text"
            }
            onKeyDown={(e) => handleKeyDown(e, input.type || "text")}
            onPaste={(e) => handlePaste(e, input.type || "text")}
            onInput={(e) => handleInput(e, input.type || "text")}
            onChange={input.type === "file" ? handleFileChange : undefined}
            pattern={
              input.type === "price"
                ? "[0-9]*[.]?[0-9]*"
                : input.type === "tel"
                ? "^\\+[1-9]\\d{7,14}$"
                : undefined
            }
            title={
              input.type === "tel"
                ? "E.164 format: + followed by 8–15 digits, e.g. +123456789"
                : undefined
            }
            maxLength={input.type === "tel" ? 16 : undefined}
            minLength={input.type === "tel" ? 9 : undefined}
            autoComplete={input.type === "tel" ? "tel" : undefined}
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
