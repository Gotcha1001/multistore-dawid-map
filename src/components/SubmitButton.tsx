import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string; // Add className as an optional prop
};

export default function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={`${
        pending ? "bg-gray-400" : "bg-blue-600"
      } ${className} mt-3 text-white px-6 py-2 rounded-lg`}
    >
      {pending ? <span>Saving...</span> : <span>{children}</span>}
    </button>
  );
}
