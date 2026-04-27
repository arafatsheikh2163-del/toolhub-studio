import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { BeforeAfter } from "@/components/tools/BeforeAfter";
import { loadImage, canvasToBlob } from "@/lib/image";
import { downloadBlob } from "@/lib/format";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { toast } from "sonner";

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    loadImage(file).then(setImg).catch(() => toast.error("Could not read image"));
  }, [file]);

  useEffect(() => {
    if (!img) return;
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
    const w = img.naturalWidth * cos + img.naturalHeight * sin;
    const h = img.naturalWidth * sin + img.naturalHeight * cos;
    const c = document.createElement("canvas");
    c.width = Math.round(w); c.height = Math.round(h);
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    canvasToBlob(c, file?.type || "image/png").then(b => {
      setOutBlob(b);
      setOutUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(b); });
    });
  }, [img, angle, flipX, flipY, file]);

  const reset = () => { setFile(null); setImg(null); setOutBlob(null); setAngle(0); setFlipX(false); setFlipY(false); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); };
  const download = () => { if (outBlob && file) downloadBlob(outBlob, file.name.replace(/(\.[^.]+)?$/, `_rotated$1`)); };

  return (
    <ToolWorkspace toolId="image-rotate" actions={
      <>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <button onClick={download} disabled={!outBlob} className="btn-pill btn-primary disabled:opacity-50 disabled:pointer-events-none">Download</button>
      </>
    }>
      {!file ? <Dropzone onFile={setFile} /> : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setAngle(a => a - 90)} className="btn-pill btn-secondary !py-1.5"><RotateCcw className="h-3.5 w-3.5" />-90°</button>
            <button onClick={() => setAngle(a => a + 90)} className="btn-pill btn-secondary !py-1.5"><RotateCw className="h-3.5 w-3.5" />+90°</button>
            <button onClick={() => setFlipX(v => !v)} className={`btn-pill !py-1.5 ${flipX ? "btn-primary" : "btn-secondary"}`}><FlipHorizontal className="h-3.5 w-3.5" />Flip X</button>
            <button onClick={() => setFlipY(v => !v)} className={`btn-pill !py-1.5 ${flipY ? "btn-primary" : "btn-secondary"}`}><FlipVertical className="h-3.5 w-3.5" />Flip Y</button>
            <div className="recess rounded-xl px-4 py-2 flex items-center gap-3 ml-auto">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">Angle</span>
              <input type="range" min={-180} max={180} value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="accent-primary w-44" />
              <span className="text-xs font-mono tabular-nums w-10 text-right">{angle}°</span>
            </div>
          </div>
          <BeforeAfter
            beforeUrl={URL.createObjectURL(file)} afterUrl={outUrl}
            beforeBytes={file.size} afterBytes={outBlob?.size ?? 0}
            beforeDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
          />
        </div>
      )}
    </ToolWorkspace>
  );
}
