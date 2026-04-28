import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea, TextInput } from "@/components/tools/Field";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

const enc = new TextEncoder();
const dec = new TextDecoder();
const b64 = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b)));
const fromB64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array) {
  const km = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as BufferSource, iterations: 200000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export default function Encrypt() {
  const [text, setText] = useState("");
  const [pwd, setPwd] = useState("");
  const [out, setOut] = useState("");

  async function encrypt() {
    if (!pwd || !text) return toast.error("Need text and password");
    const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
    const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>;
    const key = await deriveKey(pwd, salt);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
    const packed = new Uint8Array(salt.length + iv.length + ct.byteLength);
    packed.set(salt, 0); packed.set(iv, salt.length); packed.set(new Uint8Array(ct), salt.length + iv.length);
    setOut(b64(packed.buffer));
    toast.success("Encrypted");
  }

  async function decrypt() {
    if (!pwd || !text) return toast.error("Need ciphertext and password");
    try {
      const data = fromB64(text.trim());
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const ct = data.slice(28);
      const key = await deriveKey(pwd, salt);
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
      setOut(dec.decode(pt));
      toast.success("Decrypted");
    } catch { toast.error("Decryption failed — wrong password or corrupt data"); }
  }

  return (
    <ToolWorkspace toolId="encrypt" actions={<CopyButton text={out} />}>
      <div className="grid lg:grid-cols-2 gap-5">
        <Field label="Input"><TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Plain text or Base64 ciphertext" /></Field>
        <Field label="Output"><TextArea rows={10} value={out} readOnly /></Field>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        <Field label="Password" className="sm:col-span-1"><TextInput type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="strong passphrase" /></Field>
        <div className="sm:col-span-2 flex items-end gap-2">
          <button onClick={encrypt} className="btn-3d"><Lock className="h-4 w-4" />Encrypt</button>
          <button onClick={decrypt} className="btn-3d-light"><Unlock className="h-4 w-4" />Decrypt</button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4">AES-GCM 256-bit · PBKDF2 200k iterations · everything happens in your browser.</p>
    </ToolWorkspace>
  );
}
