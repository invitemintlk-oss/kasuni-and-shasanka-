import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { INVITATION, GOOGLE_SCRIPT_URL as googleScriptUrl, readGuestNameFromUrl } from "./invitation";

const backgroundMusic = "/handawaka-various-artists.mp3";

/* Couple photos (web-optimised copies of public/images/1–6.jpeg); `pos` keeps the couple in frame when cropped */
const PRE_IMAGES = [
  { src: "/images/gallery/1.jpg", pos: "46% 50%" },
  { src: "/images/gallery/4.jpg", pos: "50% 50%" },
  { src: "/images/gallery/3.jpg", pos: "50% 60%" },
  { src: "/images/gallery/5.jpg", pos: "50% 55%" },
  { src: "/images/gallery/6.jpg", pos: "50% 55%" },
  { src: "/images/gallery/2.jpg", pos: "50% 40%" },
];

const FEATURE_PHOTO = "/images/k-story.jpg";

const EASE_SILK = [0.16, 1, 0.3, 1] as const;
const HERO_FRAME = "/images/hero-lotus-frame.jpg";

const LOTUS = {
  arch: "/images/lotus-arch-gold.png",
  stem: "/images/lotus-stem.png",
  swoosh: "/images/lotus-swoosh.png",
  trio: "/images/lotus-trio.png",
  ground: "/images/lotus-ground.png",
};

/* ------------------------------------------------------------------ */
/*  Ornaments                                                          */
/* ------------------------------------------------------------------ */

