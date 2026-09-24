type AuthStatusTone = "info" | "success" | "warning" | "error";

const iconByTone: Record<AuthStatusTone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

export function AuthStatus({
  tone,
  title,
  children,
}: {
  tone: AuthStatusTone;
  title: string;
  children: React.ReactNode;
}) {
  const role = tone === "error" ? "alert" : "status";

  return (
    <div className={`auth-status auth-status-${tone}`} role={role} aria-live={tone === "error" ? "assertive" : "polite"}>
      <span className="auth-status-icon" aria-hidden="true">{iconByTone[tone]}</span>
      <div>
        <strong>{title}</strong>
        <div className="auth-status-copy">{children}</div>
      </div>
    </div>
  );
}
