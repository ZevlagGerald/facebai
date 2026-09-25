import Link from "next/link";
import { SocialIcon } from "@/app/components/social-icons";
import styles from "@/app/components/profile-surface.module.css";

export function ProfileHero({
  displayName,
  username,
  bio,
  avatarUrl,
  coverUrl,
  actionHref,
  actionLabel = "Edit profile",
}: {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  actionHref?: string;
  actionLabel?: string;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";

  return (
    <section className={styles.hero} aria-label={`${displayName}'s profile`}>
      <div className={styles.cover}>
        {coverUrl ? (
          <img className={styles.coverImage} src={coverUrl} alt={`${displayName} cover`} />
        ) : (
          <div className={styles.coverFallback} aria-label="No cover photo yet">
            <SocialIcon name="photo" size={22} />
            <span>No cover photo yet</span>
          </div>
        )}
      </div>

      <div className={styles.identityRow}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img className={styles.avatarImage} src={avatarUrl} alt={`${displayName} profile`} />
          ) : (
            <span aria-label="No profile photo yet">{initial}</span>
          )}
        </div>
        <div className={styles.identity}>
          <h1>{displayName}</h1>
          <p className={styles.handle}>@{username}</p>
          <p className={`${styles.bio} ${bio ? "" : styles.emptyBio}`}>{bio || "Wala pay bio. Kuan sa."}</p>
        </div>
        {actionHref ? (
          <div className={styles.profileActions}>
            <Link className={styles.primaryAction} href={actionHref}>
              <SocialIcon name="edit" size={18} />
              {actionLabel}
            </Link>
          </div>
        ) : null}
      </div>

      <nav className={styles.profileTabs} aria-label="Profile sections">
        <span className={`${styles.profileTab} ${styles.profileTabActive}`} aria-current="page">Profile</span>
        <span className={styles.profileTab} aria-disabled="true">Mga Post <small>PUHON</small></span>
        <span className={styles.profileTab} aria-disabled="true">Mga Litrato <small>PUHON</small></span>
      </nav>
    </section>
  );
}
