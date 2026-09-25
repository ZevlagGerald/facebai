import type { Locale } from "./config";

export type F3PostMessageKey =
  | "composer.label"
  | "composer.placeholder"
  | "composer.post"
  | "composer.posting"
  | "composer.bodyRequired"
  | "composer.bodyTooLong"
  | "composer.saveFailedTitle"
  | "composer.saveFailed"
  | "composer.savedTitle"
  | "composer.saved"
  | "feed.listLabel"
  | "feed.emptyTitle"
  | "feed.emptyBody"
  | "feed.loadFailedTitle"
  | "feed.loadFailedBody"
  | "feed.paginationLabel"
  | "feed.olderPosts"
  | "feed.newestPosts"
  | "feed.noOlderTitle"
  | "feed.noOlderBody";

const ceb: Record<F3PostMessageKey, string> = {
  "composer.label": "Paghimo og post",
  "composer.placeholder": "Unsay naa sa imong hunahuna, Bai?",
  "composer.post": "I-post",
  "composer.posting": "Gina-post…",
  "composer.bodyRequired": "Pagsulat usa og mensahe antes i-post.",
  "composer.bodyTooLong": "Ang post kinahanglan 5,000 ka karakter o mas mubo.",
  "composer.saveFailedTitle": "Wala nadayon ang post",
  "composer.saveFailed": "Dili ma-save ang imong post karon. Sulayi pag-usab.",
  "composer.savedTitle": "Na-post na",
  "composer.saved": "Na-post na sa Tambayan ang imong mensahe.",
  "feed.listLabel": "Mga post sa Tambayan",
  "feed.emptyTitle": "Hilom pa ang Tambayan",
  "feed.emptyBody": "Wala pay mga post. Ikaw mahimong unang mo-share, Bai.",
  "feed.loadFailedTitle": "Dili ma-load ang Tambayan",
  "feed.loadFailedBody": "Dili namo makuha ang mga post karon. Sulayi pag-usab.",
  "feed.paginationLabel": "Pag-navigate sa mga post",
  "feed.olderPosts": "Mas daang mga post",
  "feed.newestPosts": "Pinakabag-ong mga post",
  "feed.noOlderTitle": "Mao na kini ang katapusan",
  "feed.noOlderBody": "Wala nay mas daang post nga ipakita.",
};

const tl: Record<F3PostMessageKey, string> = {
  "composer.label": "Gumawa ng post",
  "composer.placeholder": "Ano ang nasa isip mo, Bai?",
  "composer.post": "I-post",
  "composer.posting": "Pino-post…",
  "composer.bodyRequired": "Sumulat muna ng mensahe bago mag-post.",
  "composer.bodyTooLong": "Dapat 5,000 character o mas maikli ang post.",
  "composer.saveFailedTitle": "Hindi na-post",
  "composer.saveFailed": "Hindi ma-save ang post mo ngayon. Subukan muli.",
  "composer.savedTitle": "Na-post na",
  "composer.saved": "Na-post na sa Tambayan ang mensahe mo.",
  "feed.listLabel": "Mga post sa Tambayan",
  "feed.emptyTitle": "Tahimik pa ang Tambayan",
  "feed.emptyBody": "Wala pang mga post. Maaari kang maunang magbahagi, Bai.",
  "feed.loadFailedTitle": "Hindi ma-load ang Tambayan",
  "feed.loadFailedBody": "Hindi namin makuha ang mga post ngayon. Subukan muli.",
  "feed.paginationLabel": "Pag-navigate sa mga post",
  "feed.olderPosts": "Mas lumang mga post",
  "feed.newestPosts": "Pinakabagong mga post",
  "feed.noOlderTitle": "Dulo na ito",
  "feed.noOlderBody": "Wala nang mas lumang post na maipapakita.",
};

const en: Record<F3PostMessageKey, string> = {
  "composer.label": "Create a post",
  "composer.placeholder": "What's on your mind, Bai?",
  "composer.post": "Post",
  "composer.posting": "Posting…",
  "composer.bodyRequired": "Write something before posting.",
  "composer.bodyTooLong": "Post must be 5,000 characters or fewer.",
  "composer.saveFailedTitle": "Post not published",
  "composer.saveFailed": "Your post could not be saved right now. Please try again.",
  "composer.savedTitle": "Posted",
  "composer.saved": "Your post is now published in Tambayan.",
  "feed.listLabel": "Tambayan posts",
  "feed.emptyTitle": "Tambayan is quiet for now",
  "feed.emptyBody": "There are no posts yet. You can be the first to share, Bai.",
  "feed.loadFailedTitle": "We couldn't load Tambayan",
  "feed.loadFailedBody": "Posts are unavailable right now. Please try again.",
  "feed.paginationLabel": "Post navigation",
  "feed.olderPosts": "Older posts",
  "feed.newestPosts": "Newest posts",
  "feed.noOlderTitle": "You've reached the end",
  "feed.noOlderBody": "There are no older posts to show.",
};

const dictionaries: Record<Locale, Readonly<Record<F3PostMessageKey, string>>> = { ceb, tl, en };

export function getF3PostTranslations(locale: Locale) {
  const dictionary = dictionaries[locale];
  return (key: F3PostMessageKey): string => dictionary[key];
}
