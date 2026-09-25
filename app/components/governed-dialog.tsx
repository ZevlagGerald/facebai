"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { GovernedIconButton } from "./governed-button";
import styles from "./governed-ui.module.css";

export function GovernedDialog({
  open,
  title,
  closeLabel,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]")?.focus();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
      returnFocusRef.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className={styles.dialogHeader}>
        <h2 id={titleId}>{title}</h2>
        <GovernedIconButton
          type="button"
          variant="ghost"
          aria-label={closeLabel}
          onClick={onClose}
          data-dialog-initial-focus
        >
          ×
        </GovernedIconButton>
      </header>
      <div className={styles.dialogBody}>{children}</div>
      {footer ? <footer className={styles.dialogFooter}>{footer}</footer> : null}
    </dialog>
  );
}
