import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { ArrowDown, ArrowUp, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  async function merge() {
    if (files.length < 2) return toast.error("Add at least 2 PDFs");
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p => out.addPage(p));
      }
      const blob = new Blob([(await out.save()) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "merged.pdf"; a.click();
      URL.revokeObjectURL(url);
      toast.success(`Merged ${files.length} PDFs`);
    } catch (e: any) { toast.error("Merge failed: " + e.message); }
    setBusy(false);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  }

  return (
    <ToolWorkspace toolId="pdf-merge" actions={files.length >= 2 && <button onClick={merge} disabled={busy} className="btn-3d text-xs !px-3.5 !py-1.5"><Download className="h-3.5 w-3.5" />{busy ? "Merging…" : "Merge & Download"}</button>}>
      <Dropzone accept="application/pdf" multiple hint="Drop PDF files in the order you want them merged" onFile={(f) => setFiles(arr => [...arr, f])} />

      {files.length > 0 && (
        <div className="mt-5 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="surface-soft rounded-lg p-3 flex items-center gap-3">
              <div className="w-7 h-7 grid place-items-center rounded-md surface text-xs font-mono">{i+1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{f.name}</div>
                <div className="text-xs text-muted-foreground">{(f.size/1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => move(i, -1)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-foreground/5"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-foreground/5"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => setFiles(arr => arr.filter((_, k) => k !== i))} className="h-8 w-8 grid place-items-center rounded-md hover:bg-foreground/5"><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
            </div>
          ))}
        </div>
      )}
    </ToolWorkspace>
  );
}
