import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { CopyButton } from "@/components/tools/CopyButton";
import { PanelLabel } from "@/components/tools/SplitPanel";
import { toast } from "sonner";

export default function PdfExtract() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const extract = async (f: File) => {
    if (f.type !== "application/pdf") return toast.error("PDF files only");
    setFile(f); setBusy(true); setText("");
    try {
      // @ts-expect-error external CDN module
      const pdfjs = await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
      const buf = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      let out = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        out += `--- Page ${i} ---\n${tc.items.map((it: { str: string }) => it.str).join(" ")}\n\n`;
      }
      setText(out.trim());
      toast.success(`Extracted text from ${pdf.numPages} pages`);
    } catch (e) {
      toast.error("Failed to extract text");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setFile(null); setText(""); };

  return (
    <ToolWorkspace toolId="pdf-extract" actions={
      <>
        <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
        <CopyButton text={text} />
      </>
    }>
      {!file ? (
        <Dropzone accept="application/pdf" onFile={extract} hint="PDF text is extracted entirely in your browser." />
      ) : (
        <div className="space-y-3">
          <PanelLabel hint={busy ? "Working…" : `${text.length} chars`}>Extracted text · {file.name}</PanelLabel>
          {busy ? (
            <div className="h-[480px] recess rounded-2xl p-4 flex items-center justify-center text-sm text-muted-foreground font-mono">
              <span className="animate-pulse">Reading PDF…</span>
            </div>
          ) : (
            <pre className="w-full h-[480px] recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">{text || <span className="text-muted-foreground/60">No text found.</span>}</pre>
          )}
        </div>
      )}
    </ToolWorkspace>
  );
}
