"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./governed-ui.module.css";

export type GovernedButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type GovernedButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  pending?: boolean;
  pendingLabel?: ReactNode;
  pendingIndicator?: ReactNode;
  variant?: GovernedButtonVariant;
  unstyled?: boolean;
};

export function GovernedButton({
  children,
  pending = false,
  pendingLabel,
  pendingIndicator,
  variant = "primary",
  unstyled = false,
  className,
  disabled,
  ...props
}: GovernedButtonProps) {
  const blocked = Boolean(disabled || pending);
  const classes = unstyled
    ? className
    : [styles.button, styles[variant], className].filter(Boolean).join(" ");

  return (
    <button
      {...props}
      className={classes}
      disabled={blocked}
      aria-disabled={blocked}
      aria-busy={pending || undefined}
      data-facebai-action
      data-facebai-pending={pending ? "true" : "false"}
    >
      {pending ? (pendingIndicator ?? <span className={styles.spinner} aria-hidden="true" />) : null}
      <span>{pending ? (pendingLabel ?? children) : children}</span>
    </button>
  );
}

type GovernedIconButtonProps = Omit<GovernedButtonProps, "children" | "aria-label"> & {
  "aria-label": string;
  children: ReactNode;
};

export function GovernedIconButton({ className, children, ...props }: GovernedIconButtonProps) {
  return (
    <GovernedButton
      {...props}
      className={[styles.iconButton, className].filter(Boolean).join(" ")}
    >
      {children}
    </GovernedButton>
  );
}
