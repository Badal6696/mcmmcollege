// LocalStorage-backed data for the college site.
// Safe in SSR: read returns defaults when window is unavailable.

import home1 from "@/assets/home1.asset.json";
import home2 from "@/assets/home2.asset.json";
import home3 from "@/assets/home3.asset.json";
import logoAsset from "@/assets/logo.asset.json";

export const HERO_IMAGES = [home1.url, home2.url, home3.url];
export const LOGO_URL = logoAsset.url;

export type Notice = {
  id: string;
  title: string;
  category: string;
  date: string; // ISO date
  body?: string;
  pdf?: string; // base64 data URL
  pdfName?: string;
};

export type GalleryPhoto = {
  id: string;
  src: string; // data URL or URL
  caption?: string;
};

export type DirectorMessage = {
  name: string;
  title: string;
  message: string;
  photo?: string;
};

export type AdmissionInfo = {
  status: "Open" | "Closing Soon" | "Closed";
  openDate: string;
  closeDate: string;
  note: string;
};

export type AdminCred = { email: string; password: string };

const KEYS = {
  cred: "mcmm_cred",
  director: "mcmm_director",
  admission: "mcmm_admission",
  notices: "mcmm_notices",
  categories: "mcmm_categories",
  gallery: "mcmm_gallery",
} as const;

export const DEFAULT_CRED: AdminCred = {
  email: "admin@mcmm.edu.in",
  password: "MCMM@2024",
};

export const DEFAULT_DIRECTOR: DirectorMessage = {
  name: "Dr. Anjali Verma",
  title: "Director",
  message:
    "At Maa Chandrika Mahila Mahavidyalaya, we believe that education is the most powerful tool to shape a confident and independent woman. Our college is committed to nurturing intellect, character, and creativity in every student who walks through our gates.",
};

export const DEFAULT_ADMISSION: AdmissionInfo = {
  status: "Open",
  openDate: "2026-06-01",
  closeDate: "2026-07-31",
  note: "Admissions are now open for the 2026-27 academic session. Apply early to secure your seat.",
};

export const DEFAULT_CATEGORIES = ["Notice", "Result", "Event", "Admission"];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "Admissions Open for 2026-27 Session",
    category: "Admission",
    date: "2026-06-15",
    body: "Applications are invited for B.A., B.Sc., M.A. and D.El.Ed. programs.",
  },
  {
    id: "n2",
    title: "Annual Cultural Fest — Saanjh 2026",
    category: "Event",
    date: "2026-06-10",
    body: "Join us for a vibrant celebration of music, dance and literature.",
  },
];

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const store = {
  getCred: () => safeGet<AdminCred>(KEYS.cred, DEFAULT_CRED),
  setCred: (v: AdminCred) => safeSet(KEYS.cred, v),

  getDirector: () => safeGet<DirectorMessage>(KEYS.director, DEFAULT_DIRECTOR),
  setDirector: (v: DirectorMessage) => safeSet(KEYS.director, v),

  getAdmission: () => safeGet<AdmissionInfo>(KEYS.admission, DEFAULT_ADMISSION),
  setAdmission: (v: AdmissionInfo) => safeSet(KEYS.admission, v),

  getNotices: () => safeGet<Notice[]>(KEYS.notices, DEFAULT_NOTICES),
  setNotices: (v: Notice[]) => safeSet(KEYS.notices, v),

  getCategories: () => safeGet<string[]>(KEYS.categories, DEFAULT_CATEGORIES),
  setCategories: (v: string[]) => safeSet(KEYS.categories, v),

  getGallery: () => safeGet<GalleryPhoto[]>(KEYS.gallery, []),
  setGallery: (v: GalleryPhoto[]) => safeSet(KEYS.gallery, v),
};

export const PROGRAMS = [
  {
    code: "B.A.",
    name: "Bachelor of Arts",
    duration: "3 Years",
    subjects: "Hindi, English, History, Sociology, Political Science",
    desc: "A foundational liberal-arts degree shaping articulate, thoughtful graduates.",
  },
  {
    code: "B.Sc.",
    name: "Bachelor of Science",
    duration: "3 Years",
    subjects: "Mathematics Group & Biology Group",
    desc: "Rigorous science education with strong lab and analytical training.",
  },
  {
    code: "M.A.",
    name: "Master of Arts",
    duration: "2 Years",
    subjects: "Hindi, English, History, Sociology",
    desc: "Advanced study and research across the humanities.",
  },
  {
    code: "D.El.Ed.",
    name: "Diploma in Elementary Education (BTC)",
    duration: "2 Years",
    subjects: "Pedagogy, Child Psychology, Teaching Practice",
    desc: "Professional training for future teachers of elementary education.",
  },
] as const;
