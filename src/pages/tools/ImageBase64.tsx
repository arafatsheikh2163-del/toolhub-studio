import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea, Stat } from "@/components/tools/Field";
import { formatBytes } from "@/lib/format";

export default function ImageBase64() {
  const [data, setData] = useState("");
  const [meta, setMeta] = useState<{name:string,size:number,type:string}|null>(null);
  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { setData(String(r.result||"")); setMeta({name:f.name,size:f.size,type:f.type}); };
    r.readAsDataURL(f);
  };
  return (
    <ToolWorkspace toolId="image-base64" actions={data?<CopyButton text={data} label="Copy data URI" />:null}>
      {!data ? <Dropzone onFiles={onFiles} accept="image/*" /> : (
        <div className="space-y-4">
          <div className="grid md:grid-cols-[200px_1fr] gap-4">
            <img src={data} alt="" className="rounded-md border border-white/10 max-h-[200px] object-contain bg-black/30" />
            <div className="grid grid-cols-2 gap-2">
              {meta && <>
                <Stat k="Name" v={meta.name} />
                <Stat k="Size" v={formatBytes(meta.size)} />
                <Stat k="Type" v={meta.type} />
                <Stat k="Encoded length" v={data.length.toLocaleString()} />
              </>}
            </div>
          </div>
          <Field label="Data URI"><TextArea rows={8} readOnly value={data} className="text-[11px]" /></Field>
          <button onClick={()=>{setData("");setMeta(null);}} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><span className="relative z-10">Reset</span></button>
        </div>
      )}
    </ToolWorkspace>
  );
}
