import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

const FONT: Record<string, string[]> = {
  A: [" ## ","#  #","####","#  #","#  #"],
  B: ["### ","#  #","### ","#  #","### "],
  C: [" ###","#   ","#   ","#   "," ###"],
  D: ["### ","#  #","#  #","#  #","### "],
  E: ["####","#   ","### ","#   ","####"],
  F: ["####","#   ","### ","#   ","#   "],
  G: [" ###","#   ","# ##","#  #"," ###"],
  H: ["#  #","#  #","####","#  #","#  #"],
  I: ["###"," # "," # "," # ","###"],
  L: ["#   ","#   ","#   ","#   ","####"],
  O: [" ## ","#  #","#  #","#  #"," ## "],
  R: ["### ","#  #","### ","# # ","#  #"],
  S: [" ###","#   "," ## ","   #","### "],
  T: ["#####","  #  ","  #  ","  #  ","  #  "],
  U: ["#  #","#  #","#  #","#  #"," ## "],
  V: ["#  #","#  #","#  #"," ## ","  # "],
  W: ["#  #","#  #","#  #","####","# # "],
  Y: ["#  #","#  #"," ## ","  # ","  # "],
  " ": ["  ","  ","  ","  ","  "],
};
function art(s: string) {
  const chars = s.toUpperCase().split("").map(c => FONT[c] || FONT[" "]);
  return Array.from({length:5}, (_, r) => chars.map(c => c[r]).join("  ")).join("\n");
}

export default function AsciiArt() {
  const [text, setText] = useState("HELLO");
  const out = useMemo(()=>art(text),[text]);
  return (
    <ToolWorkspace toolId="ascii-art" actions={<CopyButton text={out} />}>
      <Field label="Text (A–Z)"><TextInput value={text} onChange={e=>setText(e.target.value.replace(/[^A-Za-z ]/g,""))} /></Field>
      <pre className="mt-4 rounded-lg recess p-5 text-[10px] sm:text-xs leading-tight font-mono overflow-auto whitespace-pre">{out}</pre>
    </ToolWorkspace>
  );
}
