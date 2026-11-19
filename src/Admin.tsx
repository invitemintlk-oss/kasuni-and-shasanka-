import React, { useEffect, useRef, useState } from "react";
import {
  INVITATION,
  GUEST_PREFIXES,
  type GuestPrefix,
  buildDisplayName,
  buildInviteLink,
  buildInviteMessage,
} from "./invitation";

interface Generated {
  displayName: string;
  link: string;
  message: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers / contexts without the async clipboard API
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Admin() {
  const [prefix, setPrefix] = useState<GuestPrefix>("Mr.");
  const [guestName, setGuestName] = useState("");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) return;

    const link = buildInviteLink(window.location.origin, displayName);
    setGenerated({ displayName, link, message: buildInviteMessage(displayName, link) });
  };

  const handleCopy = async (text: string, success: string) => {
    const ok = await copyText(text);
    showToast(ok ? success : "Copy failed — please copy manually");
  };

  const livePreview = buildDisplayName(prefix, guestName);
  const isStale = generated !== null && generated.displayName !== livePreview;

  return (
    <div className="h-dvh overflow-y-auto bg-[#faf4e6] text-[#4a3418] py-10 md:py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6424]/70">Invitation Link Generator</p>
          <h1 className="mt-2 font-script text-5xl text-[#8a6424]">
            {INVITATION.couple.bride} &amp; {INVITATION.couple.groom}
          </h1>
        </header>

        <div className="bg-[#fffcf3] rounded-3xl border border-[#b08a3e]/30 shadow-[0_30px_70px_-40px_rgba(138,100,36,0.55)] p-6 md:p-8">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label htmlFor="prefix" className="text-sm font-semibold text-[#8a6424]">Select Prefix</label>
                <select
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value as GuestPrefix)}
                  className="w-full bg-white border border-[#b08a3e]/35 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#b08a3e]/25 focus:border-[#b08a3e]"
                >
                  {GUEST_PREFIXES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="guest" className="text-sm font-semibold text-[#8a6424]">Guest Name</label>
                <input
                  id="guest"
                  type="text"
                  placeholder="e.g. Sanjaya"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-white border border-[#b08a3e]/35 rounded-xl px-4 py-3 text-lg placeholder:text-[#4a3418]/35 focus:outline-none focus:ring-2 focus:ring-[#b08a3e]/25 focus:border-[#b08a3e]"
                  required
                />
              </div>
            </div>

            <p className="text-sm text-[#4a3418]/65">
              Greeting preview:{" "}
              <span className="font-semibold text-[#4a3418]">{livePreview ? `Dear ${livePreview} ❤️` : "—"}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="submit"
                className="btn-gold text-[#fffcf3] font-semibold py-3.5 rounded-xl active:scale-[0.99]"
              >
                Generate Link
              </button>
              <button
                type="button"
                disabled={!generated}
                onClick={() => generated && handleCopy(generated.link, "Link copied!")}
                className="py-3.5 rounded-xl border border-[#b08a3e]/50 bg-white text-[#8a6424] font-semibold hover:bg-[#fdf6e6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Copy Link Only
              </button>
              <button
                type="button"
                disabled={!generated}
                onClick={() => generated && handleCopy(generated.message, "Message copied!")}
                className="py-3.5 rounded-xl border border-[#b08a3e]/50 bg-white text-[#8a6424] font-semibold hover:bg-[#fdf6e6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Copy Full Message
              </button>
            </div>
          </form>

          {generated && (
            <div className="mt-8 space-y-5">
              {isStale && (
                <p className="text-sm text-[#a0522d] bg-[#fff3e3] border border-[#e6c98a] rounded-xl px-4 py-2.5">
                  The name or prefix has changed — click <b>Generate Link</b> again to update.
                </p>
              )}

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#8a6424]">Generated Link</p>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all rounded-xl border border-[#b08a3e]/30 bg-white px-4 py-3 text-[#8a6424] underline decoration-[#b08a3e]/40 underline-offset-4 hover:decoration-[#8a6424]"
                >
                  {generated.link}
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#8a6424]">Message Preview</p>
                <pre className="whitespace-pre-wrap break-words rounded-xl border border-[#b08a3e]/30 bg-white px-4 py-4 text-base leading-relaxed font-[inherit]">
                  {generated.message}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2e2115] text-[#f4e6c4] px-5 py-2.5 text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
