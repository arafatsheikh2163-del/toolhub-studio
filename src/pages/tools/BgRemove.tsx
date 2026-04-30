import { useEffect, useMemo, useState } from "react";
import removeBackground, { preload, type Config } from "@imgly/background-removal";
import { Download, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";

const CONFIG: Config = {
  model: "isnet_quint8",
  device: "cpu",
  output: { format: "image/png", type: "foreground", quality: 1 },
};

export default function BgRemove() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("Ready");
  const [error, setError] = useState("");

  useEffect(() => {
    preload(CONFIG).catch(() => undefined);
  }, []);

  const fileLabel = useMemo(() => {
    if (!file) return "";
    return `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  }, [file]);

  async function process(nextFile: File) {
    if (out) URL.revokeObjectURL(out);
    if (src) URL.revokeObjectURL(src);
    setFile(nextFile);
    setSrc(URL.createObjectURL(nextFile));
    setOut("");
    setError("");
    setBusy(true);
    setProgress("Loading AI cutout model…");

    try {
      const blob = await removeBackground(nextFile, {
        ...CONFIG,
        progress: (_key, current, total) => {
          if (total) setProgress(`Processing ${(current / total * 100).toFixed(0)}%`);
        },
      });
      setOut(URL.createObjectURL(blob));
      setProgress("Background removed");
    } catch (e: any) {
      setError(e?.message || "Could not remove the background. Try a smaller JPG/PNG image.");
      setProgress("Failed");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    if (src) URL.revokeObjectURL(src);
    if (out) URL.revokeObjectURL(out);
    setFile(null); setSrc(""); setOut(""); setError(""); setBusy(false); setProgress("Ready");
  }

  return (
    <ToolWorkspace
      toolId="bg-remove"
      actions={out && (
        <a href={out} download="background-removed.png" className="btn-3d text-xs !px-3.5 !py-2">
          <Download className="h-3.5 w-3.5" /> Download PNG
        </a>
      )}
    >
      {!src ? (
        <div className="space-y-4">
          <Dropzone onFile={process} hint="AI cutout runs locally in your browser. JPG, PNG or WEBP up to 20MB works best." />
          <div className="rounded-2xl surface-warm p-4 text-xs text-muted-foreground leading-relaxed">
            Real subject detection is now used instead of weak color-key removal, so portraits, products, animals, and mixed backgrounds work much better.
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl surface-soft px-4 py-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{fileLabel}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{progress}</div>
            </div>
            <button onClick={reset} className="btn-3d-light text-xs !px-3.5 !py-2">
              <RotateCcw className="h-3.5 w-3.5" /> New image
            </button>
          </div>

          {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

          <div className="grid lg:grid-cols-2 gap-4">
            <Preview title="Original" src={src} />
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between px-1 pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Transparent result</span>
                {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <div className="relative overflow-hidden rounded-xl min-h-[320px] grid place-items-center checkerboard">
                {busy ? (
                  <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                    <span>{progress}</span>
                  </div>
                ) : out ? (
                  <img src={out} alt="Background removed result" className="max-h-[520px] w-auto max-w-full object-contain" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}

function Preview({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="rounded-xl surface-soft min-h-[320px] grid place-items-center overflow-hidden">
        <img src={src} alt={title} className="max-h-[520px] w-auto max-w-full object-contain" />
      </div>
    </div>
  );
}