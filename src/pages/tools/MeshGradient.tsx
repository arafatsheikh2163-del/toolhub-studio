import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { RefreshCw } from "lucide-react";

const rand = () => Math.floor(Math.random()*360);
function gen(n=4) {
  return Array.from({length:n}, () => ({
    x: Math.floor(Math.random()*100),
    y: Math.floor(Math.random()*100),
    h: rand(),
    s: 60 + Math.floor(Math.random()*30),
    l: 40 + Math.floor(Math.random()*30),
  }));
}

export default function MeshGradient() {
  const [seed, setSeed] = useState(0);
  const blobs = useMemo(()=>gen(5),[seed]);
  const css = `background-color: hsl(${blobs[0].h} 60% 12%);\nbackground-image: ${blobs.map(b=>`radial-gradient(at ${b.x}% ${b.y}%, hsl(${b.h} ${b.s}% ${b.l}%) 0px, transparent 50%)`).join(",\n  ")};`;
  return (
    <ToolWorkspace toolId="mesh-gradient" actions={
      <>
        <button onClick={()=>setSeed(s=>s+1)} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><RefreshCw className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Randomize</span></button>
        <CopyButton text={css} label="Copy CSS" />
      </>
    }>
      <div className="rounded-lg overflow-hidden border border-white/10 h-[420px]" style={{
        backgroundColor: `hsl(${blobs[0].h} 60% 12%)`,
        backgroundImage: blobs.map(b=>`radial-gradient(at ${b.x}% ${b.y}%, hsl(${b.h} ${b.s}% ${b.l}%) 0px, transparent 50%)`).join(", "),
      }} />
      <pre className="mt-4 rounded-md bg-black/40 border border-white/10 p-3 text-xs font-mono whitespace-pre-wrap">{css}</pre>
    </ToolWorkspace>
  );
}
