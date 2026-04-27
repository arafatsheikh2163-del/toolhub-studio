import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";

export default function PdfViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const onFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    if (url) URL.revokeObjectURL(url);
    setFile(f); setUrl(URL.createObjectURL(f));
  };
  const reset = () => { if (url) URL.revokeObjectURL(url); setFile(null); setUrl(""); };

  return (
    <ToolWorkspace toolId="pdf-viewer" actions={
      <button onClick={reset} className="btn-pill btn-secondary !py-1.5" disabled={!file}>Reset</button>
    }>
      {!file ? (
        <Dropzone accept="application/pdf" onFile={onFile} hint="PDF files only · up to 50MB" />
      ) : (
        <div className="recess rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            {file.name}
          </div>
          <iframe src={url} title="PDF" className="w-full h-[640px] bg-white" />
        </div>
      )}
    </ToolWorkspace>
  );
}
