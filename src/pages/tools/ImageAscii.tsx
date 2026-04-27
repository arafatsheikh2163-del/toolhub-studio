import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field } from "@/components/tools/Field";

const RAMP = " .:-=+*#%@";

export default function ImageAscii() {
  const [out, setOut] = useState("");
  const [width, setWidth] = useState(100);

  const onFiles = async (files: File[]) => {
    const f = files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const ratio = img.height / img.width;
      const w = width, h = Math.round(w * ratio * 0.5);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0,0,w,h).data;
      let s = "";
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y*w+x)*4;
          const lum = (data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114)/255;
          s += RAMP[Math.floor(lum*(RAMP.length-1))];
        }
        s += "\n";
      }
      setOut(s);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <ToolWorkspace toolId="image-ascii" actions={out?<CopyButton text={out} />:null}>
      <Field label={`Width: ${width} chars`}>
        <input type="range" min={40} max={200} value={width} onChange={e=>setWidth(+e.target.value)} className="w-full accent-white" />
      </Field>
      <div className="mt-3"><Dropzone onFiles={onFiles} accept="image/*" /></div>
      {out && <pre className="mt-4 rounded-lg recess p-3 text-[7px] sm:text-[8px] leading-[1] font-mono whitespace-pre overflow-auto max-h-[600px]">{out}</pre>}
    </ToolWorkspace>
  );
}
