import { formatBytes } from "@/lib/format";

interface Props {
  beforeUrl: string;
  afterUrl: string;
  beforeBytes: number;
  afterBytes: number;
  beforeDims?: { w: number; h: number };
  afterDims?: { w: number; h: number };
}

export function BeforeAfter({ beforeUrl, afterUrl, beforeBytes, afterBytes, beforeDims, afterDims }: Props) {
  const ratio = beforeBytes > 0 ? Math.round(((beforeBytes - afterBytes) / beforeBytes) * 100) : 0;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { label: "Original", url: beforeUrl, bytes: beforeBytes, dims: beforeDims },
        { label: "Result",   url: afterUrl,  bytes: afterBytes,  dims: afterDims },
      ].map((p) => (
        <div key={p.label} className="recess rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">{p.label}</span>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {p.dims ? `${p.dims.w}×${p.dims.h} · ` : ""}{formatBytes(p.bytes)}
            </span>
          </div>
          <div className="h-64 grid place-items-center bg-black/30 p-2">
            {p.url ? <img src={p.url} alt={p.label} className="max-h-full max-w-full object-contain rounded-lg" /> : <span className="text-xs text-muted-foreground">—</span>}
          </div>
        </div>
      ))}
      {ratio !== 0 && (
        <div className="sm:col-span-2 text-center text-xs font-mono text-primary">
          {ratio > 0 ? `↓ ${ratio}% smaller` : `↑ ${Math.abs(ratio)}% larger`}
        </div>
      )}
    </div>
  );
}
