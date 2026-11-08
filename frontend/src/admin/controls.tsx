import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon, EyeIcon, EyeOffIcon } from "../components/Icons";
import type { LabelValue, SkillRow } from "../data";
import { api, apiEnabled } from "../lib/api";

/* ------------------------------------------------------------------ */
/*  Toasts                                                             */
/* ------------------------------------------------------------------ */

type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastContext = createContext<(text: string, tone?: "ok" | "err") => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[110] flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-pop-in rounded-lg border px-4 py-3 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur ${
              t.tone === "ok" ? "border-accent/40 bg-black/90 text-accent" : "border-red-400/40 bg-black/90 text-red-400"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ------------------------------------------------------------------ */
/*  Basic fields                                                       */
/* ------------------------------------------------------------------ */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">{label}</span>
      ) : null}
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-gray-600">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent";

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
    </Field>
  );
}

export function RangeSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <Field label={`${label} — ${value}`} hint={hint}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-accent"
      />
    </Field>
  );
}

import { FormattedText } from "../components/FormattedText";
import { useFormattingGuide } from "./FormattingGuideModal";

export function FormattingToolbar({
  textareaRef,
  value,
  onChange,
  showPreview,
  onTogglePreview,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (val: string) => void;
  showPreview?: boolean;
  onTogglePreview?: () => void;
}) {
  const { openGuide } = useFormattingGuide();

  const wrapSelection = (openTag: string, closeTag: string, defaultText = "text") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${openTag}${selected}${closeTag}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(nextVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

  // [br] is a void tag, it has no closing tag and must not wrap text.
  // Insert it at the cursor instead, so text after it is never lost.
  const insertTag = (tagText: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextVal = value.substring(0, start) + tagText + value.substring(end);
    onChange(nextVal);
    const cursor = start + tagText.length;
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-white/10 bg-black/40 px-2.5 py-1.5 rounded-t-md">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => wrapSelection("[b]", "[/b]", "bold")}
          title="Bold [b]text[/b]"
          className="h-6 px-1.5 rounded text-[11px] font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[i]", "[/i]", "italic")}
          title="Italic [i]text[/i]"
          className="h-6 px-1.5 rounded text-[11px] font-serif italic text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[u]", "[/u]", "underline")}
          title="Underline [u]text[/u]"
          className="h-6 px-1.5 rounded text-[11px] underline text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          U
        </button>
        <span className="h-3 w-px bg-white/15 mx-0.5" />
        <button
          type="button"
          onClick={() => wrapSelection("[x]", "[/x]", "highlight")}
          title="Accent Yellow [x]text[/x]"
          className="h-6 px-2 rounded text-[11px] font-bold text-accent bg-accent/10 border border-accent/30 hover:bg-accent hover:text-black transition-colors"
        >
          ★ Yellow
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[justify]", "[/justify]", "Justified paragraph")}
          title="Justify paragraph [justify]...[/justify]"
          className="h-6 px-1.5 rounded text-[11px] text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          Justify
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[center]", "[/center]", "Centered text")}
          title="Center text [center]...[/center]"
          className="h-6 px-1.5 rounded text-[11px] text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[badge]", "[/badge]", "PRO")}
          title="Badge pill [badge]text[/badge]"
          className="h-6 px-1.5 rounded text-[10px] uppercase font-bold text-accent/80 border border-accent/20 bg-accent/5 hover:bg-accent hover:text-black transition-colors"
        >
          Badge
        </button>
        <span className="h-3 w-px bg-white/15 mx-0.5" />
        <button
          type="button"
          onClick={() => insertTag("[br]")}
          title="Line break [br] - one line gap. Click twice for two gaps."
          className="h-6 px-1.5 rounded text-[11px] font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          ↵ Break
        </button>
        <button
          type="button"
          onClick={() => insertTag("[br][br]")}
          title="Paragraph gap [br][br] - two line gaps"
          className="h-6 px-1.5 rounded text-[11px] font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          ¶ Gap
        </button>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            className={`h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
              showPreview ? "bg-accent text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {showPreview ? "Edit Mode" : "Preview"}
          </button>
        )}
        <button
          type="button"
          onClick={openGuide}
          className="h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wider text-accent hover:bg-accent/10 transition-colors flex items-center gap-1"
          title="Open Formatting Guide & Test Sandbox"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3.5 3.5H12l8.5 8.5-7 7L3.5 11.5V3.5z" />
            <circle cx="8" cy="8" r="1.6" />
          </svg>
          <span>Guide</span>
        </button>
      </div>
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  withFormatting = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  withFormatting?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Field label={label} hint={hint}>
      {withFormatting ? (
        <div className="rounded-md border border-white/10 bg-neutral-950 overflow-hidden focus-within:border-accent transition-colors">
          <FormattingToolbar
            textareaRef={textareaRef}
            value={value}
            onChange={onChange}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview((s) => !s)}
          />
          {showPreview ? (
            <div className="min-h-[96px] p-3 text-sm text-gray-200 bg-black/60 leading-relaxed font-sans">
              <FormattedText text={value || "No content to preview"} />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              rows={rows}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none resize-y block font-mono"
            />
          )}
        </div>
      ) : (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y`}
        />
      )}
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  Tech stack picker: click a technology to add / remove it          */
/*  Presets come from the technologies already used in the live       */
/*  projects, plus the rest of the stack used across this portfolio.   */
/* ------------------------------------------------------------------ */

