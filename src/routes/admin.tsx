import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  store,
  type AdmissionInfo,
  type DirectorMessage,
  type GalleryPhoto,
  type Notice,
} from "@/lib/college-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — MCMM" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem("mcmm_authed") === "1");
    }
  }, []);
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const c = store.getCred();
          if (email === c.email && password === c.password) {
            sessionStorage.setItem("mcmm_authed", "1");
            onSuccess();
          } else setErr("Invalid credentials");
        }}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="font-serif text-2xl text-stone-900">Admin Login</h1>
        <p className="text-sm text-stone-500">MCMM College administration</p>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button className="w-full rounded-full bg-rose-600 py-3 font-semibold text-white hover:bg-rose-500">
          Sign in
        </button>
        <Link
          to="/"
          className="block text-center text-sm text-stone-500 hover:text-stone-900"
        >
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

const TABS = [
  "Director",
  "Admissions",
  "Notices",
  "Gallery",
  "Settings",
] as const;
type Tab = (typeof TABS)[number];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("Director");
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-rose-600">
              MCMM
            </p>
            <h1 className="font-serif text-xl">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-full border px-4 py-2 text-sm hover:bg-stone-100"
            >
              View site
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("mcmm_authed");
                onLogout();
              }}
              className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t
                  ? "border-rose-600 text-rose-700"
                  : "border-transparent text-stone-600 hover:text-stone-900"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "Director" && <DirectorEdit />}
        {tab === "Admissions" && <AdmissionEdit />}
        {tab === "Notices" && <NoticesEdit />}
        {tab === "Gallery" && <GalleryEdit />}
        {tab === "Settings" && <SettingsEdit />}
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">{children}</div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500";

