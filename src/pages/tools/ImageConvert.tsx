import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { BeforeAfter } from "@/components/tools/BeforeAfter";
import { loadImage, canvasToBlob, drawImageToCanvas } from "@/lib/image";
import { downloadBlob } from "@/lib/format";
import { toast } from "sonner";

const FORMATS = [
  { id: "image/png",  label: "PNG",  ext: "png"  },
  { id: "image/jpeg", label: "JPG",  ext: "jpg"  },
  { id: "image/webp", label: "WEBP", ext: "webp" },
] as const;

export default function ImageConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<typeof FORMATS[number]>(FORMATS[0]);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    loadImage(file).then(setImg).catch(() => toast.error("Could not read image"));
  }, [file]);

  useEffect(() => {
    if (!img) return;
    const c = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
    canvasToBlob(c, format.id, 0.92).then(b => {
      setOutBlob(b);
      setOutUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(b); });
    });
  }, [img, format]);

  const reset = () => { setFile(null); setImg(null); setOutBlob(null); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); };
  const download = () => { if (outBlob && file) downloadBlob(outBlob, file.name.replace(/\.[^.]+$/, "") + "." + format.ext); };

  return (
    <ToolWorkspace toolId="image-convert" actions={
      <>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <button onClick={download} disabled={!outBlob} className="btn-pill btn-primary disabled:opacity-50 disabled:pointer-events-none">Download .{format.ext}</button>
      </>
    }>
      {!file ? <Dropzone onFile={setFile} /> : (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormat(f)} className={`btn-pill !py-1.5 !px-4 text-xs ${format.id === f.id ? "btn-primary" : "btn-secondary"}`}>
                {f.label}
              </button>
            ))}
          </div>
          <BeforeAfter
            beforeUrl={URL.createObjectURL(file)} afterUrl={outUrl}
            beforeBytes={file.size} afterBytes={outBlob?.size ?? 0}
            beforeDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
            afterDims={img ? { w: img.naturalWidth, h: img.naturalHeight } : undefined}
          />
        </div>
      )}
    </ToolWorkspace>
  );
}
