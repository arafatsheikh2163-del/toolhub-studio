import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";
import { Field } from "@/components/tools/Field";
import { Download, Loader2 } from "lucide-react";

// Color-key background remover (no API). Best for solid/near-solid backgrounds.
export default function BgRemove() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [tol, setTol] = useState(40);
  const [feather, setFeather] = useState(8);
  const [mode, setMode] = useState<"corner" | "white" | "black" | "green">("corner");
  const [busy, setBusy] = useState(false);

  const process = async (dataUrl: string, opts = { tol, feather, mode }) => {
    setBusy(true);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const d = id.data;

      // Determine key color
      let kr = 255, kg = 255, kb = 255;
      if (opts.mode === "corner") {
        // average 4 corners
        const samples = [
          [0, 0], [c.width - 1, 0], [0, c.height - 1], [c.width - 1, c.height - 1],
        ];
        let sr = 0, sg = 0, sb = 0;
        for (const [x, y] of samples) {
          const i = (y * c.width + x) * 4;
          sr += d[i]; sg += d[i + 1]; sb += d[i + 2];
        }
        kr = sr / 4; kg = sg / 4; kb = sb / 4;
      } else if (opts.mode === "white") { kr = kg = kb = 255; }
      else if (opts.mode === "black") { kr = kg = kb = 0; }
      else if (opts.mode === "green") { kr = 0; kg = 255; kb = 0; }

      const tolerance = opts.tol;
      const fade = Math.max(1, opts.feather);
      const tolSoft = tolerance + fade;

      for (let i = 0; i < d.length; i += 4) {
        const dr = d[i] - kr, dg = d[i + 1] - kg, db = d[i + 2] - kb;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist <= tolerance) {
          d[i + 3] = 0;
        } else if (dist < tolSoft) {
          const t = (dist - tolerance) / fade;
          d[i + 3] = Math.round(d[i + 3] * t);
        }
      }
      ctx.putImageData(id, 0, 0);
      setOut(c.toDataURL("image/png"));
      setBusy(false);
    };
    img.onerror = () => setBusy(false);
    img.src = dataUrl;
  };

  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => { const u = r.result as string; setSrc(u); process(u); };
    r.readAsDataURL(f);
  };

  return (
    <ToolWorkspace
      toolId="bg-remove"
      actions={out && (
        <a href={out} download="no-bg.png" className="btn-3d text-xs !px-3.5 !py-1.5">
          <Download className="h-3.5 w-3.5" />Download PNG
        </a>
      )}
    >
      {!src ? (
        <Dropzone onFile={onFile} hint="Works best on solid / near-solid backgrounds. Up to 30MB." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl surface-soft p-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Original</div>
              <img src={src} alt="original" className="w-full h-auto rounded-md" />
            </div>
            <div className="rounded-xl p-2 border border-border" style={{ backgroundImage: "linear-gradient(45deg,#e5e5e5 25%,transparent 25%,transparent 75%,#e5e5e5 75%),linear-gradient(45deg,#e5e5e5 25%,transparent 25%,transparent 75%,#e5e5e5 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,8px 8px" }}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Result</div>
              {busy ? (
                <div className="grid place-items-center h-60 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : out ? (
                <img src={out} alt="result" className="w-full h-auto rounded-md" />
              ) : null}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <Field label="Background sample">
              <select value={mode} onChange={(e) => { setMode(e.target.value as any); process(src, { tol, feather, mode: e.target.value as any }); }} className="w-full h-10 rounded-md surface-soft border px-3 text-sm">
                <option value="corner">Auto (corner)</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="green">Green screen</option>
              </select>
            </Field>
            <Field label={`Tolerance · ${tol}`}>
              <input type="range" min={5} max={150} value={tol} onChange={(e) => { setTol(+e.target.value); process(src, { tol: +e.target.value, feather, mode }); }} className="w-full" />
            </Field>
            <Field label={`Edge feather · ${feather}`}>
              <input type="range" min={0} max={60} value={feather} onChange={(e) => { setFeather(+e.target.value); process(src, { tol, feather: +e.target.value, mode }); }} className="w-full" />
            </Field>
            <div className="flex items-end">
              <button onClick={() => { setSrc(""); setOut(""); }} className="btn-3d-light text-xs w-full">Choose another</button>
            </div>
          </div>
        </>
      )}
    </ToolWorkspace>
  );
}
