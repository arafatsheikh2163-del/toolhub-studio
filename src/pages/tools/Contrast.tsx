import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";

function lum(hex: string) {
  const m = hex.replace("#","").match(/.{2}/g);
  if (!m) return 0;
  const [r,g,b] = m.map(h => {
    const c = parseInt(h,16)/255;
    return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  });
  return 0.2126*r + 0.7152*g + 0.0722*b;
}
function ratio(a: string, b: string) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05);
}

export default function Contrast() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#0f172a");
  const r = useMemo(()=>ratio(fg,bg),[fg,bg]);
  const grade = (req: number) => r >= req ? "Pass" : "Fail";
  return (
    <ToolWorkspace toolId="contrast">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          <Field label="Foreground"><TextInput type="color" value={fg} onChange={e=>setFg(e.target.value)} className="!h-12 !p-1" /></Field>
          <Field label="Background"><TextInput type="color" value={bg} onChange={e=>setBg(e.target.value)} className="!h-12 !p-1" /></Field>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg p-8" style={{ background: bg, color: fg }}>
            <div className="text-3xl font-medium mb-2">The quick brown fox jumps over.</div>
            <div className="text-sm">Smaller body text — testing readability at this contrast.</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat k="Ratio" v={r.toFixed(2)+":1"} />
            <Stat k="AA Normal (4.5)" v={grade(4.5)} />
            <Stat k="AA Large (3)" v={grade(3)} />
            <Stat k="AAA Normal (7)" v={grade(7)} />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
