import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

export default function GlassUi() {
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(0.1);
  const [border, setBorder] = useState(0.18);
  const [radius, setRadius] = useState(16);
  const [tint, setTint] = useState("#ffffff");
  const css = `background: rgba(255,255,255,${opacity});\nbackdrop-filter: blur(${blur}px) saturate(160%);\n-webkit-backdrop-filter: blur(${blur}px) saturate(160%);\nborder: 1px solid rgba(255,255,255,${border});\nborder-radius: ${radius}px;`;
  return (
    <ToolWorkspace toolId="glass-ui" actions={<CopyButton text={css} label="Copy CSS" />}>
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-3">
          <Field label={`Blur: ${blur}px`}><input type="range" min={0} max={60} value={blur} onChange={e=>setBlur(+e.target.value)} className="w-full accent-white" /></Field>
          <Field label={`Opacity: ${opacity.toFixed(2)}`}><input type="range" min={0} max={1} step={0.01} value={opacity} onChange={e=>setOpacity(+e.target.value)} className="w-full accent-white" /></Field>
          <Field label={`Border: ${border.toFixed(2)}`}><input type="range" min={0} max={1} step={0.01} value={border} onChange={e=>setBorder(+e.target.value)} className="w-full accent-white" /></Field>
          <Field label={`Radius: ${radius}px`}><input type="range" min={0} max={48} value={radius} onChange={e=>setRadius(+e.target.value)} className="w-full accent-white" /></Field>
          <Field label="Backdrop tint"><TextInput type="color" value={tint} onChange={e=>setTint(e.target.value)} className="!h-10 !p-1" /></Field>
        </div>
        <div className="rounded-lg p-8 min-h-[420px] grid place-items-center" style={{
          background: `linear-gradient(135deg, ${tint}, #000)`,
        }}>
          <div className="p-8 max-w-sm" style={{
            background: `rgba(255,255,255,${opacity})`,
            backdropFilter: `blur(${blur}px) saturate(160%)`,
            border: `1px solid rgba(255,255,255,${border})`,
            borderRadius: radius,
          }}>
            <div className="text-lg font-medium text-white">Glass Panel</div>
            <div className="text-sm text-white/70 mt-1">Tune the controls and copy the CSS.</div>
          </div>
        </div>
      </div>
      <pre className="mt-4 rounded-md bg-black/40 border border-white/10 p-3 text-xs font-mono whitespace-pre-wrap">{css}</pre>
    </ToolWorkspace>
  );
}
