import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { CopyButton } from "@/components/tools/CopyButton";

function hexToRgb(hex: string) {
  const m = hex.replace("#","").match(/.{2}/g);
  if (!m || m.length<3) return { r:0, g:0, b:0 };
  return { r: parseInt(m[0],16), g: parseInt(m[1],16), b: parseInt(m[2],16) };
}
function rgbToHsl(r:number,g:number,b:number) {
  r/=255; g/=255; b/=255;
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
  let h=0,s=0; const l=(mx+mn)/2;
  if (mx!==mn) {
    const d = mx-mn;
    s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn);
    switch(mx){ case r: h=(g-b)/d+(g<b?6:0); break; case g: h=(b-r)/d+2; break; case b: h=(r-g)/d+4; break; }
    h*=60;
  }
  return { h: Math.round(h), s: Math.round(s*100), l: Math.round(l*100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#3b82f6");
  const { r,g,b } = useMemo(()=>hexToRgb(hex),[hex]);
  const { h,s,l } = useMemo(()=>rgbToHsl(r,g,b),[r,g,b]);
  const formats = {
    HEX: hex.toUpperCase(),
    RGB: `rgb(${r}, ${g}, ${b})`,
    HSL: `hsl(${h}, ${s}%, ${l}%)`,
    "Tailwind HSL": `${h} ${s}% ${l}%`,
  };
  return (
    <ToolWorkspace toolId="color-picker">
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="h-48" style={{ background: hex }} />
            <div className="p-3 bg-black/40">
              <TextInput type="color" value={hex} onChange={e=>setHex(e.target.value)} className="!h-10 !p-1" />
            </div>
          </div>
          <Field label="Hex"><TextInput value={hex} onChange={e=>setHex(e.target.value)} /></Field>
        </div>
        <div className="space-y-3">
          {Object.entries(formats).map(([k,v]) => (
            <div key={k} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground w-28">{k}</div>
              <div className="flex-1 font-mono text-sm">{v}</div>
              <CopyButton text={v} label="" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat k="R" v={r} /><Stat k="G" v={g} /><Stat k="B" v={b} />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
