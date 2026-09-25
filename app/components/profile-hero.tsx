import styles from "@/app/components/profile-surface.module.css";

export function ProfileHero({
  displayName,
  username,
  bio,
}: {
  displayName: string;
  username: string;
  bio: string;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";

  return (
    <section className={styles.hero} aria-label={`${displayName}'s profile`}>
      <div className={styles.cover} aria-label="Cover photo coming soon">
        <span className={styles.mediaPill}>PUHON · COVER PHOTO</span>
      </div>
      <div className={styles.identityRow}>
        <div className={styles.avatar} aria-label="Profile photo coming soon">{initial}</div>
        <div className={styles.identity}>
          <h1>{displayName}</h1>
          <p className={styles.handle}>@{username}</p>
          <p className={`${styles.bio} ${bio ? "" : styles.emptyBio}`}>
            {bio || "Wala pay bio. Kuan sa."}
          </p>
        </div>
      </div>
    </section>
  );
}
