export type SocialIconName =
  | "home"
  | "friends"
  | "groups"
  | "market"
  | "bell"
  | "search"
  | "user"
  | "photo"
  | "sparkles"
  | "chevron-down"
  | "edit"
  | "sun"
  | "moon";

export function SocialIcon({
  name,
  size = 20,
  className,
}: {
  name: SocialIconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (name) {
    case "home":
      return <svg {...common}><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.8V21h13V9.8"/><path d="M9.5 21v-6h5v6"/></svg>;
    case "friends":
      return <svg {...common}><path d="M16 20v-1.8a4.2 4.2 0 0 0-4.2-4.2H6.2A4.2 4.2 0 0 0 2 18.2V20"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-1.7a4.2 4.2 0 0 0-3.2-4.1M16 3.2a4 4 0 0 1 0 7.7"/></svg>;
    case "groups":
      return <svg {...common}><circle cx="12" cy="8" r="3.2"/><path d="M6.5 20v-1.5A4.5 4.5 0 0 1 11 14h2a4.5 4.5 0 0 1 4.5 4.5V20"/><circle cx="4.5" cy="9.5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M1.5 18v-.6A3.4 3.4 0 0 1 5 14M22.5 18v-.6A3.4 3.4 0 0 0 19 14"/></svg>;
    case "market":
      return <svg {...common}><path d="M3 9h18l-1.5-5h-15L3 9Z"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>;
    case "bell":
      return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
    case "photo":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L7 20"/></svg>;
    case "sparkles":
      return <svg {...common}><path d="m12 3 1.2 3.2L16.5 7.5l-3.3 1.3L12 12l-1.2-3.2-3.3-1.3 3.3-1.3L12 3Z"/><path d="m18.5 13 .8 2.1 2.2.9-2.2.9-.8 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z"/><path d="m5 13 .7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7L5 13Z"/></svg>;
    case "chevron-down":
      return <svg {...common}><path d="m7 9.5 5 5 5-5"/></svg>;
    case "edit":
      return <svg {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/></svg>;
    case "sun":
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>;
    case "moon":
      return <svg {...common}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"/></svg>;
  }
}