function DirectorEdit() {
  const [d, setD] = useState<DirectorMessage>(store.getDirector());
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <h2 className="font-serif text-2xl">Director's Message</h2>
      <Field label="Name">
        <input
          className={inputCls}
          value={d.name}
          onChange={(e) => setD({ ...d, name: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <input
          className={inputCls}
          value={d.title}
          onChange={(e) => setD({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Message">
        <textarea
          rows={6}
          className={inputCls}
          value={d.message}
          onChange={(e) => setD({ ...d, message: e.target.value })}
        />
      </Field>
      <Field label="Photo (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setD({ ...d, photo: await toDataURL(f) });
          }}
        />
        {d.photo && (
          <img
            src={d.photo}
            className="mt-2 h-20 w-20 rounded-full object-cover"
          />
        )}
      </Field>
      <SaveButton
        saved={saved}
        onClick={() => {
          store.setDirector(d);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      />
    </Card>
  );
}

function AdmissionEdit() {
  const [a, setA] = useState<AdmissionInfo>(store.getAdmission());
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <h2 className="font-serif text-2xl">Admissions</h2>
      <Field label="Status">
        <select
          className={inputCls}
          value={a.status}
          onChange={(e) =>
            setA({ ...a, status: e.target.value as AdmissionInfo["status"] })
          }
        >
          <option>Open</option>
          <option>Closing Soon</option>
          <option>Closed</option>
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Opens">
          <input
            type="date"
            className={inputCls}
            value={a.openDate}
            onChange={(e) => setA({ ...a, openDate: e.target.value })}
          />
        </Field>
        <Field label="Closes">
          <input
            type="date"
            className={inputCls}
            value={a.closeDate}
            onChange={(e) => setA({ ...a, closeDate: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Public note">
        <textarea
          rows={3}
          className={inputCls}
          value={a.note}
          onChange={(e) => setA({ ...a, note: e.target.value })}
        />
      </Field>
      <SaveButton
        saved={saved}
        onClick={() => {
          store.setAdmission(a);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      />
    </Card>
  );
}

function NoticesEdit() {
  const [notices, setNotices] = useState<Notice[]>(store.getNotices());
  const [cats, setCats] = useState<string[]>(store.getCategories());
  const [form, setForm] = useState<Notice>({
    id: "",
    title: "",
    category: cats[0] || "Notice",
    date: new Date().toISOString().slice(0, 10),
    body: "",
  });
  const [newCat, setNewCat] = useState("");

  const save = (next: Notice[]) => {
    setNotices(next);
    store.setNotices(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-serif text-2xl">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm"
            >
              {c}
              <button
                onClick={() => {
                  const next = cats.filter((x) => x !== c);
                  setCats(next);
                  store.setCategories(next);
                }}
                className="text-stone-500 hover:text-rose-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputCls}
            placeholder="New category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button
            onClick={() => {
              if (!newCat.trim()) return;
              const next = [...cats, newCat.trim()];
              setCats(next);
              store.setCategories(next);
              setNewCat("");
            }}
            className="rounded-full bg-stone-900 px-5 text-sm font-semibold text-white"
          >
            Add
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-serif text-2xl">Add a notice</h2>
        <Field label="Title">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date"
              className={inputCls}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Body">
          <textarea
            rows={3}
            className={inputCls}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </Field>
        <Field label="PDF attachment (optional)">
          <input
            type="file"
            accept="application/pdf"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setForm({
                ...form,
                pdf: await toDataURL(f),
                pdfName: f.name,
              });
            }}
          />
          {form.pdfName && (
            <p className="mt-1 text-xs text-stone-500">📄 {form.pdfName}</p>
          )}
        </Field>
        <button
          onClick={() => {
            if (!form.title.trim()) return;
            const n: Notice = { ...form, id: crypto.randomUUID() };
            save([n, ...notices]);
            setForm({
              id: "",
              title: "",
              category: cats[0] || "Notice",
              date: new Date().toISOString().slice(0, 10),
              body: "",
            });
          }}
          className="rounded-full bg-rose-600 px-6 py-2.5 font-semibold text-white hover:bg-rose-500"
        >
          + Publish notice
        </button>
      </Card>

      <Card>
        <h2 className="font-serif text-2xl">Existing notices ({notices.length})</h2>
        <ul className="space-y-2">
          {notices.map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{n.title}</p>
                <p className="text-xs text-stone-500">
                  {n.category} · {new Date(n.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => save(notices.filter((x) => x.id !== n.id))}
                className="text-sm text-rose-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function GalleryEdit() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(store.getGallery());
  const save = (next: GalleryPhoto[]) => {
    setPhotos(next);
    store.setGallery(next);
  };
  return (
    <Card>
      <h2 className="font-serif text-2xl">Gallery</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          const added: GalleryPhoto[] = await Promise.all(
            files.map(async (f) => ({
              id: crypto.randomUUID(),
              src: await toDataURL(f),
              caption: f.name,
            })),
          );
          save([...added, ...photos]);
          e.target.value = "";
        }}
      />
      {photos.length === 0 ? (
        <p className="text-sm text-stone-500">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.src} className="aspect-square w-full rounded-xl object-cover" />
              <button
                onClick={() => save(photos.filter((x) => x.id !== p.id))}
                className="absolute right-1 top-1 rounded-full bg-rose-600 px-2 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SettingsEdit() {
  const [current, setCurrent] = useState("");
  const [email, setEmail] = useState(store.getCred().email);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <Card>
      <h2 className="font-serif text-2xl">Admin credentials</h2>
      <Field label="Current password">
        <input
          type="password"
          className={inputCls}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </Field>
      <Field label="New email">
        <input
          type="email"
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="New password (leave blank to keep current)">
        <input
          type="password"
          className={inputCls}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </Field>
      {msg && <p className="text-sm">{msg}</p>}
      <button
        onClick={() => {
          const c = store.getCred();
          if (current !== c.password) {
            setMsg("❌ Current password is incorrect.");
            return;
          }
          store.setCred({ email, password: pw || c.password });
          setMsg("✅ Credentials updated.");
          setCurrent("");
          setPw("");
        }}
        className="rounded-full bg-rose-600 px-6 py-2.5 font-semibold text-white hover:bg-rose-500"
      >
        Update
      </button>
    </Card>
  );
}

function SaveButton({
  saved,
  onClick,
}: {
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-rose-600 px-6 py-2.5 font-semibold text-white hover:bg-rose-500"
    >
      {saved ? "✓ Saved" : "Save changes"}
    </button>
  );
}

function toDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
