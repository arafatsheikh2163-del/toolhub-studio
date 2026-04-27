import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { Field } from "@/components/tools/Field";
import { downloadBlob } from "@/lib/format";
import { Download } from "lucide-react";

export default function WandCleanup() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [b, setB] = useState(10); // brightness adjust %
  const [c, setC] = useState(15); // contrast adjust %

  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setSrc(url);
    process(url, b, c);
  };

  const process = (url: string, brightness: number, contrast: number) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext("2d")!;
      ctx.filter = `brightness(${100+brightness}%) contrast(${100+contrast}%)`;
      ctx.drawImage(img, 0, 0);
      cv.toBlob(blob => { if (blob) setOut(URL.createObjectURL(blob)); }, "image/jpeg", 0.92);
    };
    img.src = url;
  };

  const reapply = (nb: number, nc: number) => { setB(nb); setC(nc); if (src) process(src, nb, nc); };

  return (
    <ToolWorkspace toolId="wand-cleanup" actions={out?
      <button onClick={()=>fetch(out).then(r=>r.blob()).then(b=>downloadBlob(b,"cleaned.jpg"))} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><Download className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Download</span></button>:null}>
      {!src ? <Dropzone onFiles={onFiles} accept="image/*" /> : (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label={`Brightness +${b}%`}><input type="range" min={-50} max={50} value={b} onChange={e=>reapply(+e.target.value,c)} className="w-full accent-white" /></Field>
            <Field label={`Contrast +${c}%`}><input type="range" min={-50} max={50} value={c} onChange={e=>reapply(b,+e.target.value)} className="w-full accent-white" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Original</div><img src={src} className="w-full rounded-md border border-white/10" /></div>
            <div><div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Cleaned (metadata stripped)</div><img src={out} className="w-full rounded-md border border-white/10" /></div>
          </div>
          <button onClick={()=>{setSrc("");setOut("");}} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><span className="relative z-10">Reset</span></button>
        </div>
      )}
    </ToolWorkspace>
  );
}
