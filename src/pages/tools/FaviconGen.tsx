import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput } from "@/components/tools/Field";
import { downloadBlob } from "@/lib/format";

export default function FaviconGen() {
  const [text, setText] = useState("L");
  const [bg, setBg] = useState("#000000");
  const [fg, setFg] = useState("#ffffff");
  const [round, setRound] = useState(20);
  const sizes = [16, 32, 64, 128, 256];
  const refs = sizes.map(() => useRef<HTMLCanvasElement>(null));

  useEffect(() => {
    sizes.forEach((s, i) => {
      const c = refs[i].current; if (!c) return;
      c.width = c.height = s;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0,0,s,s);
      const r = (round/100) * (s/2);
      ctx.fillStyle = bg;
      ctx.beginPath();
      // rounded rect
      ctx.moveTo(r,0); ctx.lineTo(s-r,0); ctx.quadraticCurveTo(s,0,s,r);
      ctx.lineTo(s,s-r); ctx.quadraticCurveTo(s,s,s-r,s);
      ctx.lineTo(r,s); ctx.quadraticCurveTo(0,s,0,s-r);
      ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = `600 ${s*0.6}px Geist, system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text || "?", s/2, s/2 + s*0.04);
    });
  }, [text, bg, fg, round]);

  const dl = (i: number) => refs[i].current?.toBlob(b => b && downloadBlob(b, `favicon-${sizes[i]}.png`));
  return (
    <ToolWorkspace toolId="favicon-gen">
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-3">
          <Field label="Text (1–3 chars)"><TextInput maxLength={3} value={text} onChange={e=>setText(e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Background"><TextInput type="color" value={bg} onChange={e=>setBg(e.target.value)} className="!h-10 !p-1" /></Field>
            <Field label="Foreground"><TextInput type="color" value={fg} onChange={e=>setFg(e.target.value)} className="!h-10 !p-1" /></Field>
          </div>
          <Field label={`Roundness: ${round}%`}>
            <input type="range" min={0} max={50} value={round} onChange={e=>setRound(+e.target.value)} className="w-full accent-white" />
          </Field>
        </div>
        <div className="rounded-lg recess p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sizes.map((s, i) => (
            <div key={s} className="text-center space-y-2">
              <canvas ref={refs[i]} className="mx-auto" style={{ width: Math.min(s,128), height: Math.min(s,128), imageRendering: s<=32?"pixelated":"auto" }} />
              <button onClick={()=>dl(i)} className="btn-3d-dark text-[11px] !px-3 !py-1"><span className="relative z-10">{s}×{s}</span></button>
            </div>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
