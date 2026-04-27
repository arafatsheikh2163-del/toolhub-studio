import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { BeforeAfter } from "@/components/tools/BeforeAfter";
import { loadImage, canvasToBlob, drawImageToCanvas } from "@/lib/image";
import { downloadBlob } from "@/lib/format";
import { toast } from "sonner";

type Fmt = "image/jpeg" | "image/webp";

export default function ImageCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<Fmt>("image/jpeg");
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    setBusy(true);
    loadImage(file)
      .then(setImg)
      .catch(() => toast.error("Could not read image"))
      .finally(() => setBusy(false));
  }, [file]);

  useEffect(() => {
    if (!img) return;
    let cancelled = false;
    setBusy(true);
    const c = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
    canvasToBlob(c, format, quality)
      .then(blob => {
        if (cancelled) return;
        setOutBlob(blob);
        setOutUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      })
      .catch(() => toast.error("Compression failed"))
      .finally(() => !cancelled && setBusy(false));
    return () => { cancelled = true; };
  }, [img, quality, format]);

  const reset = () => { setFile(null); setImg(null); setOutBlob(null); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); };
  const download = () => { if (outBlob && file) downloadBlob(outBlob, file.name.replace(/\.[^.]+$/, "") + (format === "image/webp" ? ".webp" : ".jpg")); };

  return (
    <ToolWorkspace toolId="image-compress" actions={
      <>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <button onClick={download} disabled={!outBlob} className="btn-pill btn-primary disabled:opacity-50 disabled:pointer-events-none">Download</button>
      </>
    }>
      {!file ? (
        <Dropzone onFile={setFile} hint="Image will be compressed entirely in your browser." />
      ) : (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="recess rounded-xl px-4 py-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">Format</div>
              <div className="flex gap-2">
                {(["image/jpeg", "image/webp"] as Fmt[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)} className={`btn-pill !py-1 !px-3 text-xs ${format === f ? "btn-primary" : "btn-secondary"}`}>
                    {f.split("/")[1].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="recess rounded-xl px-4 py-3 sm:col-span-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
                <span>Quality</span><span className="tabular-nums">{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-primary" />
            </div>
          </div>
          {busy && <div className="text-xs text-muted-foreground font-mono">Processing…</div>}
          <BeforeAfter
            beforeUrl={URL.createObjectURL(file)}
            afterUrl={outUrl}
            beforeBytes={file.size}
            afterBytes={outBlob?.size ?? 0}
            beforeDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
            afterDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
          />
        </div>
      )}
    </ToolWorkspace>
  );
}
