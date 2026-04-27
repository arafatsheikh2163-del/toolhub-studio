import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

export default function PaletteLab() {
  const [base, setBase] = useState(220);
  const shades = useMemo(() => [50,100,200,300,400,500,600,700,800,900,950].map((s, i) => {
    const l = 98 - i*8;
    return { name: s, color: `hsl(${base} 70% ${Math.max(6,l)}%)` };
  }), [base]);
  const css = shades.map(s => `--c-${s.name}: ${s.color};`).join("\n");
  return (
    <ToolWorkspace toolId="palette-lab" actions={<CopyButton text={css} label="Copy CSS" />}>
      <Field label={`Base hue: ${base}°`}>
        <input type="range" min={0} max={360} value={base} onChange={e=>setBase(+e.target.value)} className="w-full accent-white" />
      </Field>
      <div className="mt-4 grid grid-cols-6 sm:grid-cols-11 gap-1">
        {shades.map(s => (
          <div key={s.name} className="rounded-md overflow-hidden border border-white/10">
            <div className="h-20" style={{ background: s.color }} />
            <div className="text-[10px] font-mono text-center py-1.5 bg-black/40">{s.name}</div>
          </div>
        ))}
      </div>
      <pre className="mt-4 rounded-md bg-black/40 border border-white/10 p-3 text-xs font-mono whitespace-pre">{css}</pre>
    </ToolWorkspace>
  );
}
