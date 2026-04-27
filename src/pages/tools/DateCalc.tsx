import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";

export default function DateCalc() {
  const today = new Date().toISOString().slice(0,10);
  const [a, setA] = useState(today);
  const [b, setB] = useState(today);
  const [add, setAdd] = useState(0);
  const diff = useMemo(() => {
    const d1 = new Date(a), d2 = new Date(b);
    return Math.round((d2.getTime()-d1.getTime())/(1000*60*60*24));
  }, [a,b]);
  const result = useMemo(() => {
    const d = new Date(a); d.setDate(d.getDate()+add);
    return d.toISOString().slice(0,10);
  }, [a,add]);
  return (
    <ToolWorkspace toolId="date-calc">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Difference between dates</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="From"><TextInput type="date" value={a} onChange={e=>setA(e.target.value)} /></Field>
            <Field label="To"><TextInput type="date" value={b} onChange={e=>setB(e.target.value)} /></Field>
            <Stat k="Days" v={diff} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Add / subtract days</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Date"><TextInput type="date" value={a} onChange={e=>setA(e.target.value)} /></Field>
            <Field label="Days (negative to subtract)"><TextInput type="number" value={add} onChange={e=>setAdd(+e.target.value)} /></Field>
            <Stat k="Result" v={result} />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
