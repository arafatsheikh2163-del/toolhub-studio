import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("1-1");
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    setFile(f);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
    setRange(`1-${doc.getPageCount()}`);
  }

  function parseRange(r: string, max: number): number[] {
    const out = new Set<number>();
    r.split(",").forEach(part => {
      const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
      if (!m) return;
      const a = +m[1], b = m[2] ? +m[2] : a;
      for (let i = Math.min(a,b); i <= Math.max(a,b); i++) if (i >= 1 && i <= max) out.add(i - 1);
    });
    return [...out].sort((a,b)=>a-b);
  }

  async function split() {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const idx = parseRange(range, src.getPageCount());
      if (!idx.length) { toast.error("Empty page range"); setBusy(false); return; }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach(p => out.addPage(p));
      const blob = new Blob([(await out.save()) as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `split-${range}.pdf`; a.click();
      toast.success(`Extracted ${idx.length} pages`);
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  }

  return (
    <ToolWorkspace toolId="pdf-split" actions={file && <button onClick={split} disabled={busy} className="btn-3d text-xs !px-3.5 !py-1.5"><Download className="h-3.5 w-3.5" />{busy ? "Working…" : "Extract"}</button>}>
      {!file
        ? <Dropzone accept="application/pdf" hint="Drop a PDF to split" onFile={onFile} />
        : <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <Stat k="File" v={file.name} />
              <Stat k="Pages" v={pageCount} />
              <Stat k="Size" v={`${(file.size/1024).toFixed(1)} KB`} />
            </div>
            <Field label="Page range" hint="e.g. 1-3, 5, 8-10"><TextInput value={range} onChange={(e)=>setRange(e.target.value)} /></Field>
            <button onClick={() => { setFile(null); setPageCount(0); }} className="btn-3d-light text-xs mt-4">Choose another</button>
          </>
      }
    </ToolWorkspace>
  );
}
