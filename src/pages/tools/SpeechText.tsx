import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Mic, Square } from "lucide-react";

export default function SpeechText() {
  const [text, setText] = useState("");
  const [on, setOn] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => {
      let s = "";
      for (let i = e.resultIndex; i < e.results.length; i++) s += e.results[i][0].transcript;
      setText(t => t + s);
    };
    r.onend = () => setOn(false);
    recRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, []);

  const toggle = () => {
    if (!recRef.current) return;
    if (on) { recRef.current.stop(); setOn(false); }
    else { recRef.current.start(); setOn(true); }
  };

  return (
    <ToolWorkspace toolId="speech-text" actions={text?<CopyButton text={text} />:null}>
      {!supported ? (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-sm">Web Speech API isn't supported in this browser. Try Chrome.</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={toggle} className={(on?"btn-3d":"btn-3d-dark")+" text-sm !px-5 !py-2.5"}>
              {on ? <><Square className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Stop</span></> : <><Mic className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Start Listening</span></>}
            </button>
            {on && <span className="text-xs text-muted-foreground flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-foreground animate-pulse" /> Listening…</span>}
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={14} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-3 text-sm leading-relaxed font-sans outline-none resize-none" placeholder="Transcript will appear here…" />
        </div>
      )}
    </ToolWorkspace>
  );
}
