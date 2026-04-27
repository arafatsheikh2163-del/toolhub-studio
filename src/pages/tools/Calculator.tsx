import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";

export default function Calculator() {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<{e:string,r:string}[]>([]);
  const safeEval = (e: string) => {
    if (!/^[\d+\-*/().% \t\nMath.sqrtsincoetalpgxyz,!^]*$/.test(e)) throw new Error("Invalid");
    // eslint-disable-next-line no-new-func
    return Function("Math", `"use strict"; return (${e.replace(/\^/g,"**")});`)(Math);
  };
  const calc = () => {
    try {
      const r = String(safeEval(expr));
      setHistory(h => [{e:expr, r}, ...h].slice(0,12));
      setExpr(r);
    } catch { setExpr("Error"); }
  };
  const press = (k: string) => {
    if (k==="=") return calc();
    if (k==="C") return setExpr("");
    if (k==="⌫") return setExpr(s => s.slice(0,-1));
    setExpr(s => s + k);
  };
  const keys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","%","+","(",")","^","="];
  return (
    <ToolWorkspace toolId="calculator">
      <div className="grid md:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <input value={expr} onChange={e=>setExpr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calc()} className="w-full h-16 rounded-lg recess px-4 text-2xl font-mono text-right" placeholder="Type or click…" />
          <div className="grid grid-cols-4 gap-2">
            <button onClick={()=>press("C")} className="btn-3d-dark !rounded-lg !py-3">C</button>
            <button onClick={()=>press("⌫")} className="btn-3d-dark !rounded-lg !py-3">⌫</button>
            <button onClick={()=>press("Math.sqrt(")} className="btn-3d-dark !rounded-lg !py-3 text-xs">√</button>
            <button onClick={()=>press("Math.PI")} className="btn-3d-dark !rounded-lg !py-3 text-xs">π</button>
            {keys.map(k => (
              <button key={k} onClick={()=>press(k)} className={(k==="="?"btn-3d":"btn-3d-dark")+" !rounded-lg !py-3 text-base"}>{k}</button>
            ))}
          </div>
        </div>
        <div className="rounded-lg recess p-3 max-h-[420px] overflow-auto">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2 px-2">History</div>
          {history.length===0 && <div className="text-xs text-muted-foreground px-2">No calculations yet.</div>}
          {history.map((h,i)=>(
            <button key={i} onClick={()=>setExpr(h.r)} className="block w-full text-left px-2 py-1.5 rounded-md hover:bg-white/[0.05] font-mono text-xs">
              <div className="text-muted-foreground truncate">{h.e}</div>
              <div className="text-foreground tabular-nums">= {h.r}</div>
            </button>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
