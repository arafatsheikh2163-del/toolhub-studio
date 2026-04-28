import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { TextArea, Stat } from "@/components/tools/Field";

const KEY = "toolhub:notepad";

export default function Notepad() {
  const [text, setText] = useState(() => localStorage.getItem(KEY) || "");
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(KEY, text);
      setSavedAt(new Date().toLocaleTimeString());
    }, 400);
    return () => clearTimeout(t);
  }, [text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <ToolWorkspace toolId="notepad" actions={<CopyButton text={text} />}>
      <TextArea rows={22} value={text} onChange={(e) => setText(e.target.value)} placeholder="Start writing — your notes are saved automatically in this browser…" className="text-base !font-sans" />
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Stat k="Words" v={words} />
        <Stat k="Characters" v={text.length} />
        <Stat k="Saved" v={savedAt || "—"} />
      </div>
    </ToolWorkspace>
  );
}
