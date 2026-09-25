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
  | "feed.pendingTitle"
  | "feed.pendingBody";

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
  "composer.saved": "Na-save ang imong post. Ang feed display sunod nga tranche pa.",
  "feed.pendingTitle": "Andam na ang post storage",
  "feed.pendingBody": "Tinuod na ang paghimo og text post. Ang pagpakita sa mga post sa Tambayan ma-activate sa sunod nga feed tranche.",
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
  "composer.saved": "Na-save ang post mo. Sa susunod na feed tranche pa ito ipapakita sa feed.",
  "feed.pendingTitle": "Handa na ang post storage",
  "feed.pendingBody": "Totoo na ang paggawa ng text post. Ang pagpapakita ng posts sa Tambayan ay ia-activate sa susunod na feed tranche.",
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
  "composer.saved": "Your post was saved. Feed rendering is the next tranche.",
  "feed.pendingTitle": "Post storage is ready",
  "feed.pendingBody": "Text-post creation is now real. Rendering posts in Tambayan will be activated in the next feed tranche.",
};

const dictionaries: Record<Locale, Readonly<Record<F3PostMessageKey, string>>> = { ceb, tl, en };

export function getF3PostTranslations(locale: Locale) {
  const dictionary = dictionaries[locale];
  return (key: F3PostMessageKey): string => dictionary[key];
}
