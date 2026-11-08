import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { FormattedText } from "../components/FormattedText";

interface FormattingGuideContextValue {
  openGuide: () => void;
  closeGuide: () => void;
  isGuideOpen: boolean;
}

export const FormattingGuideContext = createContext<FormattingGuideContextValue>({
  openGuide: () => {},
  closeGuide: () => {},
  isGuideOpen: false,
});

export const useFormattingGuide = () => useContext(FormattingGuideContext);

export function FormattingGuideProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormattingGuideContext.Provider
      value={{
        openGuide: () => setIsOpen(true),
        closeGuide: () => setIsOpen(false),
        isGuideOpen: isOpen,
      }}
    >
      {children}
      <FormattingGuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </FormattingGuideContext.Provider>
  );
}

const CHEAT_SHEET = [
  {
    category: "Typography",
    items: [
      {
        tag: "[b]Bold Text[/b]",
        desc: "Bold high-contrast font",
        example: "[b]Senior Developer[/b]",
      },
      {
        tag: "[i]Italic Text[/i]",
        desc: "Italic styling",
        example: "[i]Clean and pixel-perfect[/i]",
      },
      {
        tag: "[u]Underline[/u]",
        desc: "Underline with subtle gold accent",
        example: "[u]Three years of experience[/u]",
      },
      {
        tag: "[code]inline code[/code]",
        desc: "Monospace code snippet",
        example: "[code]React.js & Node.js[/code]",
      },
    ],
  },
  {
    category: "Colors & Highlights",
    items: [
      {
        tag: "[x]Yellow Highlight[/x]",
        desc: "Signature Yellow / Gold accent color",
        example: "[x]Mubashir Ahmed[/x]",
      },
      {
        tag: "[yellow]Yellow[/yellow] / [gold]Gold[/gold]",
        desc: "Accent yellow / warm gold",
        example: "[yellow]Fast Delivery[/yellow]",
      },
      {
        tag: "[color=#FF5722]Custom Hex[/color]",
        desc: "Any custom hex or color name",
        example: "[color=#FF5722]Coral Orange[/color] or [color=#00E676]Neon Green[/color]",
      },
      {
        tag: "[green]...[/green], [red]...[/red], [cyan]...[/cyan]",
        desc: "Predefined theme colors (green, red, cyan, blue, purple, white, gray)",
        example: "[green]Active / Online[/green] · [cyan]High Performance[/cyan]",
      },
      {
        tag: "[badge]Tag / Pill[/badge]",
        desc: "Glowing rounded pill badge",
        example: "[badge]Available for Work[/badge]",
      },
    ],
  },
  {
    category: "Paragraph Alignment",
    items: [
      {
        tag: "[justify]Paragraph...[/justify]",
        desc: "Justifies paragraph text across both margins",
        example: "[justify]I craft fast, scalable and pixel-perfect web applications with clean code and modern architecture.[/justify]",
      },
      {
        tag: "[center]Centered text[/center]",
        desc: "Aligns text in the center",
        example: "[center]Built with love and precision[/center]",
      },
      {
        tag: "[right]Right aligned[/right]",
        desc: "Aligns text to the right",
        example: "[right]— Mubashir Ahmed[/right]",
      },
    ],
  },
  {
    category: "Spacing & Line Breaks",
    items: [
      {
        tag: "[br]",
        desc: "Single line break",
        example: "First line[br]Second line",
      },
      {
        tag: "[br][br]",
        desc: "Double line break for paragraph spacing",
        example: "First paragraph[br][br]Second paragraph with spacing",
      },
      {
        tag: "[p]Paragraph[/p]",
        desc: "Paragraph block with automatic spacing above and below",
        example: "[p]This is a full paragraph with automatic spacing.[/p][p]Another paragraph.[/p]",
      },
      {
        tag: "[br][br][br]",
        desc: "Triple line break for larger spacing between sections",
        example: "Section 1[br][br][br]Section 2",
      },
    ],
  },
];

export default function FormattingGuideModal({
  isOpen,
  onClose,
  onInsertTag,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsertTag?: (tag: string) => void;
}) {
  const [testText, setTestText] = useState(
    "Hello! I am [b]Mubashir Ahmed[/b], a [x]FullStack Developer[/x] & [color=#00E676]AI Engineer[/color]!\n[justify]This text is [i]completely justified[/i] with [u]accent underline[/u] and a [badge]PRO[/badge] badge.[/justify][br][br][p]This is a new paragraph with automatic spacing.[/p]"
  );
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    if (onInsertTag) onInsertTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/15 bg-neutral-950 shadow-[0_25px_100px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-accent font-black text-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 3.5H12l8.5 8.5-7 7L3.5 11.5V3.5z" />
                <circle cx="8" cy="8" r="1.6" />
              </svg>
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Website Text Formatting Guide &amp; Tags
              </h2>
              <p className="text-xs text-gray-400">
                Use these tags anywhere in the Admin Panel to bold, italicize, color, or align text across your entire portfolio!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 hover:border-white hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="scrollbar-thin flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Interactive Sandbox */}
          <div className="rounded-xl border border-accent/30 bg-accent/[0.03] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <span>⚡ Live Interactive Test Sandbox</span>
              </span>
              <span className="text-[10px] text-gray-500">Type below to test live styling</span>
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/15 bg-black/80 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-accent font-mono transition-colors"
              placeholder="Type anything with tags like [b], [i], [x], [justify]..."
            />

            {/* Live Rendered Preview */}
            <div className="mt-3 rounded-lg border border-white/10 bg-black/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Website Render Preview:
              </p>
              <div className="text-sm text-gray-200 leading-relaxed font-sans">
                <FormattedText text={testText} />
              </div>
            </div>
          </div>

          {/* Cheat Sheet Categories */}
          <div className="space-y-6">
            {CHEAT_SHEET.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-1.5">
                  {cat.category}
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-accent/40 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-bold text-accent font-mono bg-black/50 px-2 py-0.5 rounded border border-accent/20">
                            {item.tag}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.tag)}
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 hover:bg-accent hover:text-black text-gray-300 transition-colors"
                          >
                            {copiedTag === item.tag ? "Copied! ✓" : "Copy"}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400">{item.desc}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-gray-500">Preview:</span>
                        <div className="text-right">
                          <FormattedText text={item.example} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-3.5 bg-black/60 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            💡 <span className="text-gray-300">Tip:</span> You can combine tags! E.g. <code className="text-accent font-mono">[b][x]Bold and Yellow[/x][/b]</code>
          </p>
          <button
            onClick={onClose}
            className="rounded-full bg-accent px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-yellow-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
