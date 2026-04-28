import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Pomodoro() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => { if (!running) setSecs((phase === "work" ? workMin : breakMin) * 60); }, [workMin, breakMin, phase, running]);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSecs(s => {
        if (s > 1) return s - 1;
        // switch phase
        const next: "work" | "break" = phase === "work" ? "break" : "work";
        setPhase(next);
        if (phase === "work") setCycles(c => c + 1);
        try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play(); } catch {}
        return (next === "work" ? workMin : breakMin) * 60;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, phase, workMin, breakMin]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const total = (phase === "work" ? workMin : breakMin) * 60;
  const pct = ((total - secs) / total) * 100;

  return (
    <ToolWorkspace toolId="pomodoro">
      <div className="rounded-2xl surface-soft p-10 text-center">
        <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{phase === "work" ? "Focus" : "Break"}</div>
        <div className="mt-2 text-7xl sm:text-8xl font-semibold tabular-nums tracking-tight">{mm}:{ss}</div>
        <div className="mt-4 mx-auto max-w-md h-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full bg-foreground transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setRunning(r => !r)} className="btn-3d">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={() => { setRunning(false); setPhase("work"); setSecs(workMin * 60); }} className="btn-3d-light">
            <RotateCcw className="h-4 w-4" />Reset
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <Field label="Work minutes"><TextInput type="number" value={workMin} onChange={(e) => setWorkMin(Math.max(1, +e.target.value || 25))} /></Field>
        <Field label="Break minutes"><TextInput type="number" value={breakMin} onChange={(e) => setBreakMin(Math.max(1, +e.target.value || 5))} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Stat k="Phase" v={phase} />
        <Stat k="Cycles" v={cycles} />
        <Stat k="Status" v={running ? "Running" : "Paused"} />
      </div>
    </ToolWorkspace>
  );
}
