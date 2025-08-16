"use client";

import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function CreateUserForm({
  inputs,
  formAction,
  formState,
  submitButtonText,
  isRedirect = false,
  redirect = "admin",
}) {
  const router = useRouter();

  if (isRedirect === true) {
    useEffect(() => {
      if (formState?.message) {
        const timer = setTimeout(() => {
          router.push(`/${redirect}`);
        }, 2500);

        return () => clearTimeout(timer);
      }
    }, [formState, router]);
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {inputs.map((input) => (
        <div key={input.name} className="flex flex-col">
          <input
            id={input.name}
            name={input.name}
            type={input.type || "text"}
            placeholder={input.placeholder}
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0"
            required
          />
        </div>
      ))}

      <SubmitButton submitButtonText={submitButtonText} />
      {formState?.message && (
        <p className="text-sm text-[#a0a0a0] font-medium">
          {formState.message}
        </p>
      )}
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
