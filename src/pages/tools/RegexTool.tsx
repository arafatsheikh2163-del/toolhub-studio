import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea, TextInput, Stat } from "@/components/tools/Field";

export default function RegexTool() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+)\\.(\\w+)\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact alice@example.com or bob@lovable.dev for details.");
  const { matches, error, html } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.includes("g")?flags:flags+"g");
      const m: RegExpExecArray[] = [];
      let r; while ((r = re.exec(text)) !== null) { m.push(r); if (r.index === re.lastIndex) re.lastIndex++; }
      const html = text.replace(new RegExp(pattern, flags.includes("g")?flags:flags+"g"), (s) => `<mark class="bg-foreground text-background px-0.5 rounded-sm">${s}</mark>`);
      return { matches: m, error: "", html };
    } catch (e:any) { return { matches: [] as RegExpExecArray[], error: e.message, html: text }; }
  }, [pattern, flags, text]);
  return (
    <ToolWorkspace toolId="regex">
      <div className="space-y-4">
        <div className="grid md:grid-cols-[1fr_120px] gap-3">
          <Field label="Pattern"><TextInput value={pattern} onChange={e=>setPattern(e.target.value)} /></Field>
          <Field label="Flags"><TextInput value={flags} onChange={e=>setFlags(e.target.value.replace(/[^gimsuy]/g,""))} /></Field>
        </div>
        {error && <div className="text-xs text-destructive font-mono px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30">{error}</div>}
        <Field label="Test text"><TextArea rows={6} value={text} onChange={e=>setText(e.target.value)} /></Field>
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Highlights</div>
          <div className="rounded-md bg-black/40 border border-white/10 p-4 font-mono text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{__html:html}} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <Stat k="Matches" v={matches.length} />
          <Stat k="Groups" v={matches[0]?matches[0].length-1:0} />
          <Stat k="First" v={matches[0]?.[0] || "—"} />
        </div>
      </div>
    </ToolWorkspace>
  );
}
