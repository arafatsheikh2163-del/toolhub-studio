import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput } from "@/components/tools/Field";

const UNITS: Record<string, Record<string, number>> = {
  Length:    { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  Weight:    { g: 1, kg: 1000, mg: 0.001, lb: 453.592, oz: 28.3495, ton: 1_000_000 },
  Data:      { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 },
  Time:      { s: 1, ms: 0.001, min: 60, h: 3600, day: 86400, week: 604800 },
  Speed:     { "m/s": 1, "km/h": 1/3.6, "mph": 0.44704, "knot": 0.514444 },
};

export default function UnitConvert() {
  const [cat, setCat] = useState("Length");
  const units = Object.keys(UNITS[cat]);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1] || units[0]);
  const [val, setVal] = useState("1");

  const out = useMemo(() => {
    const v = parseFloat(val); if (isNaN(v)) return "";
    if (cat === "Temperature") return ""; // handled below
    const base = v * UNITS[cat][from];
    const r = base / UNITS[cat][to];
    return r.toLocaleString(undefined, { maximumFractionDigits: 8 });
  }, [val, from, to, cat]);

  // Temperature special-case
  const tempCats = { C: 1, F: 1, K: 1 };
  const isTemp = cat === "Temperature";
  const tempOut = useMemo(() => {
    if (!isTemp) return "";
    const v = parseFloat(val); if (isNaN(v)) return "";
    let c = v;
    if (from==="F") c = (v-32)*5/9; else if (from==="K") c = v-273.15;
    if (to==="F") return ((c*9/5)+32).toFixed(2);
    if (to==="K") return (c+273.15).toFixed(2);
    return c.toFixed(2);
  }, [val, from, to, isTemp]);

  const cats = ["Length","Weight","Data","Time","Speed","Temperature"];
  const currentUnits = isTemp ? Object.keys(tempCats) : units;

  const setCatSafe = (c: string) => {
    setCat(c);
    const u = c==="Temperature"?Object.keys(tempCats):Object.keys(UNITS[c]);
    setFrom(u[0]); setTo(u[1]||u[0]);
  };

  return (
    <ToolWorkspace toolId="unit-convert">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-1.5">
          {cats.map(c => (
            <button key={c} onClick={()=>setCatSafe(c)} className={"text-xs px-3 py-1.5 rounded-md border "+(cat===c?"bg-foreground text-background border-foreground":"border-white/10 hover:bg-white/[0.05]")}>{c}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-end gap-4">
          <div className="space-y-2">
            <Field label="From"><TextInput type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
            <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full h-10 rounded-md bg-black/40 border border-white/10 px-3 text-sm font-mono">
              {currentUnits.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="text-2xl text-muted-foreground self-center pb-7">→</div>
          <div className="space-y-2">
            <Field label="To"><TextInput readOnly value={isTemp?tempOut:out} /></Field>
            <select value={to} onChange={e=>setTo(e.target.value)} className="w-full h-10 rounded-md bg-black/40 border border-white/10 px-3 text-sm font-mono">
              {currentUnits.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
