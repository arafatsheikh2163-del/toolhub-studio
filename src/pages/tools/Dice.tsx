import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput } from "@/components/tools/Field";
import { Dice5 } from "lucide-react";

export default function Dice() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(2);
  const [rolls, setRolls] = useState<number[]>([]);
  const roll = () => setRolls(Array.from({length:count}, () => 1 + Math.floor(Math.random()*sides)));
  const total = rolls.reduce((a,b)=>a+b,0);
  return (
    <ToolWorkspace toolId="dice" actions={
      <button onClick={roll} className="btn-3d text-xs !px-3.5 !py-1.5"><Dice5 className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Roll</span></button>
    }>
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <Field label="Sides (d4–d100)"><TextInput type="number" min={2} max={100} value={sides} onChange={e=>setSides(+e.target.value)} /></Field>
        <Field label="Number of dice"><TextInput type="number" min={1} max={20} value={count} onChange={e=>setCount(+e.target.value)} /></Field>
      </div>
      <div className="rounded-lg recess p-6 min-h-[180px] flex flex-wrap items-center justify-center gap-3">
        {rolls.length === 0 ? <span className="text-sm text-muted-foreground">Roll the dice.</span> :
          rolls.map((r,i)=>(
            <div key={i} className="icon-tile-3d-light h-20 w-20 grid place-items-center text-3xl font-bold tabular-nums text-background">
              <span className="relative z-10">{r}</span>
            </div>
          ))}
      </div>
      {rolls.length>0 && <div className="mt-4 text-center text-sm text-muted-foreground">Total: <span className="font-mono text-foreground tabular-nums">{total}</span></div>}
    </ToolWorkspace>
  );
}
