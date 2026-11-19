/* Shared wedding details — used by the invitation (App.tsx) and the link generator (Admin.tsx). */

export const INVITATION = {
  couple: {
    bride: "Kasuni",
    groom: "Shasanka",
  },
  parents: {
    bride: "Daughter of Mr Piyasena Gamage (Late) & Mrs Sandya Mudalige",
    groom: "Son of Mr Chandrasiri Rajapaksha & Mrs Champa Kaluthanthri",
  },
  date: {
    displayNumeric: "15 . 01 . 2027",
    displayLong: "Friday, 15th January 2027",
    countdownTarget: "2027-01-15T10:00:00+05:30",
  },
  time: {
    start: "10.00 a.m.",
    end: "4.00 p.m.",
  },
  timeline: [
    { time: "10.00 a.m.", title: "Guest Arrivals" },
    { time: "10.15 a.m.", title: "Poruwa Ceremony" },
    { time: "4.00 p.m.", title: "Going Away" },
  ],
  venue: {
    name: "Seethawaka Regency",
    city: "Avissawella",
    hall: "Diamond Ballroom",
    mapQuery: "Seethawaka Regency, Avissawella",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Seethawaka%20Regency%2C%20Avissawella",
  },
  rsvpContacts: [
    "Sandya - 0713252687",
    "Shasanka - 0767989403",
  ],
} as const;

/*
 * Google Apps Script Web App URL (from code.gs → Deploy → Web app).
 * Paste the "/exec" URL of YOUR deployment here.
 */
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzrhHUcvRgL1TKcfaH6yjbRZDSQaRtnDBTN4lwZjXPCDfaoaYQAJj1Wjlx0ILZXFQi9/exec";

/* ------------------------------------------------------------------ */
/*  Guest personalisation                                              */
/* ------------------------------------------------------------------ */

export const GUEST_PREFIXES = ["Mr.", "Mrs.", "Miss", "Mr. & Mrs.", "Family", "Dear"] as const;
export type GuestPrefix = (typeof GUEST_PREFIXES)[number];

/** Combine prefix + name. "Dear" is a greeting style only, so it never appears in the name itself. */
export function buildDisplayName(prefix: GuestPrefix, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, " ");
  if (!name) return "";

  switch (prefix) {
    case "Family":
      return `${name} and Family`;
    case "Dear":
      return name;
    default:
      return `${prefix} ${name}`;
  }
}

/** `{baseURL}/{displayName}` with the name safely URL-encoded. */
export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${INVITATION.couple.groom} & ${INVITATION.couple.bride}`;
}

/** Read the guest's display name from the URL path (/Mr.%20Sanjaya), falling back to the older ?to= format. */
export function readGuestNameFromUrl(): string | null {
  const segment = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (segment && segment.toLowerCase() !== "admin" && !segment.includes("/")) {
    try {
      const decoded = decodeURIComponent(segment).trim();
      if (decoded) return decoded;
    } catch {
      /* malformed URL — ignore */
    }
  }

  const fromQuery = new URLSearchParams(window.location.search).get("to");
  return fromQuery && fromQuery.trim() ? fromQuery.trim() : null;
}
