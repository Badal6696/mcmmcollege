import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HERO_IMAGES,
  LOGO_URL,
  PROGRAMS,
  store,
  type GalleryPhoto,
  type Notice,
} from "@/lib/college-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maa Chandrika Mahila Mahavidyalaya — Mahoba" },
      {
        name: "description",
        content:
          "A private women's college in Mahoba (U.P.) offering B.A., B.Sc., M.A. and D.El.Ed. (BTC) programs.",
      },
      { property: "og:title", content: "Maa Chandrika Mahila Mahavidyalaya" },
      {
        property: "og:description",
        content:
          "Empowering young women through quality education in Mahoba, Uttar Pradesh.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Hero />
      <NoticeTicker />
      <About />
      <Programs />
      <Admissions />
      <DirectorMessage />
      <NoticesSection />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % HERO_IMAGES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <header className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === idx ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

      {/* Logo top-left */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-3 sm:left-6 sm:top-6">
        <img
          src={LOGO_URL}
          alt="MCMM Logo"
          className="h-14 w-14 rounded-full bg-white/90 p-1 shadow-lg ring-2 ring-white/60 sm:h-20 sm:w-20"
        />
        <div className="hidden text-white sm:block">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">
            Mahoba · Est. 2008
          </p>
          <p className="font-serif text-lg leading-tight">MCMM College</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="absolute right-4 top-4 z-20 flex items-center gap-1 text-sm font-medium text-white sm:right-8 sm:top-7 sm:gap-4">
        {[
          ["About", "about"],
          ["Programs", "programs"],
          ["Notices", "notices"],
          ["Gallery", "gallery"],
          ["Contact", "contact"],
        ].map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-3 py-1.5 transition hover:bg-white/15"
          >
            {label}
          </a>
        ))}
        <Link
          to="/admin"
          className="ml-1 rounded-full border border-white/40 px-3 py-1.5 transition hover:bg-white hover:text-stone-900"
        >
          Admin
        </Link>
      </nav>

      {/* Center content */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center text-white">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] backdrop-blur">
          ⭐ NAAC Aspirant · Affiliated to BU Jhansi
        </p>
        <h1 className="font-serif text-4xl leading-tight drop-shadow-lg sm:text-6xl md:text-7xl">
          Maa Chandrika Mahila
          <br />
          Mahavidyalaya
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
          A private women's college in Mahoba, Uttar Pradesh — where tradition
          meets ambition, and every young woman finds her voice.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#programs"
            className="rounded-full bg-rose-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-rose-900/30 transition hover:bg-rose-500"
          >
            Explore Programs
          </a>
          <a
            href="#admissions"
            className="rounded-full border border-white/60 bg-white/10 px-7 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white hover:text-stone-900"
          >
            Apply for Admission
          </a>
        </div>
        <div className="mt-10 flex items-center gap-2 text-sm text-white/90">
          <span className="text-amber-400">★★★★★</span>
          <span>4.8 / 5 — trusted by 2,000+ alumnae</span>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </header>
  );
}

