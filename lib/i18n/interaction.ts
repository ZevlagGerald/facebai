import type { Locale } from "./config";

export type InteractionMessageKey =
  | "theme.switchDark"
  | "theme.switchLight"
  | "common.loggingOut"
  | "common.retry"
  | "language.changing"
  | "profile.loadFailedTitle"
  | "profile.loadFailed"
  | "profile.validationDisplayName"
  | "profile.validationUsername"
  | "profile.validationBio"
  | "profile.usernameTaken"
  | "profile.saveFailed"
  | "profile.discardTitle"
  | "profile.discardBody"
  | "profile.keepEditing"
  | "profile.discardChanges"
  | "profile.mediaInvalidType"
  | "profile.mediaEmpty"
  | "profile.mediaTooLarge"
  | "profile.mediaSessionExpired"
  | "profile.mediaUploadFailed"
  | "profile.mediaVerifyFailed"
  | "profile.mediaProfileLoadFailed"
  | "profile.mediaSaveFailed"
  | "profile.mediaRetry"
  | "profile.mediaErrorTitle"
  | "profile.mediaSuccessTitle";

const ceb: Record<InteractionMessageKey, string> = {
  "theme.switchDark": "Balhin sa dark mode",
  "theme.switchLight": "Balhin sa light mode",
  "common.loggingOut": "Nag-log out…",
  "common.retry": "Usba daw",
  "language.changing": "Gina-ilis ang pinulongan…",
  "profile.loadFailedTitle": "Dili ma-load ang imong profile",
  "profile.loadFailed": "Dili namo makuha ang imong profile karon. Sulayi pag-usab sa makadiyot.",
  "profile.validationDisplayName": "Ang display name kinahanglan 2–80 ka karakter.",
  "profile.validationUsername": "Ang username kinahanglan 3–30 ka lowercase nga letra, numero, tuldok, o underscore.",
  "profile.validationBio": "Ang bio kinahanglan 500 ka karakter o mas mubo.",
  "profile.usernameTaken": "Gigamit na kana nga username. Sulayi og lain, Bai.",
  "profile.saveFailed": "Sus, naay nisipyat samtang nag-save sa profile. Sulayi pag-usab.",
  "profile.discardTitle": "I-discard ang wala pa na-save nga kausaban?",
  "profile.discardBody": "Mawala ang mga kausaban nga wala pa nimo na-save.",
  "profile.keepEditing": "Padayon sa pag-edit",
  "profile.discardChanges": "I-discard ang kausaban",
  "profile.mediaInvalidType": "Pilia ang JPEG, PNG, o WebP nga image.",
  "profile.mediaEmpty": "Walay sulod ang image. Pilia ang laing file.",
  "profile.mediaTooLarge": "Ang image kinahanglan 5 MB o mas gamay.",
  "profile.mediaSessionExpired": "Na-expire ang imong session. Sign in pag-usab ug sulayi balik.",
  "profile.mediaUploadFailed": "Napakyas ang upload. Susiha ang koneksyon ug sulayi balik.",
  "profile.mediaVerifyFailed": "Dili ma-verify ang gi-upload nga image. Sulayi balik.",
  "profile.mediaProfileLoadFailed": "Dili ma-load ang profile. Sulayi balik.",
  "profile.mediaSaveFailed": "Dili ma-save ang profile image. Sulayi balik.",
  "profile.mediaRetry": "Usba daw ang upload",
  "profile.mediaErrorTitle": "Wala nadayon ang upload",
  "profile.mediaSuccessTitle": "Na-update ang profile media",
};

