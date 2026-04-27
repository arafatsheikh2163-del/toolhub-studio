import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

const ALGOS = ["SHA-1","SHA-256","SHA-384","SHA-512"] as const;

async function hash(text: string, algo: string) {
  const buf = new TextEncoder().encode(text);
  const out = await crypto.subtle.digest(algo, buf);
  return [...new Uint8Array(out)].map(b => b.toString(16).padStart(2,"0")).join("");
}

export default function Hash() {
  const [text, setText] = useState("hello world");
  const [hashes, setHashes] = useState<Record<string,string>>({});
  useEffect(() => {
    Promise.all(ALGOS.map(async a => [a, await hash(text, a)] as const))
      .then(arr => setHashes(Object.fromEntries(arr)));
  }, [text]);
  return (
    <ToolWorkspace toolId="hash">
      <div className="space-y-4">
        <Field label="Input"><TextArea rows={4} value={text} onChange={e=>setText(e.target.value)} /></Field>
        <div className="space-y-2">
          {ALGOS.map(a => (
            <div key={a} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground w-20">{a}</div>
              <div className="flex-1 font-mono text-xs break-all">{hashes[a] || "…"}</div>
              {hashes[a] && <CopyButton text={hashes[a]} label="" />}
            </div>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