/* ---------------- NOTICE TICKER ---------------- */
function NoticeTicker() {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => setNotices(store.getNotices()), []);
  if (notices.length === 0) return null;
  return (
    <div className="flex items-center gap-3 border-y border-rose-200 bg-rose-50 px-4 py-2 text-sm">
      <span className="shrink-0 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
        Latest
      </span>
      <div className="flex-1 overflow-hidden">
        <div className="ticker-track flex gap-12 whitespace-nowrap">
          {[...notices, ...notices].map((n, i) => (
            <span key={i} className="text-stone-700">
              📢 <span className="font-medium">{n.title}</span>
              <span className="ml-2 text-stone-500">
                ({new Date(n.date).toLocaleDateString()})
              </span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .ticker-track { animation: ticker 28s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */
function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead eyebrow="About Us" title="A place for women to grow, lead and inspire" />
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <p className="text-lg leading-relaxed text-stone-700">
          Maa Chandrika Mahila Mahavidyalaya is a private women's college in
          the historic town of Mahoba. Founded with a vision to bring quality
          higher education within reach of young women across the Bundelkhand
          region, we combine academic rigour with a nurturing campus culture.
          Our graduates leave equipped not just with degrees, but with
          confidence, clarity and the courage to lead.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["2,000+", "Alumnae"],
            ["18", "Years of legacy"],
            ["40+", "Faculty members"],
            ["100%", "Women-focused campus"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm"
            >
              <p className="font-serif text-3xl text-rose-700">{n}</p>
              <p className="mt-1 text-sm text-stone-600">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROGRAMS ---------------- */
function Programs() {
  return (
    <section id="programs" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Programs"
          title="Degrees designed for ambitious women"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {PROGRAMS.map((p) => (
            <div
              key={p.code}
              className="group rounded-3xl border border-stone-200 p-7 transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-2xl text-stone-900">{p.name}</h3>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {p.code}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-500">⏱ {p.duration}</p>
              <p className="mt-3 text-stone-700">{p.desc}</p>
              <p className="mt-4 text-sm">
                <span className="font-semibold text-stone-800">Subjects: </span>
                <span className="text-stone-600">{p.subjects}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ADMISSIONS ---------------- */
function Admissions() {
  const [a, setA] = useState(store.getAdmission());
  useEffect(() => setA(store.getAdmission()), []);
  const color =
    a.status === "Open"
      ? "bg-emerald-100 text-emerald-800"
      : a.status === "Closing Soon"
        ? "bg-amber-100 text-amber-800"
        : "bg-stone-200 text-stone-700";
  return (
    <section
      id="admissions"
      className="mx-auto my-20 max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 px-6 py-16 text-white shadow-2xl sm:px-12"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-white/80">
        Admissions 2026–27
      </p>
      <h2 className="mt-2 font-serif text-4xl sm:text-5xl">
        Begin your journey with us
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-white/90">{a.note}</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${color}`}
        >
          ● {a.status}
        </span>
        <div className="text-sm text-white/90">
          <p>
            <strong>Opens:</strong> {new Date(a.openDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Closes:</strong>{" "}
            {new Date(a.closeDate).toLocaleDateString()}
          </p>
        </div>
        <a
          href="#contact"
          className="ml-auto rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-lg transition hover:bg-stone-100"
        >
          Contact Admissions →
        </a>
      </div>
    </section>
  );
}

/* ---------------- DIRECTOR ---------------- */
function DirectorMessage() {
  const [d, setD] = useState(store.getDirector());
  useEffect(() => setD(store.getDirector()), []);
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <SectionHead eyebrow="Director's Message" title="A word from our leadership" />
      <figure className="relative rounded-3xl bg-stone-900 p-10 text-stone-100 shadow-xl sm:p-14">
        <span className="absolute -top-6 left-8 font-serif text-8xl leading-none text-rose-500">
          “
        </span>
        <blockquote className="font-serif text-xl leading-relaxed sm:text-2xl">
          {d.message}
        </blockquote>
        <figcaption className="mt-8 flex items-center gap-4">
          {d.photo && (
            <img
              src={d.photo}
              alt={d.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-rose-500"
            />
          )}
          <div>
            <p className="font-semibold text-white">{d.name}</p>
            <p className="text-sm text-stone-400">{d.title}</p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

/* ---------------- NOTICES SECTION ---------------- */
function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState("All");
  useEffect(() => setNotices(store.getNotices()), []);
  const cats = useMemo(
    () => ["All", ...Array.from(new Set(notices.map((n) => n.category)))],
    [notices],
  );
  const shown = filter === "All" ? notices : notices.filter((n) => n.category === filter);
  return (
    <section id="notices" className="bg-stone-100 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="Notices" title="Announcements & updates" />
        <div className="mb-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === c
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-stone-500">
            No notices in this category yet.
          </p>
        ) : (
          <ul className="grid gap-3">
            {shown.map((n) => (
              <li
                key={n.id}
                className="flex flex-wrap items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <span className="text-lg font-bold leading-none">
                    {new Date(n.date).getDate()}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide">
                    {new Date(n.date).toLocaleString("en", { month: "short" })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                      {n.category}
                    </span>
                    <h3 className="text-base font-semibold text-stone-900">
                      {n.title}
                    </h3>
                  </div>
                  {n.body && (
                    <p className="mt-1 text-sm text-stone-600">{n.body}</p>
                  )}
                </div>
                {n.pdf && (
                  <a
                    href={n.pdf}
                    download={n.pdfName || "notice.pdf"}
                    className="self-center rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-900 hover:text-white"
                  >
                    📄 PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setPhotos(store.getGallery()), []);
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead eyebrow="Gallery" title="Moments from campus life" />
      {photos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
          No photos uploaded yet. The admin can upload campus photos from the
          admin portal.
        </p>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpen(p.src)}
              className="mb-4 block w-full overflow-hidden rounded-2xl"
            >
              <img
                src={p.src}
                alt={p.caption || ""}
                className="w-full transition hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
        >
          <img
            src={open}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </section>
  );
}

/* ---------------- CONTACT + FOOTER ---------------- */
function Contact() {
  return (
    <section id="contact" className="bg-stone-900 py-20 text-stone-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
        <div>
          <SectionHead
            eyebrow="Contact"
            title="Visit, call or write to us"
            light
          />
          <div className="space-y-3 text-stone-300">
            <p>📍 Civil Lines, Mahoba, Uttar Pradesh — 210427</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ admissions@mcmm.edu.in</p>
            <p>🕘 Mon–Sat · 9:00 AM – 4:00 PM</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! We'll get back to you shortly.");
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-3 rounded-3xl bg-stone-800/60 p-6"
        >
          <input
            required
            placeholder="Your name"
            className="w-full rounded-xl bg-stone-900 px-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-xl bg-stone-900 px-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <textarea
            required
            placeholder="Message"
            rows={4}
            className="w-full rounded-xl bg-stone-900 px-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button className="w-full rounded-full bg-rose-600 py-3 font-semibold text-white hover:bg-rose-500">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-950 py-8 text-center text-sm text-stone-400">
      © {new Date().getFullYear()} Maa Chandrika Mahila Mahavidyalaya, Mahoba. ·
      Made with care.
    </footer>
  );
}

/* ---------------- SHARED ---------------- */
function SectionHead({
  eyebrow,
  title,
  light,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="mb-10">
      <p
        className={`text-xs uppercase tracking-[0.25em] ${
          light ? "text-rose-400" : "text-rose-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-serif text-3xl sm:text-4xl ${
          light ? "text-white" : "text-stone-900"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
