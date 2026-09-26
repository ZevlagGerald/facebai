import type { AuthErrorCode, AuthSuccessCode } from "@/lib/auth/action-state";
import type { Locale } from "@/lib/i18n/config";

type AuthInteractionCopy = {
  attentionTitle: string;
  successTitle: string;
  requestAnotherVerification: string;
  requestAnotherVerificationHint: string;
  errors: Record<AuthErrorCode, string>;
  successes: Record<AuthSuccessCode, string>;
};

const COPY: Record<Locale, AuthInteractionCopy> = {
  ceb: {
    attentionTitle: "Naay kinahanglan ayuhon",
    successTitle: "Nahuman na",
    requestAnotherVerification: "Mangayo og laing verification email",
    requestAnotherVerificationHint: "Kung kinahanglan nimo og bag-ong email, ablihi pag-usab ang resend form ug kompletoha ang security check.",
    errors: {
      full_name_invalid: "Ibutang ang imong ngalan gamit ang 2–80 ka karakter.",
      username_invalid: "Ang username kinahanglan 3–30 ka lowercase nga letra, numero, tuldok, o underscore.",
      email_invalid: "Ibutang ang balidong email address.",
      password_too_short: "Gamita ang password nga adunay labing menos 10 ka karakter.",
      passwords_mismatch: "Dili pareho ang duha ka password.",
      adult_required: "Ang FaceBai private beta para sa 18 anyos pataas.",
      terms_required: "Kinahanglan mouyon ka sa Terms ug Privacy Notice.",
      security_required: "Kompletoha una ang security check.",
      security_failed: "Wala nadawat ang security check. Sulayi pag-usab ang security check.",
      too_many_requests: "Daghan kaayong pagsulay karon. Hulata kadiyot ug sulayi pag-usab.",
      email_rate_limited: "Bag-o pa adunay email request. Hulata kadiyot sa dili pa mosulay pag-usab.",
      registration_failed: "Wala nakompleto ang registration. Susiha ang imong detalye ug sulayi pag-usab.",
      login_failed: "Sayop ang email o password.",
      verification_resend_failed: "Dili pa mapadala ang bag-ong verification email. Hulata kadiyot ug sulayi pag-usab.",
      recovery_failed: "Dili mapadala ang recovery email karon. Sulayi pag-usab human sa makadiyot.",
      password_update_failed: "Wala mausab ang password. Pangayo og bag-ong recovery link ug sulayi pag-usab.",
      session_expired: "Nahuman na ang recovery session. Pangayo og bag-ong recovery link aron makapadayon.",
    },
    successes: {
      recovery_sent: "Kung mahimo ang recovery alang sa maong email, susiha ang inbox ug spam folder para sa instruksyon. Kung walay moabot, hulata kadiyot sa dili pa mosulay pag-usab.",
      verification_sent: "Kung mahimo ang bag-ong verification email, susiha ang inbox ug spam folder. Kung walay moabot, hulata kadiyot sa dili pa mosulay pag-usab.",
      password_updated: "Na-update ang imong password. Sign in pag-usab gamit ang bag-ong password.",
    },
  },
  tl: {
    attentionTitle: "May kailangang ayusin",
    successTitle: "Tapos na",
    requestAnotherVerification: "Humingi ng isa pang verification email",
    requestAnotherVerificationHint: "Kung kailangan mo ng panibagong email, buksan muli ang resend form at kumpletuhin ang security check.",
    errors: {
      full_name_invalid: "Ilagay ang iyong pangalan gamit ang 2–80 character.",
      username_invalid: "Ang username ay dapat 3–30 lowercase na letra, numero, tuldok, o underscore.",
      email_invalid: "Maglagay ng wastong email address.",
      password_too_short: "Gumamit ng password na may hindi bababa sa 10 character.",
      passwords_mismatch: "Hindi magkapareho ang dalawang password.",
      adult_required: "Ang FaceBai private beta ay para sa edad 18 pataas.",
      terms_required: "Kailangan mong sumang-ayon sa Terms at Privacy Notice.",
      security_required: "Kumpletuhin muna ang security check.",
      security_failed: "Hindi tinanggap ang security check. Subukan muli ang security check.",
      too_many_requests: "Masyadong maraming pagsubok ngayon. Maghintay sandali at subukan muli.",
      email_rate_limited: "May kamakailang email request. Maghintay sandali bago subukan muli.",
      registration_failed: "Hindi nakumpleto ang registration. Suriin ang iyong detalye at subukan muli.",
      login_failed: "Mali ang email o password.",
      verification_resend_failed: "Hindi pa maipadala ang bagong verification email. Maghintay sandali at subukan muli.",
      recovery_failed: "Hindi maipadala ang recovery email ngayon. Subukan muli makalipas ang ilang sandali.",
      password_update_failed: "Hindi na-update ang password. Humingi ng bagong recovery link at subukan muli.",
      session_expired: "Tapos na ang recovery session. Humingi ng bagong recovery link para magpatuloy.",
    },
    successes: {
      recovery_sent: "Kung available ang recovery para sa email na iyon, tingnan ang inbox at spam folder para sa instruksyon. Kung walang dumating, maghintay sandali bago subukan muli.",
      verification_sent: "Kung maaaring magpadala ng bagong verification email, tingnan ang inbox at spam folder. Kung walang dumating, maghintay sandali bago subukan muli.",
      password_updated: "Na-update ang iyong password. Mag-sign in muli gamit ang bagong password.",
    },
  },
  en: {
    attentionTitle: "Something needs attention",
    successTitle: "Completed",
    requestAnotherVerification: "Request another verification email",
    requestAnotherVerificationHint: "If you need another email, reopen the resend form and complete the security check again.",
    errors: {
      full_name_invalid: "Enter your name using 2–80 characters.",
      username_invalid: "Username must be 3–30 lowercase letters, numbers, dots, or underscores.",
      email_invalid: "Enter a valid email address.",
      password_too_short: "Use a password with at least 10 characters.",
      passwords_mismatch: "The two passwords do not match.",
      adult_required: "FaceBai private beta currently requires users to be 18 or older.",
      terms_required: "You must accept the Terms and Privacy Notice.",
      security_required: "Complete the security check before continuing.",
      security_failed: "The security check was not accepted. Retry the security check.",
      too_many_requests: "There have been too many attempts. Wait a moment and try again.",
      email_rate_limited: "An email was requested recently. Wait a moment before trying again.",
      registration_failed: "Registration could not be completed. Check your details and try again.",
      login_failed: "Incorrect email or password.",
      verification_resend_failed: "A new verification email could not be sent yet. Wait a moment and try again.",
      recovery_failed: "The recovery email could not be sent right now. Wait a moment and try again.",
      password_update_failed: "The password could not be updated. Request a new recovery link and try again.",
      session_expired: "The recovery session has ended. Request a new recovery link to continue.",
    },
    successes: {
      recovery_sent: "If recovery is available for that email, check the inbox and spam folder for instructions. If nothing arrives, wait a moment before trying again.",
      verification_sent: "If another verification email can be sent, check the inbox and spam folder. If nothing arrives, wait a moment before trying again.",
      password_updated: "Your password has been updated. Sign in again with the new password.",
    },
  },
};

export function getAuthInteractionCopy(locale: Locale): AuthInteractionCopy {
  return COPY[locale];
}