const tl: Record<InteractionMessageKey, string> = {
  "theme.switchDark": "Lumipat sa dark mode",
  "theme.switchLight": "Lumipat sa light mode",
  "common.loggingOut": "Nagla-log out…",
  "common.retry": "Subukan muli",
  "language.changing": "Pinapalitan ang wika…",
  "profile.loadFailedTitle": "Hindi ma-load ang profile mo",
  "profile.loadFailed": "Hindi namin makuha ang profile mo ngayon. Subukan muli makalipas ang ilang sandali.",
  "profile.validationDisplayName": "Dapat 2–80 character ang display name.",
  "profile.validationUsername": "Dapat 3–30 lowercase na letra, numero, tuldok, o underscore ang username.",
  "profile.validationBio": "Dapat 500 character o mas maikli ang bio.",
  "profile.usernameTaken": "Ginagamit na ang username na iyon. Subukan ang iba, Bai.",
  "profile.saveFailed": "Hindi na-save ang profile. Subukan muli.",
  "profile.discardTitle": "I-discard ang mga hindi pa na-save na pagbabago?",
  "profile.discardBody": "Mawawala ang mga pagbabagong hindi mo pa na-save.",
  "profile.keepEditing": "Magpatuloy sa pag-edit",
  "profile.discardChanges": "I-discard ang mga pagbabago",
  "profile.mediaInvalidType": "Pumili ng JPEG, PNG, o WebP image.",
  "profile.mediaEmpty": "Walang laman ang image. Pumili ng ibang file.",
  "profile.mediaTooLarge": "Dapat 5 MB o mas maliit ang image.",
  "profile.mediaSessionExpired": "Nag-expire ang session mo. Mag-sign in ulit at subukan muli.",
  "profile.mediaUploadFailed": "Hindi na-upload. Suriin ang koneksyon at subukan muli.",
  "profile.mediaVerifyFailed": "Hindi ma-verify ang na-upload na image. Subukan muli.",
  "profile.mediaProfileLoadFailed": "Hindi ma-load ang profile. Subukan muli.",
  "profile.mediaSaveFailed": "Hindi ma-save ang profile image. Subukan muli.",
  "profile.mediaRetry": "Subukan muli ang upload",
  "profile.mediaErrorTitle": "Hindi natuloy ang upload",
  "profile.mediaSuccessTitle": "Na-update ang profile media",
};

const en: Record<InteractionMessageKey, string> = {
  "theme.switchDark": "Switch to dark mode",
  "theme.switchLight": "Switch to light mode",
  "common.loggingOut": "Logging out…",
  "common.retry": "Try again",
  "language.changing": "Changing language…",
  "profile.loadFailedTitle": "We couldn't load your profile",
  "profile.loadFailed": "Your profile is unavailable right now. Please try again in a moment.",
  "profile.validationDisplayName": "Display name must be 2–80 characters.",
  "profile.validationUsername": "Username must be 3–30 lowercase letters, numbers, dots, or underscores.",
  "profile.validationBio": "Bio must be 500 characters or fewer.",
  "profile.usernameTaken": "That username is already taken. Try another one, Bai.",
  "profile.saveFailed": "Your profile could not be saved. Please try again.",
  "profile.discardTitle": "Discard unsaved changes?",
  "profile.discardBody": "Changes you have not saved will be lost.",
  "profile.keepEditing": "Keep editing",
  "profile.discardChanges": "Discard changes",
  "profile.mediaInvalidType": "Choose a JPEG, PNG, or WebP image.",
  "profile.mediaEmpty": "That image is empty. Choose another file.",
  "profile.mediaTooLarge": "Image must be 5 MB or smaller.",
  "profile.mediaSessionExpired": "Your session expired. Sign in again and retry.",
  "profile.mediaUploadFailed": "Upload failed. Check your connection and retry.",
  "profile.mediaVerifyFailed": "The uploaded image could not be verified. Please retry.",
  "profile.mediaProfileLoadFailed": "Your profile could not be loaded. Please retry.",
  "profile.mediaSaveFailed": "The profile image could not be saved. Please retry.",
  "profile.mediaRetry": "Retry upload",
  "profile.mediaErrorTitle": "Upload unsuccessful",
  "profile.mediaSuccessTitle": "Profile media updated",
};

const dictionaries: Record<Locale, Readonly<Record<InteractionMessageKey, string>>> = { ceb, tl, en };

export function getInteractionTranslations(locale: Locale) {
  const dictionary = dictionaries[locale];
  return (key: InteractionMessageKey): string => dictionary[key];
}
