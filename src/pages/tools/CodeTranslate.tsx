import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";
import { Wand2, Loader2, Copy, Check, Download, Eye, Code as CodeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const LANGS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "Python", "React (JSX)", "Vue",
  "Java", "C", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
  "Dart", "Bash", "PowerShell", "SQL", "R", "Scala", "Lua", "Perl", "Haskell",
];

const EXT: Record<string, string> = {
  "HTML": "html", "CSS": "css", "JavaScript": "js", "TypeScript": "ts",
  "Python": "py", "React (JSX)": "jsx", "Vue": "vue",
  "Java": "java", "C": "c", "C++": "cpp", "C#": "cs", "Go": "go", "Rust": "rs",
  "Ruby": "rb", "PHP": "php", "Swift": "swift", "Kotlin": "kt", "Dart": "dart",
  "Bash": "sh", "PowerShell": "ps1", "SQL": "sql", "R": "r", "Scala": "scala",
  "Lua": "lua", "Perl": "pl", "Haskell": "hs",
};

export default function CodeTranslate() {
  const [prompt, setPrompt] = useState("Build a clean landing page hero with a heading, subtitle, and a primary CTA button. Use modern CSS.");
  const [lang, setLang] = useState("HTML");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  async function generate() {
    setErr(""); setOut(""); setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("code-translate", { body: { prompt, lang } });
      if (error) throw new Error(error.message || "Generation failed.");
      if (data?.error) throw new Error(data.error);
      setOut((data?.code ?? "").trim());
    } catch (e: any) { setErr(e?.message || "Failed to generate."); }
    finally { setBusy(false); }
  }

  async function copy() {
    await navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function download() {
    const ext = EXT[lang] ?? "txt";
    const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `generated.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const isHTML = lang === "HTML";

  return (
    <ToolWorkspace toolId="code-translate">
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label="Describe what your code should do (any language)">
            <TextArea rows={10} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. একটা ফাংশন বানাও যা একটা স্ট্রিং রিভার্স করবে।" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target language">
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full h-10 rounded-md surface-soft border border-border px-3 text-sm">
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <div className="flex items-end">
              <motion.button
                onClick={generate}
                disabled={busy || !prompt.trim()}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -1 }}
                className="btn-3d text-xs w-full disabled:opacity-50"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {busy ? (
                    <motion.span key="b" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…
                    </motion.span>
                  ) : (
                    <motion.span key="r" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <Wand2 className="h-3.5 w-3.5" /> Generate code
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
          {err && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs px-3 py-2">{err}</motion.div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{lang} output</div>
            {out && (
              <div className="flex items-center gap-1.5">
                {isHTML && (
                  <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowPreview(p => !p)} className="btn-3d-light text-[11px] !px-2.5 !py-1.5">
                    {showPreview ? <CodeIcon className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showPreview ? "Code" : "Preview"}
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.94 }} onClick={copy} className="btn-3d-light text-[11px] !px-2.5 !py-1.5">
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span key="c" initial={{ opacity: 0, scale: 0.4, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.4 }} className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3" /> Copied
                      </motion.span>
                    ) : (
                      <motion.span key="cp" initial={{ opacity: 0, scale: 0.4, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.4 }} className="inline-flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={download} className="btn-3d-light text-[11px] !px-2.5 !py-1.5">
                  <Download className="h-3 w-3" /> Download
                </motion.button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isHTML && showPreview && out ? (
              <motion.div key="prev" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-card border border-border overflow-hidden min-h-[320px]">
                <iframe srcDoc={out} title="HTML preview" sandbox="allow-scripts" className="w-full h-[420px]" />
              </motion.div>
            ) : (
              <motion.pre key="code" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-card border border-border p-4 text-xs font-mono overflow-auto min-h-[320px] whitespace-pre-wrap">
                {out || (busy ? "Thinking…" : "Your generated code will appear here.")}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolWorkspace>
  );
}
