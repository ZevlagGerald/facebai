import type { ReactNode } from "react";
import styles from "./governed-ui.module.css";

export type InlineStatusTone = "info" | "success" | "warning" | "error";

const iconByTone: Record<InlineStatusTone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

export function InlineStatus({
  tone,
  title,
  children,
  className,
  unstyled = false,
  icon,
  iconClassName,
  copyClassName,
}: {
  tone: InlineStatusTone;
  title: string;
  children: ReactNode;
  className?: string;
  unstyled?: boolean;
  icon?: ReactNode;
  iconClassName?: string;
  copyClassName?: string;
}) {
  const role = tone === "error" ? "alert" : "status";
  const classes = unstyled
    ? className
    : [styles.status, styles[tone], className].filter(Boolean).join(" ");
  const resolvedIconClass = unstyled
    ? iconClassName
    : [styles.statusIcon, iconClassName].filter(Boolean).join(" ");
  const resolvedCopyClass = unstyled
    ? copyClassName
    : [styles.statusCopy, copyClassName].filter(Boolean).join(" ");

  return (
    <div className={classes} role={role} aria-live={tone === "error" ? "assertive" : "polite"} aria-atomic="true">
      <span className={resolvedIconClass} aria-hidden="true">{icon ?? iconByTone[tone]}</span>
      <div>
        <strong>{title}</strong>
        <div className={resolvedCopyClass}>{children}</div>
      </div>
    </div>
  );
}
