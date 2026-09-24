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
          <img className="logo logo-light" src="/brand/facebai-logo-light.png" alt="FaceBai" />
          <img className="logo logo-dark" src="/brand/facebai-logo-dark.png" alt="FaceBai" />
          <div className="auth-brand-copy">
            <p className="auth-brand-kicker">TAMBAYAN NATO TANAN</p>
            <h2>Real people. Real stories. Atong dapit.</h2>
            <p>Join a growing Bisaya community built for conversations, connection, and everyday life.</p>
          </div>
          <div className="auth-trust-row" aria-label="FaceBai account protections">
            <span>Secure account flow</span>
            <span>Privacy-aware</span>
            <span>18+ private beta</span>
          </div>
        </aside>

        <div className="auth-card-wrap">
          <div className="auth-card-eyebrow">{eyebrow}</div>
          <div className="auth-card">{children}</div>
          <p className="auth-footnote">Protected by FaceBai account security and Cloudflare Turnstile.</p>
        </div>
      </section>
    </main>
  );
}
