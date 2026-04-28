import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";
import { Play, Square, Download } from "lucide-react";
import { downloadBlob } from "@/lib/format";
import { toast } from "sonner";

export default function Tts() {
  const [text, setText] = useState("Hello, this is your browser speaking. Type anything and press play.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const load = () => { const v = window.speechSynthesis.getVoices(); setVoices(v); if (!voice && v[0]) setVoice(v[0].name); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, [voice]);

  function speak() {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find(x => x.name === voice);
    if (v) u.voice = v;
    u.rate = rate; u.pitch = pitch;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }
  function stop() { window.speechSynthesis.cancel(); setSpeaking(false); }

  async function downloadAudio() {
    if (!text.trim()) { toast.error("Type some text first"); return; }
    try {
      setRecording(true);
      // Capture system audio via MediaRecorder on an AudioContext destination
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioCtx();
      const dest = ctx.createMediaStreamDestination();

      // Route speech synthesis through an <audio> element is not possible directly,
      // so we fall back to recording the tab's speaker via getDisplayMedia if available,
      // otherwise record from a silent context with the utterance playing on system output.
      let stream: MediaStream;
      try {
        // @ts-ignore
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const audioTracks = stream.getAudioTracks();
        if (!audioTracks.length) throw new Error("no-audio");
      } catch {
        toast.error("Browser can't capture TTS audio. Use Chrome and share a tab with audio.");
        setRecording(false);
        return;
      }

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const audioOnly = new MediaStream(stream.getAudioTracks());
      const recorder = new MediaRecorder(audioOnly, { mimeType: mime });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        ctx.close();
        const blob = new Blob(chunks, { type: mime });
        downloadBlob(blob, `tts-${Date.now()}.webm`);
        setRecording(false);
        toast.success("Audio downloaded");
      };

      recorder.start();
      const u = new SpeechSynthesisUtterance(text);
      const v = voices.find(x => x.name === voice);
      if (v) u.voice = v;
      u.rate = rate; u.pitch = pitch;
      u.onend = () => setTimeout(() => recorder.state !== "inactive" && recorder.stop(), 400);
      u.onerror = () => recorder.state !== "inactive" && recorder.stop();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err: any) {
      setRecording(false);
      toast.error(err?.message || "Failed to record audio");
    }
  }

  return (
    <ToolWorkspace toolId="tts">
      <Field label="Text"><TextArea rows={8} value={text} onChange={(e) => setText(e.target.value)} /></Field>

      <div className="grid sm:grid-cols-3 gap-4 mt-5">
        <Field label="Voice">
          <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full h-10 rounded-md surface-soft border px-3 text-sm">
            {voices.map(v => <option key={v.name} value={v.name}>{v.name} — {v.lang}</option>)}
          </select>
        </Field>
        <Field label={`Rate · ${rate.toFixed(2)}x`}>
          <input type="range" min={0.5} max={2} step={0.05} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </Field>
        <Field label={`Pitch · ${pitch.toFixed(2)}`}>
          <input type="range" min={0} max={2} step={0.05} value={pitch} onChange={(e) => setPitch(+e.target.value)} className="w-full" />
        </Field>
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={speak} className="btn-3d"><Play className="h-4 w-4" />{speaking ? "Re-play" : "Play"}</button>
        <button onClick={stop} className="btn-3d-light"><Square className="h-4 w-4" />Stop</button>
        <button onClick={downloadAudio} disabled={recording} className="btn-3d-light">
          <Download className="h-4 w-4" />{recording ? "Recording…" : "Download"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Uses your OS voices via Web Speech API. Download captures the playback by sharing the current tab with audio
        (a browser permission prompt will appear — make sure to enable "Share tab audio").
      </p>
    </ToolWorkspace>
  );
}
