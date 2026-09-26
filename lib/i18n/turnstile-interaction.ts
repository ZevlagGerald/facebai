import type { TurnstileClientFailureKind } from "@/lib/auth/turnstile-client";
import type { Locale } from "@/lib/i18n/config";

type TurnstileInteractionCopy = {
  title: string;
  unavailableTitle: string;
  unavailableBody: string;
  loading: string;
  delayed: string;
  ready: string;
  verified: string;
  expired: string;
  retrying: string;
  timeout: string;
  unsupported: string;
  retry: string;
  diagnosticLabel: string;
  errors: Record<TurnstileClientFailureKind, string>;
};

const COPY: Record<Locale, TurnstileInteractionCopy> = {
  ceb: {
    title: "Security check",
    unavailableTitle: "Dili available ang security check.",
    unavailableBody: "Dili luwas nga ma-submit sa FaceBai kini nga form karon. Sulayi pag-usab unya.",
    loading: "Gina-load ang secure verification…",
    delayed: "Dugay gamay ang security check. Pwede ka maghulat o mosulay pag-usab.",
    ready: "Kompletoha ang check sa ubos aron mopadayon.",
    verified: "Kompleto na ang security check.",
    expired: "Na-expire ang security check. Verify pag-usab.",
    retrying: "Gina-restart ang security check…",
    timeout: "Na-time out ang security check. Sulayi pag-usab.",
    unsupported: "Dili suportado sa security check kini nga browser. Gamita ang updated nga browser.",
    retry: "Usba daw ang security check",
    diagnosticLabel: "Reference code",
    errors: {
      configuration: "Dili magamit ang security check niini nga page karon.",
      clock_or_cache: "Naay problema sa oras o cached verification. Susiha ang oras sa device ug i-reload ang page.",
      iframe_load: "Dili ma-load ang security check. Susiha ang koneksyon o browser blocker ug sulayi pag-usab.",
      timeout: "Na-time out ang security check. Sulayi pag-usab.",
      challenge: "Wala nahuman ang security check. Sulayi pag-usab.",
      unknown: "Naay problema sa security check. Sulayi pag-usab.",
    },
  },
  tl: {
    title: "Security check",
    unavailableTitle: "Hindi available ang security check.",
    unavailableBody: "Hindi ligtas na isumite ang form na ito sa FaceBai ngayon. Subukan muli mamaya.",
    loading: "Nilo-load ang secure verification…",
    delayed: "Mas matagal ang security check kaysa karaniwan. Maaari kang maghintay o subukan muli.",
    ready: "Kumpletuhin ang check sa ibaba para magpatuloy.",
    verified: "Kumpleto na ang security check.",
    expired: "Nag-expire ang security check. Mag-verify muli.",
    retrying: "Nire-restart ang security check…",
    timeout: "Nag-time out ang security check. Subukan muli.",
    unsupported: "Hindi suportado ng security check ang browser na ito. Gumamit ng updated na browser.",
    retry: "Subukan muli ang security check",
    diagnosticLabel: "Reference code",
    errors: {
      configuration: "Hindi magamit ang security check sa page na ito ngayon.",
      clock_or_cache: "May problema sa oras o cached verification. Suriin ang oras ng device at i-reload ang page.",
      iframe_load: "Hindi ma-load ang security check. Suriin ang koneksyon o browser blocker at subukan muli.",
      timeout: "Nag-time out ang security check. Subukan muli.",
      challenge: "Hindi nakumpleto ang security check. Subukan muli.",
      unknown: "Nagkaroon ng problema sa security check. Subukan muli.",
    },
  },
  en: {
    title: "Security check",
    unavailableTitle: "Security check unavailable.",
    unavailableBody: "This form cannot be safely submitted to FaceBai right now. Try again later.",
    loading: "Loading secure verification…",
    delayed: "The security check is taking longer than expected. You can wait or try again.",
    ready: "Complete the check below to continue.",
    verified: "Security check complete.",
    expired: "The security check expired. Verify again.",
    retrying: "Restarting the security check…",
    timeout: "The security check timed out. Try again.",
    unsupported: "This browser is not supported by the security check. Use an up-to-date browser.",
    retry: "Try the security check again",
    diagnosticLabel: "Reference code",
    errors: {
      configuration: "The security check cannot run on this page right now.",
      clock_or_cache: "There is a clock or cached-verification problem. Check your device time and reload the page.",
      iframe_load: "The security check could not load. Check your connection or browser blocker and try again.",
      timeout: "The security check timed out. Try again.",
      challenge: "The security check could not finish. Try again.",
      unknown: "There was a problem with the security check. Try again.",
    },
  },
};

export function getTurnstileInteractionCopy(locale: Locale): TurnstileInteractionCopy {
  return COPY[locale];
}
