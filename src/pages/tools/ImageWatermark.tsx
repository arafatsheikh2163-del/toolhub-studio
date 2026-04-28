import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { Field, TextInput } from "@/components/tools/Field";
import { Download } from "lucide-react";

const POS = ["top-left","top-right","bottom-left","bottom-right","center"] as const;

export default function ImageWatermark() {
  const [src, setSrc] = useState<string>("");
  const [text, setText] = useState("© ToolHub");
  const [opacity, setOpacity] = useState(0.6);
  const [size, setSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [pos, setPos] = useState<typeof POS[number]>("bottom-right");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${size}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      const m = ctx.measureText(text);
      const pad = size * 0.6;
      let x = pad, y = size + pad;
      if (pos.includes("right")) x = c.width - m.width - pad;
      if (pos.includes("bottom")) y = c.height - pad;
      if (pos === "center") { x = (c.width - m.width)/2; y = c.height/2; }
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 8;
      ctx.fillText(text, x, y);
      setOut(c.toDataURL("image/png"));
    };
    img.src = src;
  }, [src, text, opacity, size, color, pos]);

  return (
    <ToolWorkspace toolId="image-watermark" actions={out && <a href={out} download="watermark.png" className="btn-3d text-xs !px-3.5 !py-1.5"><Download className="h-3.5 w-3.5" />Download</a>}>
      {!src
        ? <Dropzone onFile={(f) => { const r = new FileReader(); r.onload = () => setSrc(r.result as string); r.readAsDataURL(f); }} />
        : <>
            <div className="rounded-xl surface-soft overflow-hidden">
              <canvas ref={canvasRef} className="max-w-full h-auto block mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <Field label="Text"><TextInput value={text} onChange={(e)=>setText(e.target.value)} /></Field>
              <Field label={`Opacity · ${(opacity*100).toFixed(0)}%`}><input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e)=>setOpacity(+e.target.value)} className="w-full" /></Field>
              <Field label={`Size · ${size}px`}><input type="range" min={10} max={200} value={size} onChange={(e)=>setSize(+e.target.value)} className="w-full" /></Field>
              <Field label="Color"><input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-full h-10 rounded-md border" /></Field>
              <Field label="Position">
                <select value={pos} onChange={(e)=>setPos(e.target.value as any)} className="w-full h-10 rounded-md surface-soft border px-3 text-sm">
                  {POS.map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-3 flex items-end gap-2">
                <button onClick={() => setSrc("")} className="btn-3d-light text-xs">Choose another</button>
              </div>
            </div>
          </>
      }
    </ToolWorkspace>
  );
}
