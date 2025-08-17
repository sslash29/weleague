import { useFormStatus } from "react-dom";

function SubmitButton({ submitButtonText }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 p-2 rounded-lg bg-black text-white flex items-center gap-3 justify-center text-lg font-semibold cursor-pointer transition-all hover:scale-95 w-full"
    >
      {pending ? "Submitting..." : submitButtonText || "Submit"}
      <img src="/SubmitArrowIcon.svg" alt="Submit" />
    </button>
  );
}

export default SubmitButton;
