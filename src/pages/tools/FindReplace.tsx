import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea, TextInput, Stat } from "@/components/tools/Field";
import { Plus, Trash2 } from "lucide-react";

interface Rule { id: string; find: string; replace: string; regex: boolean; flags: string; }

export default function FindReplace() {
  const [text, setText] = useState("Hello world. Hello universe. Hello everyone.");
  const [rules, setRules] = useState<Rule[]>([{ id: crypto.randomUUID(), find: "Hello", replace: "Hi", regex: false, flags: "g" }]);

  const output = useMemo(() => {
    let out = text;
    for (const r of rules) {
      if (!r.find) continue;
      try {
        if (r.regex) out = out.replace(new RegExp(r.find, r.flags || "g"), r.replace);
        else out = out.split(r.find).join(r.replace);
      } catch {/* ignore */}
    }
    return out;
  }, [text, rules]);

  const matches = useMemo(() => {
    let n = 0;
    for (const r of rules) {
      if (!r.find) continue;
      try {
        const re = r.regex ? new RegExp(r.find, (r.flags || "g").includes("g") ? r.flags : r.flags + "g") : new RegExp(r.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        n += (text.match(re) || []).length;
      } catch {}
    }
    return n;
  }, [text, rules]);

  const update = (id: string, patch: Partial<Rule>) => setRules(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  const remove = (id: string) => setRules(rs => rs.filter(r => r.id !== id));
  const add = () => setRules(rs => [...rs, { id: crypto.randomUUID(), find: "", replace: "", regex: false, flags: "g" }]);

  return (
    <ToolWorkspace toolId="find-replace" actions={<CopyButton text={output} />}>
      <div className="grid lg:grid-cols-2 gap-5">
        <Field label="Source"><TextArea rows={14} value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <Field label="Result"><TextArea rows={14} value={output} readOnly /></Field>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
        <Stat k="Rules" v={rules.length} />
        <Stat k="Matches" v={matches} />
        <Stat k="Source chars" v={text.length} />
        <Stat k="Output chars" v={output.length} />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Rules</div>
          <button onClick={add} className="btn-3d-light text-xs !px-3 !py-1.5"><Plus className="h-3.5 w-3.5" />Add rule</button>
        </div>
        {rules.map(r => (
          <div key={r.id} className="grid grid-cols-12 gap-2 items-center surface-soft rounded-lg p-2.5">
            <TextInput placeholder="Find" value={r.find} onChange={(e) => update(r.id, { find: e.target.value })} className="col-span-4" />
            <TextInput placeholder="Replace" value={r.replace} onChange={(e) => update(r.id, { replace: e.target.value })} className="col-span-4" />
            <label className="col-span-2 flex items-center gap-2 text-xs">
              <input type="checkbox" checked={r.regex} onChange={(e) => update(r.id, { regex: e.target.checked })} /> Regex
            </label>
            <TextInput placeholder="flags" value={r.flags} onChange={(e) => update(r.id, { flags: e.target.value })} className="col-span-1" disabled={!r.regex} />
            <button onClick={() => remove(r.id)} className="col-span-1 h-9 grid place-items-center rounded-md hover:bg-foreground/5"><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
    </ToolWorkspace>
  );
}
