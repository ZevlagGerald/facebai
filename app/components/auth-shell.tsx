import { ThemeToggle } from "./theme-toggle";

export function AuthShell({
  children,
  eyebrow = "FACEBAI ACCOUNT",
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <main className="auth-shell">
      <div className="auth-background" aria-hidden="true" />
      <div className="auth-shade" aria-hidden="true" />
      <ThemeToggle />

      <section className="auth-stage" aria-label="FaceBai account access">
        <aside className="auth-brand" aria-label="FaceBai">
          <div className="auth-logo-slot">
            <img className="logo logo-stable" src="/brand/facebai-logo-light.webp?v=stable-20260925" alt="FaceBai" />
          </div>
          <p className="auth-domain">facebai.party</p>
          <div className="auth-brand-copy">
            <h2>Mas Lami ang Kinabuhi Together.</h2>
            <p>Same People. Mas Lami nga Connections.</p>
          </div>
        </aside>

        <div className="auth-card-wrap">
          <div className="auth-card-eyebrow">{eyebrow}</div>
          <div className="auth-card">{children}</div>
          <p className="auth-footnote">FaceBai uses secure account verification and Cloudflare Turnstile.</p>
        </div>
      </section>
    </main>
  );
}
