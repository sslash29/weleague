"use client";

import { useFormStatus } from "react-dom";

function CreateUserForm({ inputs, formAction, formState, submitButtonText }) {
  const { pending } = useFormStatus();
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {inputs.map((input) => (
        <div key={input.name} className="flex flex-col">
          <input
            id={input.name}
            name={input.name}
            type={input.type || "text"}
            placeholder={input.placeholder}
            className="p-2 border rounded"
            required
          />
        </div>
      ))}
      {formState?.message && (
        <p className="text-sm text-red-500">{formState.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {pending ? "Submitting..." : submitButtonText || "Submit"}
      </button>
    </form>
  );
}

export default CreateUserForm;
