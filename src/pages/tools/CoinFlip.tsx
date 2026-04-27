import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";

export default function CoinFlip() {
  const [side, setSide] = useState<"H"|"T"|null>(null);
  const [stats, setStats] = useState({ H: 0, T: 0 });
  const [spin, setSpin] = useState(false);
  const flip = () => {
    setSpin(true);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "H" : "T";
      setSide(r);
      setStats(s => ({ ...s, [r]: s[r] + 1 }));
      setSpin(false);
    }, 700);
  };
  return (
    <ToolWorkspace toolId="coin-flip">
      <div className="grid place-items-center gap-6 py-6">
        <button onClick={flip} disabled={spin} className="relative h-40 w-40 rounded-full icon-tile-3d-light grid place-items-center text-5xl font-bold tabular-nums text-background transition-transform hover:scale-105"
          style={{ transform: spin ? "rotateY(720deg) scale(0.95)" : "rotateY(0deg)", transition: "transform 0.7s cubic-bezier(.5,.1,.3,1)" }}>
          <span className="relative z-10">{side ?? "?"}</span>
        </button>
        <button onClick={flip} disabled={spin} className="btn-3d text-sm">Flip Coin</button>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <div className="rounded-md bg-white/[0.04] border border-white/10 p-3 text-center"><div className="text-xs text-muted-foreground">Heads</div><div className="text-2xl font-medium tabular-nums">{stats.H}</div></div>
          <div className="rounded-md bg-white/[0.04] border border-white/10 p-3 text-center"><div className="text-xs text-muted-foreground">Tails</div><div className="text-2xl font-medium tabular-nums">{stats.T}</div></div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
