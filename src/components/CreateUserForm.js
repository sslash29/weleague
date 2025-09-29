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
  isBack = true,
  selectOptions = [], // [{ name, label, options, valueKey, displayKey }]
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

  // Handle file validation
  const handleFileChange = (e, typeofFile) => {
    const file = e.target.files[0];
    if (!file) return;
    // ✅ Only apply 5MB limit to images
    if (file.type.startsWith("image/") && file.size > 5 * 1024 * 1024) {
      setNotification("Max image size is 5MB");
      e.target.value = null; // reset the input
    }
    if (typeofFile?.startsWith("video/")) {
      // ✅ For videos, no size check (or you can add a bigger limit, e.g. 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setNotification("Max video size is 100MB");
        e.target.value = null;
      }
    }
  };

  // Prevent invalid keys
  const handleKeyDown = (e, type) => {
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
      if (/^\d$/.test(key)) e.preventDefault();
    } else if (type === "tel") {
      const input = e.currentTarget;
      const value = input.value;
      const selStart = input.selectionStart ?? value.length;
      const selEnd = input.selectionEnd ?? value.length;
      const selectionLength = Math.max(0, selEnd - selStart);

      const isDigit = /^\d$/.test(key);
      const isPlus = key === "+";

      if (isPlus) {
        const alreadyHasPlus = value.includes("+");
        const plusAtStart = selStart === 0;
        if (alreadyHasPlus || !plusAtStart) {
          e.preventDefault();
          return;
        }
        return;
      }

      if (isDigit && value === "+" && key === "0") {
        e.preventDefault();
        return;
      }

      if (!isDigit) {
        e.preventDefault();
        return;
      }

      const currentDigits = value.replace(/\D/g, "");
      const willExceed = currentDigits.length >= 15 && selectionLength === 0;
      if (willExceed) {
        e.preventDefault();
      }
    } else if (type === "number") {
      if (/^[a-zA-Z]$/.test(key)) e.preventDefault();
    } else if (type === "price") {
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
        setNotification("Pasted value contains numbers which are not allowed");
      }
    } else if (type === "tel") {
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
        setNotification("Pasted value contains letters which are not allowed");
      }
    } else if (type === "price") {
      if (!/^\d*\.?\d*$/.test(paste)) {
        e.preventDefault();
        setNotification("Please paste a valid decimal number");
      }
    }
  };

  const handleInput = (e, type) => {
    if (type === "text") {
      const cleaned = e.target.value.replace(/\d+/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
    } else if (type === "tel") {
      let value = e.target.value.replace(/[^\d+]/g, "");
      if (value.startsWith("+")) {
        value = "+" + value.slice(1).replace(/[+]/g, "");
      } else {
        value = value.replace(/[+]/g, "");
      }
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
      let value = e.target.value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts.shift() + "." + parts.join("");
      }
      if (value !== e.target.value) e.target.value = value;
    }
  };

  // Separate hidden and visible inputs
  const hiddenInputs = inputs?.filter((input) => input.type === "hidden") || [];
  const visibleInputs =
    inputs?.filter((input) => input.type !== "hidden") || [];

  return (
    <form action={formAction} className="flex flex-col gap-4 relative ">
      {/* Hidden inputs - render without styling containers */}
      {hiddenInputs.map((input) => (
        <input
          key={input.name}
          type="hidden"
          name={input.name}
          value={input.value}
        />
      ))}

      {/* Visible inputs */}
      {visibleInputs.map((input) => (
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
            onChange={
              input.type === "file"
                ? (e) => handleFileChange(e, input.typeofFile)
                : undefined
            }
            accept={input.type === "file" ? input.typeofFile : undefined}
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

      {/* Multiple selects */}
      {Array.isArray(selectOptions) &&
        selectOptions.map((select) => (
          <div key={select.name} className="flex flex-col">
            <select
              id={select.name}
              name={select.name}
              className="p-2 rounded-lg bg-[#f2f2f2] outline-0"
              required
            >
              <option value="">
                Select {select.label ? select?.label.toLowerCase() : null}
              </option>
              {select.options.map((option) => (
                <option key={option.id} value={option[select.valueKey]}>
                  {option[select.displayKey]}
                </option>
              ))}
            </select>
          </div>
        ))}

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
