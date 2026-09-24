"use client";

import { useFormStatus } from "react-dom";

export function AuthSubmitButton({
  idleLabel,
  pendingLabel,
  className = "primary-button",
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={className}
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-busy={pending}
      data-auth-submit
    >
      {pending ? <span className="button-spinner" aria-hidden="true" /> : null}
      <span>{pending ? pendingLabel : idleLabel}</span>
    </button>
  );
}
