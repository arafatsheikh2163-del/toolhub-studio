import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";
import { Play, Square } from "lucide-react";

export default function Tts() {
  const [text, setText] = useState("Hello, this is your browser speaking. Type anything and press play.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

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
      </div>
      <p className="text-xs text-muted-foreground mt-4">Uses your operating system's built-in voices via Web Speech API.</p>
    </ToolWorkspace>
  );
}