function GoldArt({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      className={`gold-art inline-block shrink-0 ${className}`}
      style={{ WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")` }}
      aria-hidden="true"
    />
  );
}

/* Small nelum (lotus) icon */
function LotusMark({ className = "" }: { className?: string }) {
  return <GoldArt src="/images/nelum-icon.png" className={className} />;
}

function OrnamentDivider({ className = "", light = false }: { className?: string; light?: boolean }) {
  const tone = light ? "text-gold-soft" : "text-gold";
  return (
    <div className={`flex items-center justify-center gap-3 md:gap-4 ${tone} ${className}`} aria-hidden="true">
      <span className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-current opacity-60" />
      <span className="w-1.5 h-1.5 rotate-45 border border-current opacity-70" />
      <LotusMark className="w-10 h-6 md:w-12 md:h-8" />
      <span className="w-1.5 h-1.5 rotate-45 border border-current opacity-70" />
      <span className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-current opacity-60" />
    </div>
  );
}

function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" fill="none" stroke="currentColor" strokeWidth="1" className={className} aria-hidden="true">
      <path d="M3 52V12C3 7 7 3 12 3H52" />
      <path d="M10 36V18C10 14 14 10 18 10H36" opacity="0.6" />
      <path d="M18 18C27 18 32 23 32 32C23 32 18 27 18 18Z" />
      <path d="M18 18L32 32" opacity="0.5" />
      <path d="M38 10C44 10 47 6 47 3" opacity="0.6" />
      <path d="M10 38C10 44 6 47 3 47" opacity="0.6" />
      <circle cx="3" cy="58" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="58" cy="3" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FramedCorners({ inset = "inset-3", size = "w-12 h-12 md:w-16 md:h-16" }: { inset?: string; size?: string }) {
  return (
    <div className={`absolute ${inset} pointer-events-none text-gold/70`} aria-hidden="true">
      <CornerFlourish className={`absolute top-0 left-0 ${size}`} />
      <CornerFlourish className={`absolute top-0 right-0 ${size} -scale-x-100`} />
      <CornerFlourish className={`absolute bottom-0 left-0 ${size} -scale-y-100`} />
      <CornerFlourish className={`absolute bottom-0 right-0 ${size} -scale-100`} />
    </div>
  );
}

/* Full-colour gold lotus artwork */
function LotusImage({ src, className = "" }: { src: string; className?: string }) {
  return <img src={src} alt="" aria-hidden="true" draggable={false} className={`select-none pointer-events-none ${className}`} />;
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`font-display italic text-lg tracking-[0.25em] ${light ? "text-gold-soft/80" : "text-gold-deep/70"}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Falling gold petals                                                */
/* ------------------------------------------------------------------ */

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#c9a24d", "#d8b56a", "#b08a3e", "#e6c98a", "#a07a32"];
    const petalCount = isMobile ? 9 : 16;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 8,
      rotation: Math.random() * 360,
      duration: Math.random() * 12 + 18,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_6px_rgba(138,100,36,0.25)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 540),
            opacity: [0, 0.85, 0.75, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C17.5 6 19 14 12 22C5 14 6.5 6 12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Countdown                                                          */
/* ------------------------------------------------------------------ */

function CountdownTimer() {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex gap-2.5 sm:gap-5 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-10 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 1, ease: EASE_SILK }}
          className="relative group"
        >
          <div className="relative w-[4.6rem] h-[7rem] sm:w-24 sm:h-36 md:w-32 md:h-48 rounded-t-full border border-gold-soft/60 bg-gradient-to-b from-white/[0.1] to-white/[0.03] flex flex-col items-center justify-center transition-transform duration-700 group-hover:-translate-y-2">
            <div className="absolute inset-1.5 md:inset-2.5 rounded-t-full border border-gold-soft/20 pointer-events-none" />
            <LotusMark className="absolute top-3 md:top-5 w-5 h-3 md:w-7 md:h-4 text-gold-soft/60" />

            <span className="font-numeric text-gold-pale drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-3xl sm:text-4xl md:text-6xl leading-none relative z-10 mt-4 md:mt-6">
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <span className="mt-2 sm:mt-3 md:mt-4 h-px w-6 md:w-10 bg-gold-soft/40" />

            <span className="mt-2 md:mt-3 text-base text-gold-pale whitespace-nowrap relative z-10">
              {stat.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */

export function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-28 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <SectionLabel>Captured Moments</SectionLabel>
          <h2 className="text-5xl md:text-8xl text-foil leading-tight font-script">Our Memories</h2>
          <OrnamentDivider />
          <p className="text-ink/70 text-xl md:text-lg max-w-2xl mx-auto leading-loose">
            A few of the most beautiful moments of our love story, shared with you.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{ x: [0, "-33.33%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-t-full p-2 border border-gold/40 bg-ivory shadow-[0_20px_50px_-15px_rgba(138,100,36,0.25)] group"
              >
                <img
                  src={img.src}
                  alt={`${INVITATION.couple.bride} & ${INVITATION.couple.groom}`}
                  style={{ objectPosition: img.pos }}
                  className="w-full h-full object-cover rounded-t-full transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const softGlow = "drop-shadow-[0_2px_14px_rgba(255,248,230,0.95)]";

export default function WeddingInvitation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const [guestName] = useState(readGuestNameFromUrl);

  const [rsvpForm, setRsvpForm] = useState({
    name: guestName ?? "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const [wishForm, setWishForm] = useState({ name: guestName ?? "", message: "" });
  const [wishStatus, setWishStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL is not configured");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        invitedAs: guestName ?? "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };

  const handleWishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wishForm.name.trim() || !wishForm.message.trim()) {
      setWishStatus("error");
      return;
    }

    setWishStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "wish",
        name: wishForm.name.trim(),
        message: wishForm.message.trim(),
        invitedAs: guestName ?? "",
      });

      setWishStatus("success");
      setWishForm({ name: "", message: "" });
    } catch {
      setWishStatus("error");
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  const rsvpChoices = [
    { value: "1", text: "Yes, I'll happily be there!", active: rsvpForm.guests !== "0" },
    { value: "0", text: "Sorry, I can't make it — but my blessings are with you.", active: rsvpForm.guests === "0" },
  ];

  return (
    <main
      className={`h-[100dvh] w-full bg-paper text-ink transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* ======================= INTRO ======================= */
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-paper flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              muted={true}
              playsInline
              preload="auto"
              className={`w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${hasStarted ? "opacity-100" : "opacity-0"}`}
              onEnded={() => setIsOpened(true)}
              onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
            >
              <source src="/intro-lotus.mp4" type="video/mp4" />
            </video>

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-[radial-gradient(ellipse_at_center,rgba(255,250,238,0.72)_0%,rgba(255,250,238,0.35)_45%,transparent_75%)] px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.4, ease: EASE_SILK }}
                  className="relative text-center flex flex-col items-center"
                >
                  <div className="absolute -inset-x-6 -inset-y-10 md:-inset-x-16 md:-inset-y-14 border border-gold/40 rounded-t-[999px] pointer-events-none" />
                  <div className="absolute -inset-x-4 -inset-y-8 md:-inset-x-14 md:-inset-y-12 border border-gold/20 rounded-t-[999px] pointer-events-none" />

                  <LotusImage src={LOTUS.trio} className="w-44 md:w-56 mb-5 drop-shadow-[0_6px_14px_rgba(138,100,36,0.25)]" />

                  <SectionLabel>The Wedding Invitation</SectionLabel>

                  <h2 className="mt-4 text-3xl md:text-5xl text-foil leading-tight uppercase tracking-[0.12em]">You're Invited</h2>

                  <OrnamentDivider className="my-5" />

                  <p className="font-script text-4xl md:text-5xl text-ink/85 leading-snug">
                    {INVITATION.couple.bride}
                    <span className="text-gold mx-3">&amp;</span>
                    {INVITATION.couple.groom}
                  </p>

                  <button
                    onClick={() => {
                      setHasStarted(true);

                      if (introVideoRef.current) {
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }

                      if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                      }
                    }}
                    className="group relative mt-10 p-[3px] rounded-full btn-gold active:scale-95"
                  >
                    <span className="relative block overflow-hidden rounded-full border border-gold-pale/60 px-10 md:px-12 py-4">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10 text-ivory text-lg tracking-[0.15em] uppercase">Open Invitation</span>
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ delay: 1.5, duration: 3, repeat: Infinity }}
                    className="mt-6 text-gold-deep text-base"
                  >
                    Tap to begin
                  </motion.div>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[24vh] md:pt-28 z-[105] pointer-events-none text-center px-6"
                >

                  <motion.h2
                    initial={{ opacity: 0, letterSpacing: "0.3em" }}
                    animate={{ opacity: 1, letterSpacing: "0em" }}
                    transition={{ duration: 2.2, delay: 0.8, ease: EASE_SILK }}
                    className={`text-2xl md:text-5xl text-foil mb-6 uppercase tracking-[0.12em] ${softGlow}`}
                  >
                    Wedding Invitation
                  </motion.h2>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.6, delay: 1.1, ease: EASE_SILK }}
                    className="h-px w-40 md:w-64 gold-hairline mb-8"
                  />

                  <div className="flex flex-col items-center w-full max-w-[300px] md:max-w-[420px] mx-auto">
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.3, ease: EASE_SILK }}
                      className={`font-script text-6xl md:text-8xl text-foil self-start ${softGlow}`}
                    >
                      {INVITATION.couple.bride}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.6, delay: 1.7, ease: EASE_SILK }}
                      className={`font-display text-4xl md:text-6xl text-gold my-1 ${softGlow}`}
                    >
                      &amp;
                    </motion.span>

                    <motion.p
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 2, ease: EASE_SILK }}
                      className={`font-script text-6xl md:text-8xl text-foil self-end ${softGlow}`}
                    >
                      {INVITATION.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 z-[110] px-8 py-3 bg-ivory/60 backdrop-blur-md text-gold-deep border border-gold/50 text-base rounded-full hover:bg-ivory/90 transition-all whitespace-nowrap"
                >
                  Enter Invitation →
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          /* ======================= WEBSITE ======================= */
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-5 right-5 z-50 bg-ivory/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-gold/40 shadow-[0_8px_24px_-12px_rgba(138,100,36,0.5)] text-gold-deep text-base hover:bg-ivory transition-colors"
            >
              Close
            </motion.button>

            {/* ---------- HERO ---------- */}
            <section className="relative w-full overflow-hidden bg-paper flex justify-center">
              {/* Golden lotus frame artwork fills the hero; the names sit inside its arch */}
              <motion.div
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: EASE_SILK }}
                className="@container relative hero-bg"
              >
                <img
                  src={HERO_FRAME}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />

                <div className="absolute left-[30%] right-[16%] top-[14%] h-[52%] flex flex-col items-center justify-center text-center">
                  {guestName && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1, ease: EASE_SILK }}
                      className="font-display italic text-[max(16px,5.2cqw)] text-gold-deep leading-snug mb-[3.5cqw] px-[3cqw] pb-[1.2cqw] border-b border-gold/50"
                    >
                      {guestName}
                    </motion.p>
                  )}

                  {/* Warm welcome, framed by small gold diamonds */}
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 1.2, ease: EASE_SILK }}
                    className="flex items-center gap-[2.2cqw] text-gold"
                  >
                    <span className="w-[1.4cqw] h-[1.4cqw] rotate-45 bg-current" aria-hidden="true" />
                    <span className="text-[max(11px,3.4cqw)] leading-snug text-gold-deep uppercase tracking-[0.2em]">Together with their families</span>
                    <span className="w-[1.4cqw] h-[1.4cqw] rotate-45 bg-current" aria-hidden="true" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 1.4, ease: EASE_SILK }}
                    className="mt-[4cqw] flex flex-col items-center"
                  >
                    <h1 className={`font-script text-[14.5cqw] text-foil leading-[1.15] px-[2cqw] ${softGlow}`}>{INVITATION.couple.bride}</h1>

                    <span className="font-script my-[0.4cqw] text-[8cqw] leading-none text-gold-deep/90">&amp;</span>

                    <h1 className={`font-script text-[14.5cqw] text-foil leading-[1.15] px-[2cqw] ${softGlow}`}>{INVITATION.couple.groom}</h1>
                  </motion.div>

                  {/* Date between fine gold rules, finished with a small nelum */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 1.2 }}
                    className="mt-[5cqw] flex flex-col items-center"
                  >
                    <p className="font-numeric text-[max(15px,4.8cqw)] tracking-[0.18em] text-gold-deep whitespace-nowrap border-y border-gold/45 px-[3cqw] py-[1.6cqw]">
                      {INVITATION.date.displayNumeric}
                    </p>
                    <LotusMark className="mt-[3.5cqw] w-[9cqw] h-[6cqw] text-gold" />
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* Welcome message just below the hero */}
            <section className="relative w-full bg-paper pt-8 pb-14 md:pt-0 md:pb-20 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1.2, ease: EASE_SILK }}
                className="relative px-6 flex flex-col items-center text-center"
              >
                <OrnamentDivider className="mb-5" />
                {guestName ? (
                  <div className="relative max-w-lg rounded-[1.75rem] border border-gold/35 bg-ivory/90 px-6 py-7 md:px-10 md:py-9 shadow-[0_24px_60px_-34px_rgba(138,100,36,0.5)]">
                    <div className="absolute inset-1.5 rounded-[1.5rem] border border-gold/15 pointer-events-none" aria-hidden="true" />
                    <p className="relative text-ink/75 text-xl md:text-lg leading-relaxed">We cordially invite</p>
                    <p className="relative font-script text-5xl md:text-6xl text-foil leading-snug my-2 px-2">{guestName}</p>
                    <p className="relative text-ink/75 text-xl md:text-lg leading-relaxed">to celebrate our special day with us.</p>
                  </div>
                ) : (
                  <p className="text-ink/75 text-xl md:text-lg leading-loose max-w-md">
                    We would be delighted to share the most beautiful and unforgettable moment of our lives with you!
                  </p>
                )}
              </motion.div>
            </section>

            {/* ---------- DETAILS ---------- */}
            <section
              id="details"
              className="relative pt-16 md:pt-28 pb-16 md:pb-32 w-full flex flex-col items-center overflow-hidden"
            >
              {/* Lotus stems framing both sides */}
              <GoldArt src={LOTUS.stem} className="absolute left-0 top-10 md:top-16 w-20 h-[11.5rem] sm:w-28 sm:h-64 md:w-44 md:h-[25rem] text-gold/45 -translate-x-1/4 md:translate-x-0" />
              <GoldArt src={LOTUS.stem} className="absolute right-0 top-10 md:top-16 w-20 h-[11.5rem] sm:w-28 sm:h-64 md:w-44 md:h-[25rem] text-gold/45 -scale-x-100 translate-x-1/4 md:translate-x-0" />
              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-5 md:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.2, ease: EASE_SILK }}
                  className="flex flex-col items-center mb-14 md:mb-20"
                >
                  {/* Featured couple portrait in a gold arch frame */}
                  <div className="relative mb-12 md:mb-14 flex flex-col items-center">
                    <SectionLabel>Our Story</SectionLabel>
                    <div className="relative mt-6 w-[15rem] h-[21rem] sm:w-[17rem] sm:h-[24rem] md:w-[19rem] md:h-[27rem] rounded-t-full p-2.5 border border-gold/45 bg-ivory shadow-[0_30px_70px_-30px_rgba(138,100,36,0.55)]">
                      <div className="absolute -inset-2.5 rounded-t-full border border-gold/20 pointer-events-none" aria-hidden="true" />
                      <img
                        src={FEATURE_PHOTO}
                        alt={`${INVITATION.couple.bride} & ${INVITATION.couple.groom}`}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="w-full h-full object-cover object-[52%_60%] rounded-t-full"
                      />
                    </div>
                    <LotusMark className="mt-5 w-12 h-8 text-gold" />
                  </div>

                  <OrnamentDivider className="mb-10" />

                  <div className="space-y-5 md:space-y-6 max-w-3xl mx-auto leading-relaxed text-xl md:text-lg">
                    <p className="text-ink/75 uppercase tracking-[0.18em] text-base md:text-sm">Together with their families and friends</p>

                    <h3 className="font-script text-6xl md:text-7xl text-foil leading-snug">{INVITATION.couple.bride}</h3>
                    <p className="text-ink/75 uppercase tracking-[0.08em] text-base md:text-base max-w-md mx-auto">{INVITATION.parents.bride}</p>

                    <div className="flex items-center justify-center gap-3 py-1 text-gold/70" aria-hidden="true">
                      <span className="h-px w-10 bg-current" />
                      <span className="w-1.5 h-1.5 rotate-45 bg-current" />
                      <span className="h-px w-10 bg-current" />
                    </div>

                    <h3 className="font-script text-6xl md:text-7xl text-foil leading-snug">{INVITATION.couple.groom}</h3>
                    <p className="text-ink/75 uppercase tracking-[0.08em] text-base md:text-base max-w-md mx-auto">{INVITATION.parents.groom}</p>

                    <p className="text-ink/75 max-w-2xl mx-auto pt-4 leading-loose">
                      request the pleasure of your company to celebrate the wedding of their children, and to bless this beautiful moment as they join hands for a lifetime.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EASE_SILK }}
                  className="mb-10 flex flex-col items-center gap-3"
                >
                  <LotusImage src={LOTUS.swoosh} className="w-44 md:w-56" />
                  <h2 className="font-script text-4xl md:text-5xl text-foil">Join Us</h2>
                </motion.div>

                {/* Details card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_SILK }}
                  className="relative z-20 w-full max-w-[960px] paper-card rounded-[2rem] border border-gold/40 shadow-[0_40px_80px_-40px_rgba(138,100,36,0.45)] px-6 py-12 md:px-14 md:py-16"
                >
                  <div className="absolute inset-2.5 md:inset-3.5 rounded-[1.6rem] border border-gold/20 pointer-events-none" />
                  <FramedCorners inset="inset-4 md:inset-6" size="w-10 h-10 md:w-14 md:h-14" />

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
                    {[
                      {
                        icon: Calendar,
                        label: "Date",
                        value: INVITATION.date.displayLong,
                      },
                      {
                        icon: Clock,
                        label: "Time",
                        value: `From ${INVITATION.time.start} to ${INVITATION.time.end}`,
                      },
                      {
                        icon: MapPin,
                        label: "Venue",
                        value: `${INVITATION.venue.name}, ${INVITATION.venue.city} (${INVITATION.venue.hall})`,
                        link: INVITATION.venue.googleMapsLink,
                      },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.15, duration: 1, ease: EASE_SILK }}
                          className={`flex flex-col items-center text-center px-2 md:px-8 ${i > 0 ? "md:border-l md:border-gold/25" : ""}`}
                        >
                          <span className="relative w-14 h-14 rounded-full border border-gold/50 flex items-center justify-center bg-ivory">
                            <span className="absolute -inset-1.5 rounded-full border border-gold/15" />
                            <Icon className="w-5 h-5 text-gold-deep" strokeWidth={1.4} />
                          </span>
                          <span className="mt-5 text-lg md:text-base text-gold-deep/70">{item.label}</span>
                          <span className="mt-2 h-px w-8 bg-gold/40" />
                          <span className="mt-3 text-lg md:text-xl text-ink leading-relaxed">{item.value}</span>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-2 font-display italic text-lg text-gold-deep border-b border-gold/40 hover:border-gold-deep hover:text-ink transition-colors pb-0.5"
                            >
                              View on Google Maps
                              <span aria-hidden="true">→</span>
                            </a>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ---------- EVENT TIMELINE ---------- */}
            <section className="relative w-full py-12 md:py-20 flex flex-col items-center overflow-hidden">
              <div className="w-full max-w-[640px] px-5 md:px-6 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_SILK }}
                  className="flex flex-col items-center mb-10 md:mb-14"
                >
                  <SectionLabel>Order of the Day</SectionLabel>
                  <h2 className="mt-4 font-script text-5xl md:text-6xl text-foil leading-tight">Event Timeline</h2>
                  <OrnamentDivider className="mt-6" />
                </motion.div>

                <div className="relative w-full">
                  <span className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent" aria-hidden="true" />
                  <div className="flex flex-col gap-10 md:gap-12">
                    {INVITATION.timeline.map((event, i) => (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, duration: 1, ease: EASE_SILK }}
                        className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8"
                      >
                        <span className="text-right font-numeric text-2xl md:text-3xl text-gold-deep">{event.time}</span>
                        <span className="relative z-10 w-4 h-4 rotate-45 border border-gold bg-ivory shadow-[0_0_0_5px_var(--color-paper)]" aria-hidden="true" />
                        <span className="text-left text-xl md:text-2xl text-ink">{event.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- VENUE + MAP ---------- */}
            <section className="relative w-full py-16 md:py-28 flex flex-col items-center overflow-hidden">
              <div className="w-full max-w-[880px] px-5 md:px-6 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_SILK }}
                  className="flex flex-col items-center mb-10 md:mb-12"
                >
                  <SectionLabel>Venue</SectionLabel>
                  <h2 className="mt-4 font-script text-5xl md:text-6xl text-foil leading-tight">Where to Find Us</h2>
                  <OrnamentDivider className="mt-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_SILK }}
                  className="relative w-full paper-card rounded-[2rem] border border-gold/40 shadow-[0_40px_80px_-40px_rgba(138,100,36,0.45)] p-3 md:p-4"
                >
                  <div className="absolute inset-1.5 md:inset-2 rounded-[1.75rem] border border-gold/20 pointer-events-none" />

                  {/* Embedded Google Map */}
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-gold/30 aspect-[4/3] md:aspect-[16/8] bg-gold-pale/40">
                    <iframe
                      title={`${INVITATION.venue.name} map`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(INVITATION.venue.mapQuery)}&z=15&output=embed`}
                      className="absolute inset-0 w-full h-full border-0 [filter:sepia(0.25)_saturate(0.9)]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>

                  <div className="relative px-4 pt-8 pb-6 md:pt-10 md:pb-8 flex flex-col items-center">
                    <span className="relative -mt-14 md:-mt-16 mb-4 w-14 h-14 rounded-full border border-gold/50 bg-ivory flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(138,100,36,0.6)]">
                      <MapPin className="w-5 h-5 text-gold-deep" strokeWidth={1.4} />
                    </span>
                    <h3 className="text-2xl md:text-3xl text-ink leading-snug uppercase tracking-[0.08em]">{INVITATION.venue.name}</h3>
                    <p className="mt-2 text-lg text-ink/70 uppercase tracking-[0.08em]">{INVITATION.venue.city}</p>
                    <p className="text-lg text-ink/70">({INVITATION.venue.hall})</p>

                    <a
                      href={INVITATION.venue.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden btn-gold text-ivory px-8 py-3.5 rounded-full text-lg"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <MapPin className="relative w-4 h-4" strokeWidth={1.6} />
                      <span className="relative">Get Directions</span>
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ---------- PHOTO GALLERY ---------- */}
            <Gallery />

            {/* ---------- SAVE THE DATE ---------- */}
            <section className="relative py-20 md:py-40 bg-cocoa flex flex-col items-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,77,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(201,162,77,0.12),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-3 md:inset-6 border border-gold-soft/15 pointer-events-none" />
              <div className="absolute inset-4 md:inset-8 border border-gold-soft/10 pointer-events-none" />

              <div className="w-full max-w-[1200px] px-5 md:px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_SILK }}
                  className="relative mb-4 flex flex-col items-center"
                >
                  <LotusImage src={LOTUS.trio} className="w-40 md:w-52 mb-6 drop-shadow-[0_4px_18px_rgba(201,162,77,0.35)]" />
                  <SectionLabel light>Save the Date</SectionLabel>

                  <h2 className="mt-5 font-script text-5xl md:text-7xl text-foil-light leading-tight">
                    Counting down the days
                  </h2>

                  <OrnamentDivider light className="my-7" />

                  <span className="font-numeric text-3xl md:text-5xl tracking-[0.2em] text-gold-pale">
                    {INVITATION.date.displayNumeric}
                  </span>
                </motion.div>

                <CountdownTimer />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="mt-14 md:mt-20 flex flex-col items-center gap-5"
                >
                  <p className="text-lg md:text-xl text-gold-pale text-center max-w-xl leading-relaxed">
                    Join us as we begin our new journey together, filled with love.
                  </p>

                  <div className="flex gap-2.5">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1.5 h-1.5 bg-gold-soft rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ---------- RSVP ---------- */}
            <section className="relative py-20 md:py-40 bg-transparent flex flex-col items-center overflow-hidden">
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EASE_SILK }}
                  className="flex flex-col items-center mb-10 md:mb-14 text-center"
                >
                  <SectionLabel>Kindly Reply</SectionLabel>
                  <h2 className="mt-4 font-script text-5xl md:text-6xl text-foil">RSVP</h2>
                  <OrnamentDivider className="mt-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: EASE_SILK }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[620px] paper-card rounded-t-[999px] rounded-b-[2rem] border border-gold/40 shadow-[0_40px_100px_-40px_rgba(138,100,36,0.45)] px-6 pt-24 pb-10 md:px-14 md:pt-32 md:pb-14"
                >
                  <div className="absolute inset-2.5 md:inset-3.5 rounded-t-[999px] rounded-b-[1.6rem] border border-gold/20 pointer-events-none" />
                  <LotusMark className="absolute top-10 md:top-12 left-1/2 -translate-x-1/2 w-14 h-10 md:w-16 md:h-12 text-gold" />

                  <div className="relative w-full flex flex-col items-center">
                    <h3 className="text-2xl md:text-4xl text-ink mb-10 text-center">Will you join us?</h3>

                    <form className="w-full space-y-8 text-left" onSubmit={handleRsvpSubmit}>
                      <div className="space-y-2">
                        <label className="text-lg md:text-base text-gold-deep/80">Your Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name here..."
                          value={rsvpForm.name}
                          onChange={(e) => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                          }}
                          className="w-full bg-transparent border-0 border-b border-gold/40 px-1 py-3 text-lg text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold-deep transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-lg md:text-base text-gold-deep/80">Will you be attending our special day?</label>

                        {rsvpChoices.map((choice) => (
                          <button
                            key={choice.value}
                            type="button"
                            onClick={() => {
                              setRsvpStatus("idle");
                              setRsvpForm((prev) => ({ ...prev, guests: choice.value }));
                            }}
                            aria-pressed={choice.active}
                            className={`w-full flex items-center gap-4 text-left rounded-2xl border px-5 py-4 md:py-5 text-lg leading-relaxed transition-all duration-300 active:scale-[0.99] ${choice.active
                              ? "border-gold bg-gold/10 text-ink shadow-[0_10px_30px_-18px_rgba(138,100,36,0.7)]"
                              : "border-gold/25 bg-ivory/60 text-ink/70 hover:border-gold/50"
                              }`}
                          >
                            <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${choice.active ? "border-gold-deep" : "border-gold/40"}`}>
                              <span className={`w-2.5 h-2.5 rounded-full bg-gold-deep transition-transform duration-300 ${choice.active ? "scale-100" : "scale-0"}`} />
                            </span>
                            {choice.text}
                          </button>
                        ))}
                      </div>

                      {(rsvpStatus === "success" || rsvpStatus === "error") && (
                        <p className={`text-base text-center ${rsvpStatus === "success" ? "text-gold-deep" : "text-red-700"}`}>
                          {rsvpStatus === "success"
                            ? "Thank you! Your response has been sent."
                            : "Please enter your name and try again."}
                        </p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "sending"}
                          className="group relative w-full overflow-hidden btn-gold text-ivory py-4 md:py-5 rounded-full text-lg tracking-wide disabled:opacity-70"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <span className="relative">{rsvpStatus === "sending" ? "Sending..." : "Confirm"}</span>
                        </button>

                        <p className="text-lg md:text-base text-ink/55 mt-4 text-center leading-relaxed">
                          Your response will be kept private.
                        </p>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ---------- WISHES ---------- */}
            <section className="relative pb-20 md:pb-32 bg-transparent flex flex-col items-center overflow-hidden">
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EASE_SILK }}
                  className="flex flex-col items-center mb-10 md:mb-14 text-center"
                >
                  <SectionLabel>Leave a Blessing</SectionLabel>
                  <h2 className="mt-4 font-script text-5xl md:text-6xl text-foil">Wishes</h2>
                  <OrnamentDivider className="mt-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: EASE_SILK }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[620px] paper-card rounded-[2rem] border border-gold/40 shadow-[0_40px_100px_-40px_rgba(138,100,36,0.45)] px-6 py-10 md:px-14 md:py-14"
                >
                  <div className="absolute inset-2.5 md:inset-3.5 rounded-[1.6rem] border border-gold/20 pointer-events-none" />

                  <form className="relative w-full space-y-8 text-left" onSubmit={handleWishSubmit}>
                    <p className="text-center text-lg text-ink/70 leading-relaxed">
                      Share a few words of love and blessings for {INVITATION.couple.bride} &amp; {INVITATION.couple.groom}.
                    </p>

                    <div className="space-y-2">
                      <label className="text-lg md:text-base text-gold-deep/80">Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name here..."
                        value={wishForm.name}
                        onChange={(e) => {
                          setWishStatus("idle");
                          setWishForm((prev) => ({ ...prev, name: e.target.value }));
                        }}
                        className="w-full bg-transparent border-0 border-b border-gold/40 px-1 py-3 text-lg text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold-deep transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-lg md:text-base text-gold-deep/80">Your Wish</label>
                      <textarea
                        rows={4}
                        placeholder="Write your wishes for the couple..."
                        value={wishForm.message}
                        onChange={(e) => {
                          setWishStatus("idle");
                          setWishForm((prev) => ({ ...prev, message: e.target.value }));
                        }}
                        className="w-full resize-none rounded-2xl bg-ivory/70 border border-gold/30 px-4 py-3 text-lg text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold-deep transition-colors"
                        required
                      />
                    </div>

                    {(wishStatus === "success" || wishStatus === "error") && (
                      <p className={`text-base text-center ${wishStatus === "success" ? "text-gold-deep" : "text-red-700"}`}>
                        {wishStatus === "success"
                          ? "Thank you for your lovely wishes!"
                          : "Please enter your name and a message, then try again."}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={wishStatus === "sending"}
                      className="group relative w-full overflow-hidden btn-gold text-ivory py-4 md:py-5 rounded-full text-lg tracking-wide disabled:opacity-70"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative">{wishStatus === "sending" ? "Sending..." : "Send Wishes"}</span>
                    </button>
                  </form>
                </motion.div>
              </div>
            </section>

            {/* ---------- THANK YOU ---------- */}
            <section className="w-full relative overflow-hidden bg-transparent pt-10 pb-40 md:pt-16 md:pb-56">
              {/* Lotus garden along the bottom corners */}
              <LotusImage src={LOTUS.ground} className="absolute bottom-0 left-0 w-52 sm:w-64 md:w-[24rem] opacity-90" />
              <LotusImage src={LOTUS.ground} className="absolute bottom-0 right-0 w-52 sm:w-64 md:w-[24rem] opacity-90 -scale-x-100" />
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_SILK }}
                  className="flex flex-col items-center"
                >
                  <LotusImage src={LOTUS.swoosh} className="w-44 md:w-56 -scale-x-100" />

                  <h2 className="mt-8 font-script text-6xl md:text-8xl text-foil leading-tight">Thank You</h2>

                  <OrnamentDivider className="my-6" />

                  <p className="text-ink/70 text-xl md:text-lg leading-loose max-w-2xl mx-auto">
                    As we begin this new chapter of our lives, your presence will make our special day an even more cherished memory.
                  </p>

                  <div className="mt-12 flex flex-col items-center gap-5 w-full max-w-xl mx-auto">
                    <p className="text-gold-deep/80 text-lg md:text-base uppercase tracking-[0.2em]">Contact</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
                      {INVITATION.rsvpContacts.map((line) => (
                        <a
                          key={line}
                          href={`tel:${line.split("-").slice(1).join("-").replace(/\s/g, "")}`}
                          className="font-display text-lg text-ink/80 px-6 py-2.5 rounded-full border border-gold/35 bg-ivory/50 hover:bg-ivory hover:border-gold transition-colors"
                        >
                          {line}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-16 h-px w-40 gold-hairline" />
                  <p className="mt-6 text-lg text-gold-deep/70">
                    © 2027 {INVITATION.couple.bride} &amp; {INVITATION.couple.groom}
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ---------- FOOTER ---------- */}
            <footer className="relative w-full bg-cocoa px-6 pt-8 pb-24 md:pb-10 text-center">
              <div className="absolute inset-x-0 top-0 h-px gold-hairline opacity-70" aria-hidden="true" />
              <LotusMark className="w-8 h-5 text-[#D4AF37]/80" />
              <p className="mt-2 font-display text-lg text-ivory/85 tracking-wide">
                {INVITATION.couple.bride} &amp; {INVITATION.couple.groom} · {INVITATION.date.displayNumeric}
              </p>
              <p className="text-[#D4AF37] text-xs mt-2 font-sans tracking-wider">
                Want a beautiful wedding website like this? Create yours with{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-[#D4AF37] underline underline-offset-2 decoration-[#D4AF37]/60 transition-colors"
                  href="https://wa.me/94707819074"
                >
                  invitemint
                </a>
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      {/* Music toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-full bg-ivory/90 backdrop-blur-md border border-gold/50 text-gold-deep shadow-[0_10px_30px_-12px_rgba(138,100,36,0.6)] flex items-center justify-center hover:bg-ivory transition-colors"
      >
        <span
          className={`absolute -inset-1.5 rounded-full border border-dashed border-gold/50 ${isPlaying ? "animate-[spin-slow_12s_linear_infinite]" : "opacity-0"}`}
        />
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </motion.button>
    </main>
  );
}
