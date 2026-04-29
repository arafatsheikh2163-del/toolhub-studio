import { useMemo, useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Play, Download, Trash2 } from "lucide-react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput, TextArea, Stat } from "@/components/tools/Field";
import { SIMPLE_TOOLS_INDEX } from "@/data/simpleTools";
import type { RunResult } from "@/data/simpleToolTypes";
import { cn } from "@/lib/utils";

export default function SimpleToolPage() {
  const { id } = useParams<{ id: string }>();
  const def = id ? SIMPLE_TOOLS_INDEX[id] : undefined;

  const initial = useMemo(() => {
    const v: Record<string, any> = {};
    def?.fields.forEach(f => { v[f.key] = f.default ?? (f.type === "checkbox" ? false : f.type === "number" || f.type === "slider" ? (f.min ?? 0) : ""); });
    return v;
  }, [def]);

  const [values, setValues] = useState<Record<string, any>>(initial);
  const [results, setResults] = useState<RunResult[]>([]);

  useEffect(() => { setValues(initial); setResults([]); }, [initial]);

  const live = def?.live !== false;

  const execute = () => {
    if (!def) return;
    try {
      const out = def.run(values);
      setResults(Array.isArray(out) ? out : [out]);
    } catch (e: any) {
      setResults([{ type: "error", message: e?.message ?? "Something went wrong" }]);
    }
  };

  useEffect(() => {
    if (!def || !live) return;
    const t = setTimeout(execute, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, def]);

  if (!def) return <Navigate to="/" replace />;

  const visibleFields = def.fields.filter(f => !f.when || f.when(values));
  const setVal = (k: string, v: any) => setValues(prev => ({ ...prev, [k]: v }));

  // Detect a primary "textarea" field to give it full width
  const mainField = visibleFields.find(f => f.type === "textarea");
  const sideFields = visibleFields.filter(f => f !== mainField);

  const firstText = results.find(r => r.type === "text") as Extract<RunResult, { type: "text" }> | undefined;

  return (
    <ToolWorkspace
      toolId={def.id}
      actions={
        <>
          {!live && (
            <button onClick={execute} className="btn-3d text-xs !px-4 !py-2">
              <Play className="h-3.5 w-3.5" /> {def.runLabel ?? "Run"}
            </button>
          )}
          {firstText?.value && (
            <CopyButton text={firstText.value} className="!btn-3d-light" />
          )}
          <button
            onClick={() => setValues(initial)}
            className="btn-3d-light text-xs !px-3.5 !py-2"
            title="Reset"
          >
            <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reset</span>
          </button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* INPUTS */}
        <div className="space-y-4 min-w-0">
          {mainField && (
            <Field key={mainField.key} label={mainField.label} hint={mainField.hint}>
              <TextArea
                rows={mainField.rows ?? 12}
                placeholder={mainField.placeholder}
                value={values[mainField.key] ?? ""}
                onChange={e => setVal(mainField.key, e.target.value)}
              />
            </Field>
          )}

          {/* OUTPUTS */}
          <div className="space-y-3">
            {results.map((r, i) => <ResultBlock key={i} r={r} />)}
          </div>
        </div>

        {/* SIDE FIELDS */}
        <aside className="space-y-4 lg:border-l lg:border-border lg:pl-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Settings</div>
          {sideFields.length === 0 && !mainField && (
            <div className="text-xs text-muted-foreground">No options.</div>
          )}
          {sideFields.map(f => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              {renderField(f, values[f.key], v => setVal(f.key, v))}
            </Field>
          ))}
        </aside>
      </div>
    </ToolWorkspace>
  );
}

function renderField(f: any, value: any, onChange: (v: any) => void) {
  switch (f.type) {
    case "text":
      return <TextInput placeholder={f.placeholder} value={value ?? ""} onChange={e => onChange(e.target.value)} />;
    case "number":
      return <TextInput type="number" min={f.min} max={f.max} step={f.step} value={value ?? ""} onChange={e => onChange(e.target.value === "" ? "" : Number(e.target.value))} />;
    case "slider":
      return (
        <div className="space-y-1.5">
          <input type="range" min={f.min ?? 0} max={f.max ?? 100} step={f.step ?? 1} value={value ?? f.min ?? 0} onChange={e => onChange(Number(e.target.value))} className="w-full accent-foreground" />
          <div className="text-[11px] text-muted-foreground tabular-nums">{value}</div>
        </div>
      );
    case "checkbox":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={cn(
            "w-full h-10 rounded-lg border text-sm flex items-center justify-between px-3 transition-colors",
            value ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-accent"
          )}
        >
          <span>{value ? "Enabled" : "Disabled"}</span>
          <span className={cn("h-4 w-7 rounded-full relative transition-colors", value ? "bg-background/30" : "bg-foreground/15")}>
            <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-background transition-all", value ? "left-3.5" : "left-0.5 bg-foreground")} />
          </span>
        </button>
      );
    case "select":
      return (
        <select
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 rounded-lg bg-card border border-border px-3 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-colors"
        >
          {f.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)} className="h-10 w-12 rounded-lg border border-border bg-card cursor-pointer" />
          <TextInput value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder="#000000" />
        </div>
      );
  }
}

function ResultBlock({ r }: { r: RunResult }) {
  if (r.type === "error") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        {r.message}
      </div>
    );
  }
  if (r.type === "stats") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {r.items.map((s, i) => <Stat key={i} k={s.k} v={s.v} />)}
      </div>
    );
  }
  if (r.type === "html") {
    return (
      <div className="rounded-lg border border-border bg-card p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: r.html }} />
    );
  }
  // text
  return (
    <div className="rounded-lg border border-border bg-surface-soft/60 p-3.5">
      <pre className={cn("text-[13px] leading-relaxed whitespace-pre-wrap break-words", r.mono !== false && "font-mono")}>
        {r.value || <span className="text-muted-foreground">Output will appear here.</span>}
      </pre>
    </div>
  );
}