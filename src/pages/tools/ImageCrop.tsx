import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { loadImage, canvasToBlob } from "@/lib/image";
import { downloadBlob, formatBytes } from "@/lib/format";
import { toast } from "sonner";

interface Rect { x: number; y: number; w: number; h: number; }

export default function ImageCrop() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [drag, setDrag] = useState<{ sx: number; sy: number } | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) return;
    loadImage(file).then(im => {
      setImg(im);
      // default rect: center 60%
      setRect({ x: im.naturalWidth * 0.2, y: im.naturalHeight * 0.2, w: im.naturalWidth * 0.6, h: im.naturalHeight * 0.6 });
    }).catch(() => toast.error("Could not read image"));
  }, [file]);

  // Compute display scale
  const containerW = containerRef.current?.clientWidth ?? 800;
  const scale = img ? Math.min(1, containerW / img.naturalWidth) : 1;
  const displayW = img ? img.naturalWidth * scale : 0;
  const displayH = img ? img.naturalHeight * scale : 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (!img) return;
    const target = e.currentTarget as HTMLDivElement;
    const r = target.getBoundingClientRect();
    const x = (e.clientX - r.left) / scale;
    const y = (e.clientY - r.top) / scale;
    setDrag({ sx: x, sy: y });
    setRect({ x, y, w: 0, h: 0 });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag || !img) return;
    const target = e.currentTarget as HTMLDivElement;
    const r = target.getBoundingClientRect();
    const x = (e.clientX - r.left) / scale;
    const y = (e.clientY - r.top) / scale;
    setRect({
      x: Math.max(0, Math.min(drag.sx, x)),
      y: Math.max(0, Math.min(drag.sy, y)),
      w: Math.min(Math.abs(x - drag.sx), img.naturalWidth - Math.min(drag.sx, x)),
      h: Math.min(Math.abs(y - drag.sy), img.naturalHeight - Math.min(drag.sy, y)),
    });
  };
  const onMouseUp = () => setDrag(null);

  const apply = async () => {
    if (!img || !rect || rect.w < 4 || rect.h < 4) return toast.error("Select a crop area");
    const c = document.createElement("canvas");
    c.width = Math.round(rect.w); c.height = Math.round(rect.h);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    const b = await canvasToBlob(c, file?.type || "image/png");
    setOutBlob(b);
    setOutUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(b); });
    toast.success("Cropped");
  };

  const reset = () => { setFile(null); setImg(null); setRect(null); setOutBlob(null); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); };
  const download = () => { if (outBlob && file) downloadBlob(outBlob, file.name.replace(/(\.[^.]+)?$/, `_cropped$1`)); };

  return (
    <ToolWorkspace toolId="image-crop" actions={
      <>
        <button onClick={apply} disabled={!rect} className="btn-pill btn-secondary !py-1.5">Apply Crop</button>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <button onClick={download} disabled={!outBlob} className="btn-pill btn-primary disabled:opacity-50 disabled:pointer-events-none">Download</button>
      </>
    }>
      {!file ? <Dropzone onFile={setFile} /> : (
        <div className="space-y-5">
          <div ref={containerRef} className="recess rounded-2xl p-3 overflow-hidden">
            {img && (
              <div
                className="relative mx-auto select-none"
                style={{ width: displayW, height: displayH, cursor: drag ? "crosshair" : "default" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <img src={URL.createObjectURL(file)} className="w-full h-full block pointer-events-none" alt="source" draggable={false} />
                {rect && rect.w > 0 && rect.h > 0 && (
                  <>
                    <div className="absolute inset-0 bg-black/55 pointer-events-none" style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.y * scale}px, ${rect.x * scale}px ${rect.y * scale}px, ${rect.x * scale}px ${(rect.y + rect.h) * scale}px, ${(rect.x + rect.w) * scale}px ${(rect.y + rect.h) * scale}px, ${(rect.x + rect.w) * scale}px ${rect.y * scale}px, 0 ${rect.y * scale}px)`
                    }} />
                    <div className="absolute border-2 border-primary pointer-events-none rounded-sm shadow-glow-cyan" style={{
                      left: rect.x * scale, top: rect.y * scale, width: rect.w * scale, height: rect.h * scale,
                    }} />
                  </>
                )}
              </div>
            )}
          </div>
          {rect && <div className="text-xs font-mono text-muted-foreground text-center">Selection: {Math.round(rect.w)} × {Math.round(rect.h)} px</div>}
          {outUrl && (
            <div className="recess rounded-2xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground flex justify-between">
                <span>Cropped output</span><span>{outBlob && formatBytes(outBlob.size)}</span>
              </div>
              <div className="grid place-items-center bg-black/30 p-3 max-h-80">
                <img src={outUrl} alt="cropped" className="max-h-72 max-w-full object-contain rounded-lg" />
              </div>
            </div>
          )}
        </div>
      )}
    </ToolWorkspace>
  );
}
