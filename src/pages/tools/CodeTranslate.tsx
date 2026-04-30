import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";
import { Wand2, Loader2, Copy, Check } from "lucide-react";

const LANGS = [
  "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#",
  "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart",
  "Bash", "PowerShell", "SQL", "R", "Scala", "Lua", "Perl", "Haskell",
];

export default function CodeTranslate() {
  const [prompt, setPrompt] = useState("Read a CSV file named data.csv, count rows where price > 100, then print the count.");
  const [lang, setLang] = useState("Python");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setErr(""); setOut(""); setBusy(true);
    try {
      const sys = `You are an expert programmer. Convert the user's natural-language description into clean, idiomatic ${lang} code. Reply with ONLY a single fenced code block — no explanation, no prose. Use modern best practices and include necessary imports.`;
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable settings.");
      if (!res.ok) throw new Error(`Generation failed (${res.status}).`);
      const data = await res.json();
      let text: string = data?.choices?.[0]?.message?.content ?? "";
      // strip ``` fences
      const m = text.match(/```[a-zA-Z+#-]*\n([\s\S]*?)```/);
      if (m) text = m[1];
      setOut(text.trim());
    } catch (e: any) {
      setErr(e?.message || "Failed to generate.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

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
              <button onClick={generate} disabled={busy || !prompt.trim()} className="btn-3d text-xs w-full disabled:opacity-50">
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                {busy ? "Generating…" : "Generate code"}
              </button>
            </div>
          </div>
          {err && <div className="rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs px-3 py-2">{err}</div>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{lang} output</div>
            {out && (
              <button onClick={copy} className="btn-3d-light text-[11px] !px-2.5 !py-1.5">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <pre className="rounded-xl bg-card border border-border p-4 text-xs font-mono overflow-auto min-h-[320px] whitespace-pre-wrap">
            {out || (busy ? "Thinking…" : "Your generated code will appear here.")}
          </pre>
        </div>
      </div>
    </ToolWorkspace>
  );
}
