import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit in voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

const r = (n: number) => Math.floor(Math.random()*n);
function sentence() {
  const n = 8 + r(10);
  const words = Array.from({length:n}, () => WORDS[r(WORDS.length)]);
  words[0] = words[0][0].toUpperCase()+words[0].slice(1);
  return words.join(" ") + ".";
}
function paragraph() {
  return Array.from({length: 4 + r(4)}, sentence).join(" ");
}

export default function Lorem() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs"|"sentences"|"words">("paragraphs");
  const text = useMemo(() => {
    if (type==="paragraphs") return Array.from({length:count}, paragraph).join("\n\n");
    if (type==="sentences") return Array.from({length:count}, sentence).join(" ");
    return Array.from({length:count}, () => WORDS[r(WORDS.length)]).join(" ");
  }, [count, type, /* refresh */ Math.random()]);

  return (
    <ToolWorkspace toolId="lorem" actions={<CopyButton text={text} />}>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <Field label="Type">
            <div className="grid grid-cols-3 gap-1.5">
              {(["paragraphs","sentences","words"] as const).map(t => (
                <button key={t} onClick={()=>setType(t)} className={"text-xs px-2 py-2 rounded-md border " + (type===t?"bg-foreground text-background border-foreground":"border-white/10 hover:bg-white/[0.05]")}>{t}</button>
              ))}
            </div>
          </Field>
          <Field label={`Count: ${count}`}>
            <input type="range" min={1} max={20} value={count} onChange={e=>setCount(+e.target.value)} className="w-full accent-white" />
          </Field>
        </div>
        <pre className="rounded-lg recess p-5 text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground/90">{text}</pre>
      </div>
    </ToolWorkspace>
  );
}
