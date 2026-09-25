import { InlineStatus, type InlineStatusTone } from "./inline-status";

const iconByTone: Record<InlineStatusTone, string> = {
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
  tone: InlineStatusTone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <InlineStatus
      tone={tone}
      title={title}
      className={`auth-status auth-status-${tone}`}
      icon={iconByTone[tone]}
      iconClassName="auth-status-icon"
      copyClassName="auth-status-copy"
      unstyled
    >
      {children}
    </InlineStatus>
  );
}
