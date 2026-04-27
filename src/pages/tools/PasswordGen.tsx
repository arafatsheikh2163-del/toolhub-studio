import { useEffect, useState, useCallback } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, Stat } from "@/components/tools/Field";
import { RefreshCw } from "lucide-react";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  num:   "0123456789",
  sym:   "!@#$%^&*()-_=+[]{};:,.<>?/",
};

function randInt(max: number) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % max;
}

export default function PasswordGen() {
  const [len, setLen] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, num: true, sym: true });
  const [pwd, setPwd] = useState("");

  const gen = useCallback(() => {
    let pool = "";
    if (opts.lower) pool += SETS.lower;
    if (opts.upper) pool += SETS.upper;
    if (opts.num)   pool += SETS.num;
    if (opts.sym)   pool += SETS.sym;
    if (!pool) return setPwd("");
    let out = "";
    for (let i = 0; i < len; i++) out += pool[randInt(pool.length)];
    setPwd(out);
  }, [len, opts]);

  useEffect(() => { gen(); }, [gen]);

  // Strength estimate (rough entropy bits)
  const poolSize = (opts.lower?26:0)+(opts.upper?26:0)+(opts.num?10:0)+(opts.sym?26:0);
  const entropy = Math.round(len * Math.log2(Math.max(poolSize,1)));
  const strength = entropy < 50 ? "Weak" : entropy < 80 ? "Strong" : entropy < 120 ? "Very Strong" : "Excellent";

  return (
    <ToolWorkspace toolId="password-gen" actions={
      <button onClick={gen} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><RefreshCw className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Regenerate</span></button>
    }>
      <div className="space-y-6">
        <div className="rounded-lg recess p-5 flex items-center gap-3">
          <div className="flex-1 font-mono text-lg sm:text-xl break-all tracking-tight text-foreground">{pwd || "—"}</div>
          <CopyButton text={pwd} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat k="Length" v={len} />
          <Stat k="Entropy" v={`${entropy} bits`} />
          <Stat k="Strength" v={strength} />
        </div>

        <Field label={`Length: ${len}`}>
          <input type="range" min={6} max={64} value={len} onChange={e => setLen(+e.target.value)} className="w-full accent-white" />
        </Field>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["lower","upper","num","sym"] as const).map(k => (
            <label key={k} className="flex items-center gap-2 rounded-md border border-white/[0.10] bg-white/[0.03] px-3 py-2.5 cursor-pointer hover:bg-white/[0.06]">
              <input type="checkbox" checked={opts[k]} onChange={e => setOpts(o => ({ ...o, [k]: e.target.checked }))} className="accent-white" />
              <span className="text-sm capitalize">{k === "num" ? "Numbers" : k === "sym" ? "Symbols" : k + "case"}</span>
            </label>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
