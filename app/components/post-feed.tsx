import Link from "next/link";
import { type Locale } from "@/lib/i18n/config";
import { getF3PostTranslations } from "@/lib/i18n/f3-posts";
import styles from "./post-feed.module.css";

export type PostFeedItem = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    username: string;
    displayName: string;
  };
};

const localeTags: Record<Locale, string> = {
  ceb: "ceb-PH",
  tl: "fil-PH",
  en: "en-PH",
};

function formatPostTimestamp(value: string, locale: Locale): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
    timeZoneName: "short",
  }).format(date);
}

export function PostFeed({
  posts,
  locale,
  nextCursor,
  paged,
}: {
  posts: PostFeedItem[];
  locale: Locale;
  nextCursor: string | null;
  paged: boolean;
}) {
  const t = getF3PostTranslations(locale);

  if (posts.length === 0) {
    return (
      <section className={styles.empty} aria-live="polite">
        <h2>{paged ? t("feed.noOlderTitle") : t("feed.emptyTitle")}</h2>
        <p>{paged ? t("feed.noOlderBody") : t("feed.emptyBody")}</p>
        {paged ? (
          <Link className={styles.paginationLink} href="/tambayan">
            {t("feed.newestPosts")}
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section className={styles.feedList} aria-label={t("feed.listLabel")}>
      {posts.map((post) => {
        const initial = post.author.displayName.charAt(0).toUpperCase();

        return (
          <article className={styles.postCard} key={post.id}>
            <header className={styles.postHeader}>
              <Link
                className={styles.authorLink}
                href={`/bai/${encodeURIComponent(post.author.username)}`}
                aria-label={`${post.author.displayName} (@${post.author.username})`}
              >
                <span className={styles.avatar} aria-hidden="true">{initial}</span>
                <span className={styles.authorIdentity}>
                  <strong>{post.author.displayName}</strong>
                  <span>@{post.author.username}</span>
                </span>
              </Link>
              <time className={styles.timestamp} dateTime={post.createdAt}>
                {formatPostTimestamp(post.createdAt, locale)}
              </time>
            </header>

            <p className={styles.postBody}>{post.body}</p>
          </article>
        );
      })}

      {(paged || nextCursor) ? (
        <nav className={styles.pagination} aria-label={t("feed.paginationLabel")}>
          {paged ? (
            <Link className={styles.paginationLink} href="/tambayan">
              {t("feed.newestPosts")}
            </Link>
          ) : <span />}
          {nextCursor ? (
            <Link
              className={styles.paginationLink}
              href={{ pathname: "/tambayan", query: { cursor: nextCursor } }}
            >
              {t("feed.olderPosts")}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}
