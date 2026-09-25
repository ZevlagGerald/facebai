import Link from "next/link";
import { redirect } from "next/navigation";
import { PostComposer } from "@/app/components/post-composer";
import { PostFeed, type PostFeedItem } from "@/app/components/post-feed";
import profileStyles from "@/app/components/profile-surface.module.css";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getF3PostTranslations } from "@/lib/i18n/f3-posts";
import { getLocale } from "@/lib/i18n/server";
import {
  buildPostFeedCursorFilter,
  encodePostFeedCursor,
  parsePostFeedCursor,
  POST_FEED_PAGE_SIZE,
} from "@/lib/posts/feed";
import { createClient } from "@/lib/supabase/server";
import styles from "./tambayan.module.css";

export const dynamic = "force-dynamic";

type TambayanSearchParams = {
  cursor?: string | string[];
};

export default async function TambayanPage({
  searchParams,
}: {
  searchParams?: Promise<TambayanSearchParams>;
}) {
  const params = searchParams ? await searchParams : {};
  const rawCursor = Array.isArray(params.cursor) ? params.cursor[0] : params.cursor;
  const cursor = parsePostFeedCursor(rawCursor);
  if (rawCursor && !cursor) redirect("/tambayan");

  const locale = await getLocale();
  const t = getF2SocialTranslations(locale);
  const t3 = getF3PostTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return (
      <main className={styles.shell}>
        <div className={styles.layout}>
          <aside className={styles.leftRail} aria-hidden="true" />
          <section className={styles.feed} aria-label={ti("profile.loadFailedTitle")}>
            <header className={styles.feedHeading}>
              <div>
                <p className={styles.eyebrow}>FACEBAI</p>
                <h1 id="profile-load-failed-title">{ti("profile.loadFailedTitle")}</h1>
              </div>
            </header>

            <section
              className={styles.emptyFeed}
              role="alert"
              aria-labelledby="profile-load-failed-title"
            >
              <div className={styles.emptyMark} aria-hidden="true">
                <SocialIcon name="user" size={24} />
              </div>
              <p>{ti("profile.loadFailed")}</p>
              <Link className={profileStyles.secondaryLink} href="/tambayan">
                {ti("common.retry")}
              </Link>
            </section>
          </section>
          <aside className={styles.rightRail} aria-hidden="true" />
        </div>
      </main>
    );
  }

  let postsQuery = supabase
    .from("posts")
    .select("id, body, created_at, author:profiles!posts_author_id_fkey(username, display_name)")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(POST_FEED_PAGE_SIZE + 1);

  if (cursor) {
    postsQuery = postsQuery.or(buildPostFeedCursorFilter(cursor));
  }

  const { data: postRows, error: postsError } = await postsQuery;
  const visibleRows = postRows?.slice(0, POST_FEED_PAGE_SIZE) ?? [];
  const posts: PostFeedItem[] = visibleRows.flatMap((row) => {
    if (!row.author) return [];

    return [{
      id: row.id,
      body: row.body,
      createdAt: row.created_at,
      author: {
        username: row.author.username,
        displayName: row.author.display_name,
      },
    }];
  });
  const authorIntegrityFailed = posts.length !== visibleRows.length;
  const feedLoadFailed = Boolean(postsError) || authorIntegrityFailed;
  const hasMore = (postRows?.length ?? 0) > POST_FEED_PAGE_SIZE;
  const lastVisibleRow = visibleRows.at(-1);
  const nextCursor = hasMore && lastVisibleRow
    ? encodePostFeedCursor({ createdAt: lastVisibleRow.created_at, id: lastVisibleRow.id })
    : null;

  const displayName = profile.display_name.trim();
  const username = profile.username;
  const initial = displayName.charAt(0).toUpperCase() || "B";

  const rightRail = (
    <>
      <section className={`${styles.sideCard} ${styles.marketCard}`}>
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="market" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>{t("feed.marketEyebrow")}</p>
              <h2>Bai & Sell</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>{t("common.puhon")}</span>
        </div>
        <p className={styles.marketPitch}>{t("feed.marketPitch")}</p>
        <p>{t("feed.marketBody")}</p>
        <button type="button" disabled>{t("feed.marketDisabled")}</button>
        <small>{t("feed.marketFootnote")}</small>
      </section>

      <section className={styles.sideCard} aria-label={t("feed.notificationsAria")}>
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="bell" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>{t("feed.notificationsEyebrow")}</p>
              <h2>{t("feed.notificationsTitle")}</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>{t("common.puhon")}</span>
        </div>
        <div className={styles.quietState}>
          <strong>{t("feed.notificationsEmpty")}</strong>
          <span>{t("feed.notificationsBody")}</span>
        </div>
      </section>
    </>
  );

  return (
    <SocialShell
      displayName={displayName}
      username={username}
      activeRail="tambayan"
      contentLabel={t("feed.contentLabel")}
      rightRail={rightRail}
      locale={locale}
    >
      <header className={styles.feedHeading}>
        <div>
          <p className={styles.eyebrow}>{t("feed.homeFeed")}</p>
          <h1>{t("feed.title")}</h1>
        </div>
        <p>{t("feed.welcome")}, {displayName}.</p>
      </header>

      <section className={styles.composer} aria-label={t3("composer.label")}>
        <PostComposer initial={initial} locale={locale} />
      </section>

      {feedLoadFailed ? (
        <section className={styles.emptyFeed} role="alert">
          <div className={styles.emptyMark} aria-hidden="true"><SocialIcon name="sparkles" size={24} /></div>
          <h2>{t3("feed.loadFailedTitle")}</h2>
          <p>{t3("feed.loadFailedBody")}</p>
          <Link
            className={profileStyles.secondaryLink}
            href={rawCursor ? { pathname: "/tambayan", query: { cursor: rawCursor } } : "/tambayan"}
          >
            {ti("common.retry")}
          </Link>
        </section>
      ) : (
        <PostFeed
          posts={posts}
          locale={locale}
          nextCursor={nextCursor}
          paged={Boolean(cursor)}
        />
      )}
    </SocialShell>
  );
}
