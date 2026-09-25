export const POST_FEED_PAGE_SIZE = 20;

export type PostFeedCursor = {
  createdAt: string;
  id: string;
};

const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CURSOR_SEPARATOR = "~";

export function encodePostFeedCursor(cursor: PostFeedCursor): string {
  return `${cursor.createdAt}${CURSOR_SEPARATOR}${cursor.id}`;
}

export function parsePostFeedCursor(value: string | undefined): PostFeedCursor | null {
  if (!value) return null;

  const separatorIndex = value.lastIndexOf(CURSOR_SEPARATOR);
  if (separatorIndex <= 0 || separatorIndex === value.length - 1) return null;

  const createdAt = value.slice(0, separatorIndex);
  const id = value.slice(separatorIndex + 1);

  if (!ISO_TIMESTAMP_PATTERN.test(createdAt) || Number.isNaN(Date.parse(createdAt))) return null;
  if (!UUID_PATTERN.test(id)) return null;

  return { createdAt, id };
}

export function buildPostFeedCursorFilter(cursor: PostFeedCursor): string {
  return `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`;
}
