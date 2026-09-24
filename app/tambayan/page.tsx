import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TambayanPage() {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  return (
    <main className="tambayan-shell">
      <header className="app-header">
        <img src="/brand/facebai-logo-light.png" alt="FaceBai" className="header-logo logo-light" />
        <img src="/brand/facebai-logo-dark.png" alt="FaceBai" className="header-logo logo-dark" />
        <form action={logout}><button type="submit" className="secondary-button">Log out</button></form>
      </header>
      <section className="welcome-card">
        <p className="eyebrow">TAMBAYAN</p>
        <h1>Maayong pag-abot{profile?.display_name ? `, ${profile.display_name}` : ""}.</h1>
        <p>@{profile?.username ?? "bai"}</p>
        <p>This is now an authenticated database-backed FaceBai session. Posts and the social graph come in the next tranche.</p>
      </section>
    </main>
  );
}
