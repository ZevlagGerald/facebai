import { ThemeToggle } from "./theme-toggle";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-shell">
      <div className="auth-background" aria-hidden="true" />
      <div className="auth-shade" aria-hidden="true" />
      <ThemeToggle />
      <section className="auth-stage">
        <div className="auth-brand">
          <img className="logo logo-light" src="/brand/facebai-logo-light.png" alt="FaceBai" />
          <img className="logo logo-dark" src="/brand/facebai-logo-dark.png" alt="FaceBai" />
          <p>Tambayan sa mga Bisaya — isturya, kuyog, ug komunidad.</p>
        </div>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}
