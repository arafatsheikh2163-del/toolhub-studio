import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, TextArea, Stat } from "@/components/tools/Field";
import { Shuffle, Loader2, ClipboardPaste } from "lucide-react";

interface Comment { author: string; text: string; }

const SYSTEM_LINES = /^(Show less|Read more|Show more|Like|Dislike|Reply|Hide replies|Sort by|Top|Newest|Add a comment|Pinned by|Comments|Transcript|Description)$/i;

function stripMarkdown(input: string) {
  const cleaned = input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/Show less Read more|Show less|Read more/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const box = document.createElement("textarea");
  box.innerHTML = cleaned;
  return box.value.trim();
}

function parseJinaComments(markdown: string): Comment[] {
  const out: Comment[] = [];
  const re = /### \[@([^\]]+)\]\([^)]*\)([\s\S]*?)(?=\n\n### \[@|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) {
    const author = `@${m[1].trim()}`;
    const rawLines = m[2].split(/\r?\n/).map(l => l.trim());
    const dateIndex = rawLines.findIndex(l => /\bago\]\(|\bago$|\bminutes? ago|\bhours? ago|\bdays? ago|\bweeks? ago|\bmonths? ago|\byears? ago/i.test(l));
    if (dateIndex < 0) continue;

    const body: string[] = [];
    for (const line of rawLines.slice(dateIndex + 1)) {
      const cleaned = stripMarkdown(line);
      if (!cleaned) continue;
      if (cleaned === author || cleaned.includes(`${author} ${author}`)) continue;
      if (SYSTEM_LINES.test(cleaned) || /^\d+$/.test(cleaned) || /^\d+\s+repl(y|ies)$/i.test(cleaned)) break;
      if (/^Image \d+/i.test(cleaned)) continue;
      body.push(cleaned);
      if (body.join(" ").length > 500) break;
    }

    const text = body.join(" ").replace(/\s{2,}/g, " ").slice(0, 500).trim();
    if (text.length > 1) out.push({ author, text });
  }
  return dedupe(out);
}

function parsePastedComments(text: string): Comment[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = lines.map((line, i) => {
    const m = line.match(/^(@[\p{L}\p{N}._-]+)\s*[:：-]\s*(.+)$/u);
    return m ? { author: m[1], text: m[2].slice(0, 500) } : { author: `Entry ${i + 1}`, text: line.slice(0, 500) };
  });
  return dedupe(out);
}

function dedupe(list: Comment[]) {
  const seen = new Set<string>();
  return list.filter(c => {
    const k = `${c.author}|${c.text}`.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function extractVideoId(input: string): string | null {
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1, 12);
    const v = u.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const m = u.pathname.match(/\/(shorts|embed|live)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[2];
  } catch {}
  return null;
}

export default function YtCommentPicker() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [winners, setWinners] = useState<Comment[]>([]);
  const [manual, setManual] = useState("");

  async function loadComments() {
    setError(""); setWinners([]); setComments([]);
    const id = extractVideoId(url);
    if (!id) { setError("Could not detect a YouTube video ID. Paste a full video URL."); return; }
    setBusy(true);
    try {
      const target = `https://www.youtube.com/watch?v=${id}`;
      const res = await fetch(`https://r.jina.ai/${target}`, { headers: { "x-respond-with": "markdown" } });
      if (!res.ok) throw new Error("Failed to fetch the video page.");
      const text = await res.text();
      const cleaned = parseJinaComments(text);

      if (cleaned.length === 0) {
        setError("Auto fetch could not read comments for this video. Paste exported/copied comments below and pick winners instantly.");
      }
      setComments(cleaned);
    } catch (e: any) {
      setError(e?.message || "Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function loadManual() {
    const parsed = parsePastedComments(manual);
    setError(parsed.length ? "" : "Paste one comment per line, or @user: comment format.");
    setComments(parsed);
    setWinners([]);
  }

  function pick() {
    if (comments.length === 0) return;
    const pool = unique ? [...comments] : comments;
    const n = Math.min(count, pool.length);
    const w: Comment[] = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      w.push(pool[idx]);
      if (unique) pool.splice(idx, 1);
    }
    setWinners(w);
  }

  return (
    <ToolWorkspace toolId="yt-comment-picker">
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="YouTube video URL or ID" className="sm:col-span-3">
          <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
        </Field>
        <Field label="Winners">
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="w-full h-10 rounded-md bg-card border border-border px-3 text-sm" />
        </Field>
        <Field label="Unique winners">
          <label className="flex items-center gap-2 h-10 px-3 rounded-md surface-soft border border-border text-sm">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
            <span>No duplicates</span>
          </label>
        </Field>
        <div className="flex items-end gap-2">
          <button onClick={loadComments} disabled={busy || !url.trim()} className="btn-3d text-xs flex-1 disabled:opacity-50">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {busy ? "Loading…" : "Load comments"}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl surface-soft p-4 space-y-3">
        <Field label="Fallback: paste comments manually" hint="one per line">
          <TextArea rows={5} value={manual} onChange={(e) => setManual(e.target.value)} placeholder="@user: Great video!&#10;@another: Count me in" />
        </Field>
        <button onClick={loadManual} disabled={!manual.trim()} className="btn-3d-light text-xs !px-3.5 !py-2 disabled:opacity-50">
          <ClipboardPaste className="h-3.5 w-3.5" /> Use pasted comments
        </button>
      </div>

      {error && <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs px-3 py-2">{error}</div>}

      {comments.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Stat k="Loaded comments" v={comments.length} />
            <Stat k="Will pick" v={Math.min(count, comments.length)} />
            <Stat k="Mode" v={unique ? "Unique" : "Repeat OK"} />
          </div>

          <button onClick={pick} className="btn-3d text-xs mt-4">
            <Shuffle className="h-3.5 w-3.5" /> Pick winner{count > 1 ? "s" : ""}
          </button>
        </>
      )}

      {winners.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Winners</div>
          {winners.map((w, i) => (
            <div key={i} className="rounded-xl surface-warm border border-border p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">#{i + 1}</div>
              <div className="text-sm font-semibold">{w.author}</div>
              <div className="text-sm text-foreground/80 mt-1">{w.text}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground mt-6">No API key. Auto mode reads publicly rendered comments when YouTube exposes them; manual paste guarantees the picker still works for restricted videos.</p>
    </ToolWorkspace>
  );
}
