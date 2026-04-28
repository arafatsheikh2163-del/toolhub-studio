import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Camera, Download, Square } from "lucide-react";
import { toast } from "sonner";

export default function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [shot, setShot] = useState<string>("");

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } } });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
    } catch (e: any) { toast.error("Camera access denied"); }
  }
  function stop() { stream?.getTracks().forEach(t => t.stop()); setStream(null); }
  useEffect(() => () => stream?.getTracks().forEach(t => t.stop()), [stream]);

  function snap() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    setShot(c.toDataURL("image/png"));
  }
  function download() {
    const a = document.createElement("a");
    a.href = shot; a.download = `webcam-${Date.now()}.png`; a.click();
  }

  return (
    <ToolWorkspace toolId="webcam-capture">
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="surface-soft rounded-2xl overflow-hidden aspect-video relative">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          {!stream && <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Camera off</div>}
        </div>
        <div className="surface-soft rounded-2xl overflow-hidden aspect-video grid place-items-center">
          {shot ? <img src={shot} alt="" className="w-full h-full object-cover" /> : <span className="text-sm text-muted-foreground">No capture yet</span>}
        </div>
      </div>
      <div className="flex gap-2 mt-5 flex-wrap">
        {!stream
          ? <button onClick={start} className="btn-3d"><Camera className="h-4 w-4" />Start camera</button>
          : <>
              <button onClick={snap} className="btn-3d"><Camera className="h-4 w-4" />Capture</button>
              <button onClick={stop} className="btn-3d-light"><Square className="h-4 w-4" />Stop</button>
            </>
        }
        {shot && <button onClick={download} className="btn-3d-light"><Download className="h-4 w-4" />Download PNG</button>}
      </div>
    </ToolWorkspace>
  );
}
