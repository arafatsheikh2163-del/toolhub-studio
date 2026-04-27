import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { BeforeAfter } from "@/components/tools/BeforeAfter";
import { loadImage, canvasToBlob, drawImageToCanvas } from "@/lib/image";
import { downloadBlob } from "@/lib/format";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

export default function ImageResize() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    loadImage(file).then(im => {
      setImg(im); setW(im.naturalWidth); setH(im.naturalHeight);
    }).catch(() => toast.error("Could not read image"));
  }, [file]);

  useEffect(() => {
    if (!img || !w || !h) return;
    const c = drawImageToCanvas(img, w, h);
    canvasToBlob(c, file?.type || "image/png").then(blob => {
      setOutBlob(blob);
      setOutUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
    });
  }, [img, w, h, file]);

  const onW = (val: number) => {
    setW(val);
    if (lock && img) setH(Math.round(val * (img.naturalHeight / img.naturalWidth)));
  };
  const onH = (val: number) => {
    setH(val);
    if (lock && img) setW(Math.round(val * (img.naturalWidth / img.naturalHeight)));
  };

  const reset = () => { setFile(null); setImg(null); setOutBlob(null); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); };
  const download = () => { if (outBlob && file) downloadBlob(outBlob, file.name.replace(/(\.[^.]+)?$/, `_${w}x${h}$1`)); };

  return (
    <ToolWorkspace toolId="image-resize" actions={
      <>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <button onClick={download} disabled={!outBlob} className="btn-pill btn-primary disabled:opacity-50 disabled:pointer-events-none">Download</button>
      </>
    }>
      {!file ? (
        <Dropzone onFile={setFile} />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">Width</div>
              <input type="number" value={w} onChange={(e) => onW(parseInt(e.target.value) || 0)}
                className="w-28 recess rounded-xl px-3 py-2 text-sm font-mono outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <button onClick={() => setLock(l => !l)} className="btn-pill btn-secondary !py-2" title={lock ? "Unlock ratio" : "Lock ratio"}>
              {lock ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">Height</div>
              <input type="number" value={h} onChange={(e) => onH(parseInt(e.target.value) || 0)}
                className="w-28 recess rounded-xl px-3 py-2 text-sm font-mono outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div className="flex gap-2 ml-auto">
              {[0.25, 0.5, 0.75].map(s => (
                <button key={s} onClick={() => { if (img) { setW(Math.round(img.naturalWidth * s)); setH(Math.round(img.naturalHeight * s)); } }}
                  className="btn-pill btn-secondary !py-1.5 !px-3 text-xs">{Math.round(s * 100)}%</button>
              ))}
            </div>
          </div>
          <BeforeAfter
            beforeUrl={URL.createObjectURL(file)} afterUrl={outUrl}
            beforeBytes={file.size} afterBytes={outBlob?.size ?? 0}
            beforeDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
            afterDims={{ w, h }}
          />
        </div>
      )}
    </ToolWorkspace>
  );
}
