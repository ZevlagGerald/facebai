import styles from "./governed-ui.module.css";

export function ProgressIndicator({ label }: { label: string }) {
  return (
    <span className={styles.progress} role="status" aria-live="polite" aria-atomic="true">
      <span className={styles.progressSpinner} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
