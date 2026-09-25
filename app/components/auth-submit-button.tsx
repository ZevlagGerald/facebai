"use client";

import { useFormStatus } from "react-dom";
import { GovernedButton } from "./governed-button";

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
    <GovernedButton
      className={className}
      type="submit"
      pending={pending}
      pendingLabel={pendingLabel}
      pendingIndicator={<span className="button-spinner" aria-hidden="true" />}
      unstyled
      data-auth-submit
    >
      {idleLabel}
    </GovernedButton>
  );
}
