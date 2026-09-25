import styles from "@/app/components/profile-surface.module.css";

export function ProfileHero({
  displayName,
  username,
  bio,
  avatarUrl,
  coverUrl,
}: {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";

  return (
    <section className={styles.hero} aria-label={`${displayName}'s profile`}>
      <div className={styles.cover}>
        {coverUrl ? (
          <img className={styles.coverImage} src={coverUrl} alt={`${displayName} cover`} />
        ) : (
          <span className={styles.mediaPill}>NO COVER PHOTO YET</span>
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
          <p className={`${styles.bio} ${bio ? "" : styles.emptyBio}`}>
            {bio || "Wala pay bio. Kuan sa."}
          </p>
        </div>
      </div>
    </section>
  );
}