const TECH_STACK_GROUPS: { label: string; items: string[] }[] = [
  { label: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Bootstrap", "Redux", "Vite", "Figma", "UI/UX Design"] },
  { label: "Backend", items: ["Node.js", "Express.js", "Fast API", "RESTful APIs", "GraphQL", "Socket.io", "JWT Authentication", "Nodemailer", "Multer", "Bcrypt"] },
  { label: "Database", items: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL", "Firebase", "Supabase"] },
  { label: "Mobile", items: ["React Native", "Expo", "Android", "iOS", "Push Notifications", "PWA"] },
  { label: "AI & ML", items: ["AI Integration", "OpenAI API", "ChatGPT Integration", "LLM Integration", "RAG", "Machine Learning", "YOLO", "Computer Vision", "TensorFlow", "Deep Learning"] },
  { label: "Cloud & DevOps", items: ["Vercel", "AWS", "Docker", "Git", "GitHub", "CI/CD", "Cloudinary"] },
  { label: "Integrations", items: ["WhatsApp API Integration", "WhatsApp Notifications", "Stripe Payment", "Payment Integration", "Google Maps API", "Google Auth", "Firebase Auth", "Ads Integration"] },
  { label: "Features", items: ["Admin Panel", "Dashboard", "Role Based Panel", "Real-time Chat", "Booking System", "E-commerce", "Multilingual Support", "RTL Support", "Arabic Typography", "SEO", "OTP Verification", "Auto Invoice & Receipt", "Auto Challan & Receipt", "Support (English/Arabic)", "Responsive Web Design", "JSON", "Axios"] },
];

function parseStackText(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TechStackPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const current = parseStackText(value);
  const lower = current.map((s) => s.toLowerCase());

  const toggle = (name: string) => {
    const idx = lower.indexOf(name.toLowerCase());
    const next = idx >= 0 ? current.filter((_, i) => i !== idx) : [...current, name];
    onChange(next.join(", "));
  };

  const q = query.trim().toLowerCase();
  const groups = TECH_STACK_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => !q || item.toLowerCase().includes(q)),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Quick add technologies</span>
      <div className="rounded-md border border-white/10 bg-neutral-950 p-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies..."
          className="mb-2 w-full rounded-md border border-white/10 bg-black px-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none transition-colors focus:border-accent"
        />
        <div className="scrollbar-thin max-h-44 space-y-3 overflow-y-auto pr-1">
          {groups.length === 0 ? (
            <p className="py-2 text-center text-xs text-gray-600">No technology matches &quot;{query}&quot;. Type it in the field above instead.</p>
          ) : (
            groups.map((g) => (
              <div key={g.label}>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => {
                    const selected = lower.includes(item.toLowerCase());
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggle(item)}
                        title={selected ? `Remove ${item}` : `Add ${item}`}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                          selected ? "border-accent bg-accent/15 text-accent" : "border-white/15 text-gray-300 hover:border-accent hover:text-accent"
                        }`}
                      >
                        {selected ? `✓ ${item}` : item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <span className="mt-1.5 block text-xs text-gray-600">Click a technology to add it, click again to remove it. You can still type your own in the field above.</span>
    </div>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-neutral-950">
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-left">
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-accent" : "bg-gray-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-black transition-all duration-300 ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        {hint ? <span className="block text-xs text-gray-600">{hint}</span> : null}
      </span>
    </button>
  );
}

/* Password input with show/hide eye button. */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-accent"
        >
          {show ? <EyeOffIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
        </button>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  Media helpers                                                      */
/* ------------------------------------------------------------------ */

export function fileToImage(file: File, maxW = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function videoEmbed(url: string): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return { type: "video", src: url };
}

/* Upload a file: returns compressed local data-URL. */
async function uploadOrLocal(file: File, local: () => Promise<string>): Promise<string> {
  return local();
}

/* ------------------------------------------------------------------ */
/*  Media pickers                                                      */
/* ------------------------------------------------------------------ */

export function ImagePicker({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadOrLocal(file, () => fileToImage(file)));
      toast("Image ready. Don't forget to Save");
    } catch {
      toast("Could not read that image file", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-neutral-950">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] uppercase tracking-widest text-gray-600">No image</span>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={value.startsWith("data:") ? "(uploaded image data)" : value}
            placeholder="…or paste an image URL"
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-accent/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black">
              {busy ? "Reading…" : "Upload"}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange("")} className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:border-red-400 hover:text-red-400">
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Field>
  );
}

export function VideoPicker({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const embed = value ? videoEmbed(value) : null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!apiEnabled && file.size > 4 * 1024 * 1024) {
      toast("Video too big (max 4MB). Paste a YouTube/Vimeo link instead", "err");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      toast("Video attached. Don't forget to Save");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Field label={label} hint={hint ?? "Paste a YouTube / Vimeo link, or upload a small video file."}>
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFile} />
      <div className="space-y-2">
        {embed ? (
          <div className="overflow-hidden rounded-md border border-white/10">
            {embed.type === "iframe" ? (
              <iframe src={embed.src} title="Video preview" className="h-40 w-full" allowFullScreen />
            ) : (
              <video src={embed.src} controls className="h-40 w-full bg-black object-cover" />
            )}
          </div>
        ) : null}
        <input
          value={value.startsWith("data:") ? "(uploaded video data)" : value}
          placeholder="https://www.youtube.com/watch?v=…"
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-accent/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black">
            Upload Video
          </button>
          {value ? (
            <button type="button" onClick={() => onChange("")} className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:border-red-400 hover:text-red-400">
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </Field>
  );
}

export function ResumePicker({ label, value, onChange, hint }: { label: string; value: { fileName: string; data: string }; onChange: (v: { fileName: string; data: string }) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!apiEnabled && file.size > 3 * 1024 * 1024) {
      toast("Resume too big (max 3MB) for browser storage. Use a Drive/Dropbox link", "err");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ fileName: file.name, data: String(reader.result) });
      toast("Resume attached. Don't forget to Save");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Field label={label} hint={hint ?? "Upload a PDF, or paste a Drive/Dropbox link. Visitors download it from the Resume card."}>
      <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFile} />
      <div className="space-y-2">
        <input
          value={value.data.startsWith("data:") ? `(uploaded) ${value.fileName}` : value.data}
          placeholder="https://drive.google.com/…  (or upload below)"
          onChange={(e) => onChange({ fileName: value.fileName, data: e.target.value })}
          className={inputCls}
        />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-accent/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black">
            Upload PDF
          </button>
          {value.data ? (
            <>
              <a
                href={value.data}
                download={value.fileName || "resume.pdf"}
                target={value.data.startsWith("data:") ? undefined : "_blank"}
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-accent hover:text-accent"
              >
                Test Download
              </a>
              <button type="button" onClick={() => onChange({ fileName: "", data: "" })} className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:border-red-400 hover:text-red-400">
                Remove
              </button>
            </>
          ) : null}
        </div>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  List editors                                                       */
/* ------------------------------------------------------------------ */

function RowRemove({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove row" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-gray-500 transition-colors hover:border-red-400/60 hover:text-red-400">
      <CloseIcon className="h-4 w-4" />
    </button>
  );
}

export function PairsEditor({ label, items, onChange, addLabel = "Add item", hint }: { label: string; items: LabelValue[]; onChange: (v: LabelValue[]) => void; addLabel?: string; hint?: string }) {
  const move = (index: number, dir: -1 | 1) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);
    onChange(reordered);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item.label}
              placeholder="Label (e.g. Name)"
              onChange={(e) => onChange(items.map((it, idx) => (idx === i ? { ...it, label: e.target.value } : it)))}
              className="w-1/3 min-w-[110px] rounded-md border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent"
            />
            <input
              value={item.value}
              placeholder="Data / Value (e.g. Mubashir Ahmed)"
              onChange={(e) => onChange(items.map((it, idx) => (idx === i ? { ...it, value: e.target.value } : it)))}
              className="flex-1 min-w-[130px] rounded-md border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                title="Move Up"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:hover:border-white/10"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
                title="Move Down"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:hover:border-white/10"
              >
                <ArrowDownIcon className="h-4 w-4" />
              </button>
              <RowRemove onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
        <AddButton onClick={() => onChange([...items, { label: "", value: "" }])}>{addLabel}</AddButton>
      </div>
    </Field>
  );
}

export function SkillsEditor({ label, items, onChange }: { label: string; items: SkillRow[]; onChange: (v: SkillRow[]) => void }) {
  const move = (index: number, dir: -1 | 1) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);
    onChange(reordered);
  };

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((skill, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3">
            <input
              value={skill.name}
              placeholder="Skill name"
              onChange={(e) => onChange(items.map((s, idx) => (idx === i ? { ...s, name: e.target.value } : s)))}
              className="flex-1 min-w-[120px] rounded-md border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={skill.level}
              onChange={(e) => onChange(items.map((s, idx) => (idx === i ? { ...s, level: Number(e.target.value) } : s)))}
              className="w-24 sm:w-28 accent-[#ffc107]"
            />
            <span className="w-11 text-right font-display text-sm font-bold text-accent shrink-0">
              {skill.level}%
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                title="Move Up"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:hover:border-white/10"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
                title="Move Down"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:hover:border-white/10"
              >
                <ArrowDownIcon className="h-4 w-4" />
              </button>
              <RowRemove onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
        <AddButton onClick={() => onChange([...items, { name: "", level: 80 }])}>Add skill</AddButton>
      </div>
    </Field>
  );
}

function ParagraphRow({
  value,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  value: string;
  index: number;
  total: number;
  onChange: (v: string) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="rounded-md border border-white/10 bg-neutral-950 overflow-hidden focus-within:border-accent transition-colors">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-3 py-1.5 text-xs">
        <span className="font-mono text-[11px] font-bold text-accent">Paragraph #{index + 1}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            title="Move Up"
            className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-gray-400 hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20"
          >
            <ArrowUpIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            title="Move Down"
            className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-gray-400 hover:border-accent hover:bg-accent hover:text-black disabled:opacity-20"
          >
            <ArrowDownIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Remove paragraph"
            className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-gray-400 hover:border-red-400 hover:bg-red-400 hover:text-black"
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
      <FormattingToolbar
        textareaRef={textareaRef}
        value={value}
        onChange={onChange}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((s) => !s)}
      />
      {showPreview ? (
        <div className="min-h-[80px] p-3 text-sm text-gray-200 bg-black/60 leading-relaxed font-sans">
          <FormattedText text={value || "No paragraph content to preview"} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          rows={3}
          placeholder="Enter paragraph text..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none resize-y block font-mono"
        />
      )}
    </div>
  );
}

export function ParagraphsEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    const temp = next[i];
    next[i] = next[target];
    next[target] = temp;
    onChange(next);
  };

  return (
    <Field label={label}>
      <div className="space-y-4">
        {items.map((p, i) => (
          <ParagraphRow
            key={i}
            value={p}
            index={i}
            total={items.length}
            onChange={(val) => onChange(items.map((x, idx) => (idx === i ? val : x)))}
            onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
            onMove={(dir) => move(i, dir)}
          />
        ))}
        <AddButton onClick={() => onChange([...items, ""])}>Add paragraph</AddButton>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  Action buttons                                                     */
/* ------------------------------------------------------------------ */

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-accent hover:text-accent">
      <span className="text-sm leading-none">+</span>
      {children}
    </button>
  );
}

export function SaveBar({ dirty, onSave, onDiscard }: { dirty: boolean; onSave: () => void; onDiscard: () => void }) {
  return (
    <div className={`sticky bottom-4 z-30 mt-10 flex items-center gap-3 rounded-lg border px-5 py-3.5 backdrop-blur transition-all duration-300 ${dirty ? "border-accent/40 bg-black/90 shadow-[0_14px_44px_rgba(0,0,0,0.7)]" : "border-white/10 bg-black/60"}`}>
      <span className={`h-2 w-2 rounded-full ${dirty ? "animate-pulse bg-accent" : "bg-gray-700"}`} />
      <span className="text-xs text-gray-400">{dirty ? "Unsaved changes" : "All changes saved"}</span>
      <div className="ml-auto flex gap-2.5">
        <button type="button" onClick={onDiscard} disabled={!dirty} className="rounded-full border border-white/15 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors enabled:hover:border-white enabled:hover:text-white disabled:opacity-40">
          Discard
        </button>
        <button type="button" onClick={onSave} disabled={!dirty} className="rounded-full bg-accent px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition-all enabled:hover:bg-yellow-300 enabled:hover:shadow-[0_8px_28px_rgba(255,193,7,0.35)] disabled:opacity-40">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export function VisibilityToggle({ hidden, onToggle, small = false }: { hidden: boolean; onToggle: () => void; small?: boolean }) {
  const cls = small ? "rounded-md px-3 py-1.5 text-[10px] gap-1.5" : "rounded-full px-3.5 py-1.5 text-[10px] gap-1.5";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!hidden}
      title={hidden ? "Show on website" : "Hide from website"}
      className={`inline-flex items-center font-bold uppercase tracking-wider transition-colors ${cls} ${
        hidden
          ? "border border-white/15 bg-white/5 text-gray-500 hover:border-white/40 hover:text-gray-200"
          : "border border-accent/50 bg-accent/10 text-accent hover:bg-accent hover:text-black"
      }`}
    >
      {hidden ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
      {hidden ? "Hidden" : "Public"}
    </button>
  );
}

export function DeleteButton({ onDelete, label = "Delete", small = false }: { onDelete: () => void; label?: string; small?: boolean }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 2600);
    return () => window.clearTimeout(t);
  }, [armed]);

  const cls = small ? "rounded-md px-3 py-1.5 text-[10px]" : "rounded-full px-4 py-1.5 text-[11px]";

  return armed ? (
    <button type="button" onClick={() => { onDelete(); setArmed(false); }} className={`${cls} font-bold uppercase tracking-wider bg-red-500 text-black transition-colors hover:bg-red-400`}>
      Confirm?
    </button>
  ) : (
    <button type="button" onClick={() => setArmed(true)} className={`${cls} font-bold uppercase tracking-wider border border-red-400/40 text-red-400 transition-colors hover:bg-red-400/10`}>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  OTP modal                                                          */
/* ------------------------------------------------------------------ */

export function OtpModal({
  email,
  demoCode,
  onClose,
  onVerified,
  verifyRemote,
}: {
  email: string;
  demoCode: string;
  onClose: () => void;
  /* Receives the verified (or collected) code. */
  onVerified: (code: string) => void;
  /* When provided (backend mode) the code is checked on the server instead. */
  verifyRemote?: (code: string) => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    const trimmed = code.trim();
    if (trimmed.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (verifyRemote) {
      setBusy(true);
      try {
        await verifyRemote(trimmed);
        onVerified(trimmed);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Incorrect code. Try again.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (trimmed === demoCode) {
      onVerified(trimmed);
    } else {
      setError("Incorrect code. Please check and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm animate-pop-in rounded-xl border border-white/10 bg-[#0d0d0d] p-7" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold text-white">Verify it&apos;s you</h3>
        <p className="mt-1.5 text-xs text-gray-500">
          A 6-digit code was sent to <span className="text-gray-300">{email}</span>
        </p>

        {!verifyRemote && demoCode ? (
          <div className="mt-4 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">Demo mode: no email service yet</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-[0.4em] text-accent">{demoCode}</p>
          </div>
        ) : null}

        <input
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          placeholder="••••••"
          inputMode="numeric"
          className="mt-5 w-full rounded-md border border-white/10 bg-neutral-950 px-4 py-3 text-center font-display text-xl font-bold tracking-[0.5em] text-white placeholder-gray-700 outline-none transition-colors focus:border-accent"
        />
        {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}

        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-white/15 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-white hover:text-white">
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={busy} className="flex-1 rounded-full bg-accent py-2.5 text-[11px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-yellow-300 disabled:opacity-60">
            {busy ? "Verifying…" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
