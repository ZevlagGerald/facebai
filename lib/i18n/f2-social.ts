import type { Locale } from "./config";
import { getTranslations, type MessageKey } from "./messages";

const f2SocialOverrides: Partial<Record<Locale, Partial<Record<MessageKey, string>>>> = {
  ceb: {
    "common.profile": "Ako",
    "common.editProfile": "Usba ang profile",
    "nav.tambayanHelper": "Tambayan feed",
    "nav.profileMenu": "Akong profile",
    "nav.logoutAria": "Lakaw sa FaceBai",
    "feed.homeFeed": "TAMBAYAN FEED",
    "feed.postsAndFeed": "MGA POST UG FEED · PUHON",
    "feed.marketEyebrow": "PUHON",
    "profile.about": "BAHIN",
    "profile.noBioAdd": "Wala pay bio. Pwede ka modugang pinaagi sa pag-usab sa profile.",
    "profile.urlEyebrow": "LINK SA PROFILE",
    "profile.viewUrl": "Tan-awa ang link sa profile",
    "profile.noPosts": "Wala pay mga post sa profile.",
    "profile.postsAndFeed": "PUHON · MGA POST UG FEED",
    "profile.noProfilePhoto": "Wala pay litrato sa profile",
    "profile.tabProfile": "Ako",
    "profile.editProfile": "Usba ang profile",
    "profile.controls": "Mga kontrol sa profile",
    "profile.socialActions": "Mga aksyon sa social",
    "profile.ownerControlBody": "Imoha kini nga profile. Ang mga kontrol naa sa lahi nga panid para sa pag-usab.",
    "profile.editMyProfile": "Usba akong profile",
    "profile.publicIdentity": "Imong identidad sa FaceBai",
    "profile.publicIdentityBody": "Ang ngalan nga makita, username, bio, litrato sa profile, ug cover photo makita sa mga naka-sign in nga FaceBai users.",
    "profile.editIntro": "Dinhi ibutang ang mga kontrol aron social gihapon tan-awon ang main profile.",
    "profile.mediaEyebrow": "MGA LITRATO SA PROFILE",
    "profile.profilePhoto": "Litrato sa profile",
    "profile.profilePhotoHelp": "Pilia ang klaro nga square nga litrato. JPEG, PNG, o WebP hangtod 5 MB.",
    "profile.basicInfo": "PANGUNAHING IMPORMASYON",
    "profile.displayName": "Ngalan nga makita",
    "profile.editContentLabel": "Usba ang imong FaceBai profile",
  },
  tl: {
    "nav.tambayanHelper": "Feed ng Tambayan",
    "nav.friendsHelper": "Mga Kaibigan",
    "nav.groupsHelper": "Mga Grupo",
    "nav.marketHelper": "Pamilihan",
    "feed.homeFeed": "FEED NG TAMBAYAN",
    "feed.postsAndFeed": "MGA POST AT FEED · PARATING PA",
    "profile.noBioAdd": "Wala pang bio. Maaari kang magdagdag kapag in-edit mo ang profile.",
    "profile.urlEyebrow": "LINK NG PROFILE",
    "profile.noPosts": "Wala pang mga post sa profile.",
    "profile.postsAndFeed": "PARATING PA · MGA POST AT FEED",
    "profile.noProfilePhoto": "Wala pang larawan sa profile",
    "profile.mediaEyebrow": "MGA LARAWAN NG PROFILE",
    "profile.profilePhoto": "Larawan sa profile",
    "profile.profilePhotoHelp": "Gumamit ng malinaw na square na larawan. JPEG, PNG, o WebP hanggang 5 MB.",
    "profile.basicInfo": "PANGUNAHING IMPORMASYON",
    "profile.displayName": "Pangalang makikita",
  },
};

export function getF2SocialTranslations(locale: Locale) {
  const base = getTranslations(locale);
  const overrides = f2SocialOverrides[locale] ?? {};
  return (key: MessageKey): string => overrides[key] ?? base(key);
}
