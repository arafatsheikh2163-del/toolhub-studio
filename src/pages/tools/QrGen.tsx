import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea, TextInput } from "@/components/tools/Field";
import { downloadBlob } from "@/lib/format";
import { Download } from "lucide-react";

export default function QrGen() {
  const [text, setText] = useState("https://lovable.dev");
  const [size, setSize] = useState(420);
  const [margin, setMargin] = useState(2);
  const [dark, setDark] = useState("#ffffff");
  const [light, setLight] = useState("#000000");
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !text) return;
    QRCode.toCanvas(ref.current, text, { width: size, margin, color: { dark, light } }).catch(()=>{});
  }, [text, size, margin, dark, light]);

  const dl = () => {
    if (!ref.current) return;
    ref.current.toBlob(b => b && downloadBlob(b, "qrcode.png"));
  };

  return (
    <ToolWorkspace toolId="qr-gen" actions={
      <button onClick={dl} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><Download className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Download PNG</span></button>
    }>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-lg recess p-4 grid place-items-center min-h-[420px]">
          <canvas ref={ref} className="rounded-md max-w-full h-auto" style={{ background: light }} />
        </div>
        <div className="space-y-4">
          <Field label="Content"><TextArea rows={5} value={text} onChange={e => setText(e.target.value)} /></Field>
          <Field label={`Size: ${size}px`}>
            <input type="range" min={200} max={800} value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-white" />
          </Field>
          <Field label={`Margin: ${margin}`}>
            <input type="range" min={0} max={8} value={margin} onChange={e => setMargin(+e.target.value)} className="w-full accent-white" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Foreground"><TextInput type="color" value={dark} onChange={e => setDark(e.target.value)} className="!h-10 !p-1" /></Field>
            <Field label="Background"><TextInput type="color" value={light} onChange={e => setLight(e.target.value)} className="!h-10 !p-1" /></Field>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
