import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { Shuffle, Loader2 } from "lucide-react";

// Random YouTube comment picker — no API key. Uses the public youtube.com timed-text style fetch
// is not available, so we use the public scraping endpoint via a CORS-friendly proxy.
// We rely on r.jina.ai as a public read-only fetcher (no auth) to grab the comments JSON-ish blob.

interface Comment { author: string; text: string; }

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

  async function loadComments() {
    setError(""); setWinners([]); setComments([]);
    const id = extractVideoId(url);
    if (!id) { setError("Could not detect a YouTube video ID. Paste a full video URL."); return; }
    setBusy(true);
    try {
      // Public no-key reader proxy; returns markdown-ish text of the page incl. visible comments.
      const target = `https://www.youtube.com/watch?v=${id}`;
      const res = await fetch(`https://r.jina.ai/${target}`, { headers: { "x-respond-with": "markdown" } });
      if (!res.ok) throw new Error("Failed to fetch the video page.");
      const text = await res.text();

      // Heuristic: comments appear as "@handle\nComment text" blocks below the description.
      const lines = text.split(/\r?\n/);
      const out: Comment[] = [];
      for (let i = 0; i < lines.length - 1; i++) {
        const a = lines[i].trim();
        const b = lines[i + 1]?.trim() ?? "";
        const m = a.match(/^@([A-Za-z0-9._-]{2,})$/);
        if (m && b && b.length > 1 && !b.startsWith("@") && !/^\d+\s+(likes?|repl(y|ies))/i.test(b)) {
          out.push({ author: "@" + m[1], text: b.slice(0, 400) });
          i++;
        }
      }

      // Dedupe by author+text
      const seen = new Set<string>();
      const cleaned = out.filter(c => {
        const k = c.author + "|" + c.text;
        if (seen.has(k)) return false;
        seen.add(k); return true;
      });

      if (cleaned.length === 0) {
        setError("No comments could be extracted. The video may have comments disabled, or YouTube didn't return them in this fetch. Try again.");
      }
      setComments(cleaned);
    } catch (e: any) {
      setError(e?.message || "Network error. Try again.");
    } finally {
      setBusy(false);
    }
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

      <p className="text-[11px] text-muted-foreground mt-6">
        Note: runs entirely in-browser with no API key. Uses a public read-only fetch proxy and may return only the comments YouTube initially renders for the page (typically the top 20–50). Disabled comments cannot be retrieved.
      </p>
    </ToolWorkspace>
  );
}
