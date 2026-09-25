import type { ReactNode } from "react";
import styles from "./governed-ui.module.css";

export function GovernedDisclosure({
  summary,
  children,
  name,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  name?: string;
  className?: string;
}) {
  return (
    <details className={[styles.disclosure, className].filter(Boolean).join(" ")} name={name}>
      <summary data-facebai-action>{summary}</summary>
      <div className={styles.disclosureBody}>{children}</div>
    </details>
  );
}
