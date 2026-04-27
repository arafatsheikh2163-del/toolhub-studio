import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Dropzone } from "@/components/tools/Dropzone";

export default function AudioViz() {
  const [src, setSrc] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<{ ac?: AudioContext; an?: AnalyserNode; raf?: number }>({});

  useEffect(() => () => { if (ctxRef.current.raf) cancelAnimationFrame(ctxRef.current.raf); ctxRef.current.ac?.close(); }, []);

  const start = () => {
    const a = audioRef.current!, c = canvasRef.current!;
    if (!a || !c) return;
    if (!ctxRef.current.ac) {
      const ac = new AudioContext();
      const an = ac.createAnalyser(); an.fftSize = 256;
      const sourceNode = ac.createMediaElementSource(a);
      sourceNode.connect(an); an.connect(ac.destination);
      ctxRef.current = { ac, an };
    }
    const { an } = ctxRef.current;
    const data = new Uint8Array(an!.frequencyBinCount);
    const ctx = c.getContext("2d")!;
    const draw = () => {
      ctxRef.current.raf = requestAnimationFrame(draw);
      an!.getByteFrequencyData(data);
      ctx.fillStyle = "#000"; ctx.fillRect(0,0,c.width,c.height);
      const w = c.width / data.length;
      for (let i = 0; i < data.length; i++) {
        const h = (data[i]/255) * c.height;
        ctx.fillStyle = `hsl(0 0% ${60+(data[i]/255)*40}%)`;
        ctx.fillRect(i*w, c.height-h, w-1, h);
      }
    };
    draw();
    a.play();
  };

  const onFile = (f: File) => { if (f) setSrc(URL.createObjectURL(f)); };

  return (
    <ToolWorkspace toolId="audio-viz">
      {!src ? <Dropzone onFile={onFile} accept="audio/*" /> : (
        <div className="space-y-3">
          <canvas ref={canvasRef} width={800} height={240} className="w-full rounded-lg border border-white/10 bg-black" />
          <audio ref={audioRef} src={src} controls className="w-full" onPlay={start} />
          <button onClick={()=>setSrc("")} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><span className="relative z-10">Reset</span></button>
        </div>
      )}
    </ToolWorkspace>
  );
}
