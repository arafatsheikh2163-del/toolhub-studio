import {
  Type, CaseSensitive, Eraser, ArrowDownAZ, Replace, AlignLeft, Quote, Hash as HashIcon,
  Code2, Braces, Binary, Link2, FileJson, FileCode2, FileText, Database, Table2, Sigma,
  KeyRound, Fingerprint, Shuffle, Calculator as CalcIcon, Clock, CalendarDays, Ruler, Globe,
  Pipette, Palette, Layers, Shapes, Droplet, Star, Heart, Sparkles,
  ShieldCheck, Lock, Eye, GitCompare, Regex,
  Image as ImageIcon, FileImage, ScanLine, Crop, Scaling, RotateCw,
  Mic, Volume2, Camera, Timer, NotebookPen, ListChecks, Bookmark,
  Zap, Smile, Languages, BookOpen, Coffee, Brain, Target, Crown,
  Wand2, ScrollText, Repeat, Type as TypeIcon, Italic, Bold, Underline,
  PaintBucket, Brush, Aperture, Cog,
} from "lucide-react";
import type { SimpleToolDef } from "./simpleToolTypes";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
const txt = (v: string) => ({ type: "text" as const, value: v });
const stats = (items: Array<{ k: string; v: string | number }>) => ({ type: "stats" as const, items });
const err = (message: string) => ({ type: "error" as const, message });

const ml = (rows = 10): any => ({ type: "textarea", rows });

const TEXT = (key = "input", label = "Input", placeholder = "Paste text here…", rows = 12) =>
  ({ key, label, type: "textarea" as const, placeholder, rows });

/* ================================================================== *
 * 1) DEVELOPER  (formatters, encoders, code utilities)               *
 * ================================================================== */
const developer: SimpleToolDef[] = [
  {
    id: "rot13", name: "ROT13 Cipher", description: "Encode or decode classic ROT13 text instantly.",
    category: "developer", icon: Replace, accent: "ink", keywords: ["rot13","cipher"],
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= c.charCodeAt(0) + 13 ? c.charCodeAt(0) + 13 : c.charCodeAt(0) - 13))),
  },
  {
    id: "atbash", name: "Atbash Cipher", description: "Reverse-alphabet substitution cipher.",
    category: "developer", icon: Replace, accent: "stone",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/[a-z]/g, c => String.fromCharCode(219 - c.charCodeAt(0))).replace(/[A-Z]/g, c => String.fromCharCode(155 - c.charCodeAt(0)))),
  },
  {
    id: "caesar", name: "Caesar Cipher", description: "Shift letters by N positions.",
    category: "developer", icon: Replace, accent: "sand",
    fields: [
      TEXT(),
      { key: "shift", label: "Shift", type: "slider", min: -25, max: 25, default: 3 },
    ],
    run: v => {
      const s = Number(v.shift) || 0;
      return txt(String(v.input ?? "").replace(/[a-zA-Z]/g, c => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + s + 26) % 26) + base);
      }));
    },
  },
  {
    id: "binary-encode", name: "Text → Binary", description: "Convert text into a binary string (8-bit).",
    category: "developer", icon: Binary, accent: "ink", keywords: ["binary"],
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")),
  },
  {
    id: "binary-decode", name: "Binary → Text", description: "Decode a binary (8-bit) string back to text.",
    category: "developer", icon: Binary, accent: "paper",
    fields: [TEXT("input", "Binary", "01001000 01101001")],
    run: v => {
      try {
        const out = String(v.input ?? "").trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join("");
        return txt(out);
      } catch { return err("Invalid binary input"); }
    },
  },
  {
    id: "hex-encode", name: "Text → Hex", description: "Convert text to hexadecimal bytes.",
    category: "developer", icon: Sigma, accent: "stone",
    fields: [TEXT()],
    run: v => txt(Array.from(String(v.input ?? "")).map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ")),
  },
  {
    id: "hex-decode", name: "Hex → Text", description: "Decode hex bytes back to text.",
    category: "developer", icon: Sigma, accent: "mist",
    fields: [TEXT("input","Hex","48 65 6c 6c 6f")],
    run: v => {
      try { return txt(String(v.input ?? "").trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join("")); }
      catch { return err("Invalid hex input"); }
    },
  },
  {
    id: "morse-encode", name: "Text → Morse", description: "Convert plain text to Morse code.",
    category: "developer", icon: Zap, accent: "ink",
    fields: [TEXT()],
    run: v => {
      const M: Record<string, string> = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.","0":"-----"," ":"/"};
      return txt(String(v.input ?? "").toUpperCase().split("").map(c => M[c] ?? "").filter(Boolean).join(" "));
    },
  },
  {
    id: "morse-decode", name: "Morse → Text", description: "Decode Morse code into plain text.",
    category: "developer", icon: Zap, accent: "paper",
    fields: [TEXT("input","Morse","-- --- .-. ... .")],
    run: v => {
      const M: Record<string,string> = {".-":"A","-...":"B","-.-.":"C","-..":"D",".":"E","..-.":"F","--.":"G","....":"H","..":"I",".---":"J","-.-":"K",".-..":"L","--":"M","-.":"N","---":"O",".--.":"P","--.-":"Q",".-.":"R","...":"S","-":"T","..-":"U","...-":"V",".--":"W","-..-":"X","-.--":"Y","--..":"Z",".----":"1","..---":"2","...--":"3","....-":"4",".....":"5","-....":"6","--...":"7","---..":"8","----.":"9","-----":"0"};
      return txt(String(v.input ?? "").trim().split(" / ").map(w => w.split(" ").map(s => M[s] ?? "").join("")).join(" "));
    },
  },
  {
    id: "html-encode", name: "HTML Entity Encode", description: "Escape <, >, &, \" and ' to HTML entities.",
    category: "developer", icon: Code2, accent: "stone",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"} as any)[c])),
  },
  {
    id: "html-decode", name: "HTML Entity Decode", description: "Convert HTML entities back to characters.",
    category: "developer", icon: Code2, accent: "mist",
    fields: [TEXT()],
    run: v => {
      const d = document.createElement("div");
      d.innerHTML = String(v.input ?? "");
      return txt(d.textContent ?? "");
    },
  },
  {
    id: "string-reverse", name: "String Reverse", description: "Reverse the order of characters in a string.",
    category: "developer", icon: Repeat, accent: "sand",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("").reverse().join("")),
  },
  {
    id: "line-reverse", name: "Reverse Lines", description: "Reverse the order of lines in a block of text.",
    category: "developer", icon: ArrowDownAZ, accent: "paper",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("\n").reverse().join("\n")),
  },
  {
    id: "line-shuffle", name: "Shuffle Lines", description: "Randomly shuffle the order of lines.",
    category: "developer", icon: Shuffle, accent: "olive",
    fields: [TEXT()],
    live: false, runLabel: "Shuffle",
    run: v => {
      const lines = String(v.input ?? "").split("\n");
      for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; }
      return txt(lines.join("\n"));
    },
  },
  {
    id: "line-dedup", name: "Remove Duplicate Lines", description: "Strip duplicate lines while preserving order.",
    category: "developer", icon: Eraser, accent: "stone",
    fields: [TEXT(), { key: "casei", label: "Ignore case", type: "checkbox", default: false }],
    run: v => {
      const seen = new Set<string>(); const out: string[] = [];
      String(v.input ?? "").split("\n").forEach(l => { const k = v.casei ? l.toLowerCase() : l; if (!seen.has(k)) { seen.add(k); out.push(l); } });
      return txt(out.join("\n"));
    },
  },
  {
    id: "line-numberer", name: "Line Numbering", description: "Prefix every line with its number.",
    category: "developer", icon: ListChecks, accent: "mist",
    fields: [TEXT(), { key: "start", label: "Start at", type: "number", default: 1 }],
    run: v => {
      const s = Number(v.start) || 1;
      return txt(String(v.input ?? "").split("\n").map((l, i) => `${(i + s).toString().padStart(3, " ")}  ${l}`).join("\n"));
    },
  },
  {
    id: "json-minify", name: "JSON Minify", description: "Strip all whitespace from JSON.",
    category: "developer", icon: Braces, accent: "ink",
    fields: [TEXT()],
    run: v => { try { return txt(JSON.stringify(JSON.parse(String(v.input ?? "")))); } catch (e: any) { return err(e.message); } },
  },
  {
    id: "json-escape", name: "JSON String Escape", description: "Escape any string for safe JSON embedding.",
    category: "developer", icon: Braces, accent: "paper",
    fields: [TEXT()],
    run: v => txt(JSON.stringify(String(v.input ?? ""))),
  },
  {
    id: "json-unescape", name: "JSON String Unescape", description: "Convert a JSON-escaped string into raw text.",
    category: "developer", icon: Braces, accent: "stone",
    fields: [TEXT()],
    run: v => { try { return txt(JSON.parse('"' + String(v.input ?? "").replace(/^"|"$/g, "") + '"')); } catch (e: any) { return err(e.message); } },
  },
  {
    id: "json-flatten", name: "JSON Flatten", description: "Flatten nested JSON into dot-notation keys.",
    category: "developer", icon: Layers, accent: "mist",
    fields: [TEXT()],
    run: v => {
      try {
        const obj = JSON.parse(String(v.input ?? ""));
        const out: Record<string, any> = {};
        const walk = (o: any, p = "") => {
          if (o && typeof o === "object" && !Array.isArray(o)) {
            Object.entries(o).forEach(([k, val]) => walk(val, p ? `${p}.${k}` : k));
          } else { out[p] = o; }
        };
        walk(obj);
        return txt(JSON.stringify(out, null, 2));
      } catch (e: any) { return err(e.message); }
    },
  },
  {
    id: "json-sort-keys", name: "JSON Sort Keys", description: "Sort all object keys alphabetically.",
    category: "developer", icon: ArrowDownAZ, accent: "sand",
    fields: [TEXT()],
    run: v => {
      try {
        const sort = (x: any): any => Array.isArray(x) ? x.map(sort) : x && typeof x === "object" ? Object.keys(x).sort().reduce((a: any, k) => (a[k] = sort(x[k]), a), {}) : x;
        return txt(JSON.stringify(sort(JSON.parse(String(v.input ?? ""))), null, 2));
      } catch (e: any) { return err(e.message); }
    },
  },
  {
    id: "css-format", name: "CSS Beautifier", description: "Pretty-print compact CSS into readable rules.",
    category: "developer", icon: Code2, accent: "olive",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/\s+/g, " ").replace(/\s*{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*}\s*/g, "\n}\n").trim()),
  },
  {
    id: "html-minify", name: "HTML Minifier", description: "Collapse whitespace and remove comments from HTML.",
    category: "developer", icon: Code2, accent: "ink",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim()),
  },
  {
    id: "js-minify", name: "JS Minifier (basic)", description: "Strip comments and excess whitespace from JS code.",
    category: "developer", icon: FileCode2, accent: "stone",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/\s+/g, " ").trim()),
  },
  {
    id: "url-parser", name: "URL Parser", description: "Inspect protocol, host, path, query of any URL.",
    category: "developer", icon: Link2, accent: "paper",
    fields: [{ key: "input", label: "URL", type: "text", placeholder: "https://example.com/path?x=1" }],
    run: v => {
      try {
        const u = new URL(String(v.input || ""));
        const params = Array.from(u.searchParams.entries()).map(([k, val]) => `${k} = ${val}`).join("\n") || "—";
        return [
          stats([
            { k: "Protocol", v: u.protocol }, { k: "Host", v: u.host }, { k: "Port", v: u.port || "—" },
            { k: "Path", v: u.pathname }, { k: "Hash", v: u.hash || "—" }, { k: "Origin", v: u.origin },
          ]),
          txt(`Query parameters:\n${params}`),
        ];
      } catch (e: any) { return err("Invalid URL"); }
    },
  },
  {
    id: "query-builder", name: "Query String Builder", description: "Build a URL query string from key=value lines.",
    category: "developer", icon: Link2, accent: "mist",
    fields: [TEXT("input","Pairs (one per line)","name=Alice\nage=30",6)],
    run: v => {
      const sp = new URLSearchParams();
      String(v.input ?? "").split("\n").forEach(l => { const [k, ...rest] = l.split("="); if (k) sp.set(k.trim(), rest.join("=").trim()); });
      return txt("?" + sp.toString());
    },
  },
  {
    id: "user-agent-parser", name: "User-Agent Parser", description: "Inspect a browser user-agent string.",
    category: "developer", icon: Globe, accent: "sand",
    fields: [{ key: "input", label: "User-Agent", type: "text", placeholder: "Mozilla/5.0 …", default: typeof navigator !== "undefined" ? navigator.userAgent : "" }],
    run: v => {
      const ua = String(v.input ?? "");
      const match = (re: RegExp) => (ua.match(re)?.[1]) ?? "—";
      return stats([
        { k: "Browser", v: /Edg\/([\d.]+)/.test(ua) ? "Edge " + match(/Edg\/([\d.]+)/) : /Chrome\/([\d.]+)/.test(ua) ? "Chrome " + match(/Chrome\/([\d.]+)/) : /Firefox\/([\d.]+)/.test(ua) ? "Firefox " + match(/Firefox\/([\d.]+)/) : /Safari\/([\d.]+)/.test(ua) ? "Safari " + match(/Version\/([\d.]+)/) : "Unknown" },
        { k: "Engine", v: /WebKit/.test(ua) ? "WebKit" : /Gecko/.test(ua) ? "Gecko" : "—" },
        { k: "OS", v: /Windows NT ([\d.]+)/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /Linux/.test(ua) ? "Linux" : /iPhone|iPad/.test(ua) ? "iOS" : "—" },
        { k: "Mobile", v: /Mobile|Android|iPhone/.test(ua) ? "Yes" : "No" },
      ]);
    },
  },
  {
    id: "ip-validate", name: "IP Address Validator", description: "Validate IPv4 and IPv6 addresses.",
    category: "developer", icon: ShieldCheck, accent: "ink",
    fields: [{ key: "input", label: "IP", type: "text", placeholder: "192.168.0.1" }],
    run: v => {
      const s = String(v.input ?? "").trim();
      const v4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(s) && s.split(".").every(o => +o >= 0 && +o <= 255);
      const v6 = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i.test(s);
      return stats([{ k: "IPv4", v: v4 ? "Valid ✓" : "—" }, { k: "IPv6", v: v6 ? "Valid ✓" : "—" }, { k: "Length", v: s.length }]);
    },
  },
  {
    id: "cron-explain", name: "Cron Expression Explainer", description: "Decode a 5-field cron expression in plain English.",
    category: "developer", icon: Clock, accent: "paper",
    fields: [{ key: "input", label: "Cron", type: "text", placeholder: "*/5 * * * *", default: "*/5 * * * *" }],
    run: v => {
      const parts = String(v.input ?? "").trim().split(/\s+/);
      if (parts.length !== 5) return err("Need 5 fields: minute hour day month weekday");
      const [m, h, d, mo, w] = parts;
      const desc = (f: string, name: string, all: string) =>
        f === "*" ? `every ${name}` : f.startsWith("*/") ? `every ${f.slice(2)} ${name}s` : `at ${name} ${f}`;
      return txt(`Runs: ${desc(m,"minute","minute")}, ${desc(h,"hour","hour")}, ${desc(d,"day","day")}, ${desc(mo,"month","month")}, ${desc(w,"weekday","weekday")}.`);
    },
  },
  {
    id: "ascii-table", name: "ASCII Table", description: "Look up the ASCII code of any character.",
    category: "developer", icon: TypeIcon, accent: "stone",
    fields: [{ key: "input", label: "Character", type: "text", placeholder: "A", default: "A" }],
    run: v => {
      const c = String(v.input ?? "").charAt(0); if (!c) return err("Type a character");
      const code = c.charCodeAt(0);
      return stats([{ k: "Char", v: c }, { k: "Decimal", v: code }, { k: "Hex", v: "0x" + code.toString(16) }, { k: "Octal", v: "0o" + code.toString(8) }, { k: "Binary", v: code.toString(2) }, { k: "Unicode", v: "U+" + code.toString(16).toUpperCase().padStart(4, "0") }]);
    },
  },
  {
    id: "char-codes", name: "String → Char Codes", description: "Output decimal char codes for every character.",
    category: "developer", icon: HashIcon, accent: "mist",
    fields: [TEXT()],
    run: v => txt(Array.from(String(v.input ?? "")).map(c => c.charCodeAt(0)).join(", ")),
  },
  {
    id: "string-from-codes", name: "Char Codes → String", description: "Reverse: convert a list of decimal codes to a string.",
    category: "developer", icon: HashIcon, accent: "sand",
    fields: [TEXT("input","Codes","72, 101, 108, 108, 111",4)],
    run: v => {
      try { return txt(String(v.input ?? "").split(/[,\s]+/).filter(Boolean).map(n => String.fromCharCode(Number(n))).join("")); }
      catch { return err("Invalid input"); }
    },
  },
  {
    id: "regex-escape", name: "Regex Escape", description: "Escape special regex characters in a string.",
    category: "developer", icon: Regex, accent: "olive",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  },
  {
    id: "string-length", name: "String Length", description: "Count chars, bytes (UTF-8), code points.",
    category: "developer", icon: Sigma, accent: "ink",
    fields: [TEXT()],
    run: v => {
      const s = String(v.input ?? "");
      return stats([
        { k: "Characters", v: s.length },
        { k: "Code points", v: Array.from(s).length },
        { k: "UTF-8 bytes", v: new Blob([s]).size },
        { k: "Lines", v: s.split("\n").length },
      ]);
    },
  },
  {
    id: "uuid-validate", name: "UUID Validator", description: "Validate a UUID and detect its version.",
    category: "developer", icon: Fingerprint, accent: "paper",
    fields: [{ key: "input", label: "UUID", type: "text", placeholder: "xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx" }],
    run: v => {
      const s = String(v.input ?? "").trim();
      const ok = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
      return stats([{ k: "Valid", v: ok ? "Yes ✓" : "No" }, { k: "Version", v: ok ? s.charAt(14) : "—" }, { k: "Length", v: s.length }]);
    },
  },
  {
    id: "json-validate", name: "JSON Validator", description: "Check if input is valid JSON with size info.",
    category: "developer", icon: ShieldCheck, accent: "stone",
    fields: [TEXT()],
    run: v => {
      try {
        const o = JSON.parse(String(v.input ?? ""));
        const t = Array.isArray(o) ? "array" : typeof o;
        return stats([{ k: "Valid", v: "Yes ✓" }, { k: "Type", v: t }, { k: "Bytes", v: new Blob([JSON.stringify(o)]).size }, { k: "Keys", v: t === "object" && o ? Object.keys(o).length : "—" }]);
      } catch (e: any) { return err(e.message); }
    },
  },
  {
    id: "csv-validate", name: "CSV Validator", description: "Detect column count and inconsistent rows.",
    category: "developer", icon: Table2, accent: "mist",
    fields: [TEXT()],
    run: v => {
      const lines = String(v.input ?? "").trim().split("\n").filter(Boolean);
      if (lines.length === 0) return err("No data");
      const cols = lines[0].split(",").length;
      const bad = lines.findIndex(l => l.split(",").length !== cols);
      return stats([{ k: "Rows", v: lines.length }, { k: "Columns", v: cols }, { k: "Mismatch", v: bad === -1 ? "None ✓" : `Line ${bad + 1}` }]);
    },
  },
  {
    id: "json-csv", name: "JSON → CSV", description: "Convert an array of objects to CSV.",
    category: "developer", icon: Table2, accent: "sand",
    fields: [TEXT()],
    run: v => {
      try {
        const arr = JSON.parse(String(v.input ?? ""));
        if (!Array.isArray(arr) || arr.length === 0) return err("Need a non-empty array");
        const keys = Array.from(new Set(arr.flatMap((o: any) => Object.keys(o))));
        const rows = [keys.join(","), ...arr.map((o: any) => keys.map(k => JSON.stringify(o[k] ?? "")).join(","))];
        return txt(rows.join("\n"));
      } catch (e: any) { return err(e.message); }
    },
  },
  {
    id: "xml-format", name: "XML Beautifier", description: "Indent XML/HTML for easy reading.",
    category: "developer", icon: Code2, accent: "olive",
    fields: [TEXT()],
    run: v => {
      const xml = String(v.input ?? "").replace(/>\s+</g, "><").replace(/></g, ">\n<");
      let pad = 0; const out = xml.split("\n").map(l => {
        if (/^<\/[^>]+>/.test(l)) pad = Math.max(0, pad - 1);
        const line = "  ".repeat(pad) + l;
        if (/^<[^!?\/][^>]*[^/]>$/.test(l)) pad++;
        return line;
      }).join("\n");
      return txt(out);
    },
  },
  {
    id: "color-hex-rgb", name: "HEX → RGB", description: "Convert HEX colors to RGB notation.",
    category: "developer", icon: Pipette, accent: "ink",
    fields: [{ key: "input", label: "Hex", type: "text", placeholder: "#3b82f6", default: "#3b82f6" }],
    run: v => {
      const m = String(v.input ?? "").trim().replace("#", "").match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
      if (!m) return err("Invalid hex");
      const h = m[1].length === 3 ? m[1].split("").map(c => c + c).join("") : m[1];
      const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      return [txt(`rgb(${r}, ${g}, ${b})`), stats([{ k: "R", v: r }, { k: "G", v: g }, { k: "B", v: b }])];
    },
  },
  {
    id: "color-rgb-hex", name: "RGB → HEX", description: "Convert RGB triplets to HEX.",
    category: "developer", icon: Pipette, accent: "stone",
    fields: [
      { key: "r", label: "R (0-255)", type: "slider", min: 0, max: 255, default: 59 },
      { key: "g", label: "G (0-255)", type: "slider", min: 0, max: 255, default: 130 },
      { key: "b", label: "B (0-255)", type: "slider", min: 0, max: 255, default: 246 },
    ],
    run: v => {
      const h = (n: number) => Math.max(0, Math.min(255, Math.round(Number(n) || 0))).toString(16).padStart(2, "0");
      return txt(`#${h(v.r)}${h(v.g)}${h(v.b)}`.toUpperCase());
    },
  },
  {
    id: "tailwind-color", name: "Tailwind Color Lookup", description: "Lookup the HEX for a Tailwind color name.",
    category: "developer", icon: Palette, accent: "paper",
    fields: [
      { key: "name", label: "Color", type: "select", default: "blue", options: ["slate","gray","zinc","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose"].map(n => ({ value: n, label: n })) },
      { key: "shade", label: "Shade", type: "select", default: "500", options: [50,100,200,300,400,500,600,700,800,900,950].map(s => ({ value: String(s), label: String(s) })) },
    ],
    run: v => {
      const T: Record<string, Record<string, string>> = {
        blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
        red: { 500: "#ef4444", 600: "#dc2626" }, green: { 500: "#22c55e" }, gray: { 500: "#6b7280" },
      };
      const hex = T[v.name]?.[v.shade] ?? "(install full table)";
      return txt(`${v.name}-${v.shade} → ${hex}`);
    },
  },
  {
    id: "json-xml", name: "JSON → XML", description: "Convert a JSON object to XML.",
    category: "developer", icon: FileCode2, accent: "mist",
    fields: [TEXT()],
    run: v => {
      try {
        const obj = JSON.parse(String(v.input ?? ""));
        const toXML = (o: any, name = "root"): string => {
          if (Array.isArray(o)) return o.map(x => toXML(x, "item")).join("");
          if (o && typeof o === "object") return `<${name}>${Object.entries(o).map(([k, val]) => toXML(val, k)).join("")}</${name}>`;
          return `<${name}>${String(o)}</${name}>`;
        };
        return txt(toXML(obj));
      } catch (e: any) { return err(e.message); }
    },
  },
  {
    id: "slugify-advanced", name: "Slugify (advanced)", description: "Generate slugs with custom separators & casing.",
    category: "developer", icon: Link2, accent: "olive",
    fields: [
      TEXT("input", "Text", "My Awesome Article!", 4),
      { key: "sep", label: "Separator", type: "select", default: "-", options: [{ value: "-", label: "- (dash)" }, { value: "_", label: "_ (underscore)" }, { value: ".", label: ". (dot)" }] },
      { key: "lower", label: "Lowercase", type: "checkbox", default: true },
    ],
    run: v => {
      let s = String(v.input ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, v.sep).replace(new RegExp(`^${v.sep}+|${v.sep}+$`, "g"), "");
      if (v.lower) s = s.toLowerCase();
      return txt(s);
    },
  },
  {
    id: "mac-vendor", name: "MAC Format Convert", description: "Reformat MAC addresses (colon, dash, dot, plain).",
    category: "developer", icon: Cog, accent: "paper",
    fields: [
      { key: "input", label: "MAC", type: "text", placeholder: "00:1B:44:11:3A:B7" },
      { key: "fmt", label: "Format", type: "select", default: ":", options: [{ value: ":", label: "AA:BB:CC:DD:EE:FF" }, { value: "-", label: "AA-BB-CC-DD-EE-FF" }, { value: ".", label: "AABB.CCDD.EEFF" }, { value: "", label: "AABBCCDDEEFF" }] },
    ],
    run: v => {
      const clean = String(v.input ?? "").replace(/[^0-9a-f]/gi, "").toUpperCase();
      if (clean.length !== 12) return err("Need 12 hex characters");
      if (v.fmt === ".") return txt(`${clean.slice(0,4)}.${clean.slice(4,8)}.${clean.slice(8,12)}`);
      if (v.fmt === "")  return txt(clean);
      return txt(clean.match(/.{2}/g)!.join(v.fmt));
    },
  },
];

/* ================================================================== *
 * 2) DESIGN & COLOR                                                  *
 * ================================================================== */
const design: SimpleToolDef[] = [
  {
    id: "color-tints", name: "Tints & Shades", description: "Generate 10 tints and 10 shades of any color.",
    category: "creative", icon: Droplet, accent: "stone",
    fields: [{ key: "color", label: "Base color", type: "color", default: "#3b82f6" }],
    run: v => {
      const hex = String(v.color || "#3b82f6").replace("#", "");
      const r = parseInt(hex.slice(0,2), 16), g = parseInt(hex.slice(2,4), 16), b = parseInt(hex.slice(4,6), 16);
      const mix = (c: number, with_: number, p: number) => Math.round(c + (with_ - c) * p);
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      const lines: string[] = ["TINTS (mix with white):"];
      for (let i = 1; i <= 10; i++) { const p = i / 11; lines.push(`  ${i*10}% → #${toHex(mix(r,255,p))}${toHex(mix(g,255,p))}${toHex(mix(b,255,p))}`); }
      lines.push("\nSHADES (mix with black):");
      for (let i = 1; i <= 10; i++) { const p = i / 11; lines.push(`  ${i*10}% → #${toHex(mix(r,0,p))}${toHex(mix(g,0,p))}${toHex(mix(b,0,p))}`); }
      return txt(lines.join("\n"));
    },
  },
  {
    id: "color-complement", name: "Complementary Color", description: "Generate the complementary (opposite) color.",
    category: "creative", icon: Palette, accent: "ink",
    fields: [{ key: "color", label: "Color", type: "color", default: "#3b82f6" }],
    run: v => {
      const hex = String(v.color || "#000000").replace("#", "");
      const r = 255 - parseInt(hex.slice(0,2), 16), g = 255 - parseInt(hex.slice(2,4), 16), b = 255 - parseInt(hex.slice(4,6), 16);
      const out = "#" + [r,g,b].map(n => n.toString(16).padStart(2,"0")).join("");
      return txt(`Complement: ${out}`);
    },
  },
  {
    id: "css-glassmorphism", name: "Glassmorphism CSS", description: "Generate a glass / frosted card CSS snippet.",
    category: "creative", icon: Aperture, accent: "paper",
    fields: [
      { key: "blur", label: "Blur (px)", type: "slider", min: 0, max: 40, default: 12 },
      { key: "opacity", label: "Opacity (%)", type: "slider", min: 0, max: 100, default: 25 },
      { key: "tint", label: "Tint", type: "color", default: "#ffffff" },
    ],
    run: v => txt(
`background: ${v.tint}${Math.round((Number(v.opacity)/100)*255).toString(16).padStart(2,"0")};
backdrop-filter: blur(${v.blur}px) saturate(160%);
-webkit-backdrop-filter: blur(${v.blur}px) saturate(160%);
border: 1px solid rgba(255,255,255,0.18);
border-radius: 16px;`
    ),
  },
  {
    id: "css-clamp", name: "CSS clamp() Builder", description: "Build a fluid clamp() value for fluid typography.",
    category: "creative", icon: Ruler, accent: "stone",
    fields: [
      { key: "min", label: "Min (px)", type: "number", default: 16 },
      { key: "preferred", label: "Preferred (vw)", type: "number", default: 2.5 },
      { key: "max", label: "Max (px)", type: "number", default: 32 },
    ],
    run: v => txt(`font-size: clamp(${v.min}px, ${v.preferred}vw + 1rem, ${v.max}px);`),
  },
  {
    id: "css-aspect", name: "Aspect Ratio Calc", description: "Find dimensions for a given aspect ratio.",
    category: "creative", icon: Ruler, accent: "mist",
    fields: [
      { key: "w", label: "Width ratio", type: "number", default: 16 },
      { key: "h", label: "Height ratio", type: "number", default: 9 },
      { key: "size", label: "Width (px)", type: "number", default: 1280 },
    ],
    run: v => {
      const w = Number(v.w) || 1, h = Number(v.h) || 1, s = Number(v.size) || 0;
      return txt(`Resulting height: ${(s * h / w).toFixed(1)}px\nCSS: aspect-ratio: ${w} / ${h};`);
    },
  },
  {
    id: "css-easing", name: "CSS Easing Library", description: "Copy popular cubic-bezier easings.",
    category: "creative", icon: Wand2, accent: "olive",
    fields: [{ key: "name", label: "Curve", type: "select", default: "out-expo", options: [
      { value: "out-expo", label: "Out Expo" }, { value: "in-out-quart", label: "In-Out Quart" },
      { value: "spring", label: "Spring" }, { value: "anticipate", label: "Anticipate" }, { value: "smooth", label: "Smooth" },
    ]}],
    run: v => {
      const map: Record<string, string> = {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "anticipate": "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      };
      return txt(`transition-timing-function: ${map[v.name]};`);
    },
  },
  {
    id: "color-name", name: "Color Name Lookup", description: "Find the closest CSS named color.",
    category: "creative", icon: Bookmark, accent: "ink",
    fields: [{ key: "color", label: "Color", type: "color", default: "#3b82f6" }],
    run: v => {
      const NAMES: Record<string, string> = { red: "#ff0000", orange: "#ffa500", yellow: "#ffff00", green: "#008000", blue: "#0000ff", purple: "#800080", pink: "#ffc0cb", teal: "#008080", cyan: "#00ffff", magenta: "#ff00ff", lime: "#00ff00", navy: "#000080", olive: "#808000", maroon: "#800000", silver: "#c0c0c0", gray: "#808080", black: "#000000", white: "#ffffff", coral: "#ff7f50", salmon: "#fa8072", gold: "#ffd700", indigo: "#4b0082", violet: "#ee82ee", turquoise: "#40e0d0" };
      const tgt = String(v.color || "#000000").replace("#", "");
      const t = [parseInt(tgt.slice(0,2),16), parseInt(tgt.slice(2,4),16), parseInt(tgt.slice(4,6),16)];
      let best = "", bd = Infinity;
      Object.entries(NAMES).forEach(([n, hx]) => {
        const h = hx.replace("#",""); const c = [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
        const d = Math.hypot(c[0]-t[0], c[1]-t[1], c[2]-t[2]);
        if (d < bd) { bd = d; best = n; }
      });
      return txt(`Closest CSS named color: ${best} (${NAMES[best]})`);
    },
  },
  {
    id: "css-text-shadow", name: "Text Shadow Generator", description: "Generate a CSS text-shadow snippet.",
    category: "creative", icon: TypeIcon, accent: "sand",
    fields: [
      { key: "x", label: "X (px)", type: "slider", min: -20, max: 20, default: 2 },
      { key: "y", label: "Y (px)", type: "slider", min: -20, max: 20, default: 2 },
      { key: "b", label: "Blur (px)", type: "slider", min: 0, max: 40, default: 4 },
      { key: "color", label: "Color", type: "color", default: "#000000" },
    ],
    run: v => txt(`text-shadow: ${v.x}px ${v.y}px ${v.b}px ${v.color};`),
  },
  {
    id: "css-border-radius", name: "Border Radius Studio", description: "Generate organic border-radius blob shapes.",
    category: "creative", icon: Shapes, accent: "olive",
    fields: [
      { key: "tl", label: "Top-left", type: "slider", min: 0, max: 100, default: 30 },
      { key: "tr", label: "Top-right", type: "slider", min: 0, max: 100, default: 70 },
      { key: "br", label: "Bottom-right", type: "slider", min: 0, max: 100, default: 50 },
      { key: "bl", label: "Bottom-left", type: "slider", min: 0, max: 100, default: 60 },
    ],
    run: v => txt(`border-radius: ${v.tl}% ${100-Number(v.tl)}% ${v.tr}% ${100-Number(v.tr)}% / ${v.bl}% ${v.br}% ${100-Number(v.br)}% ${100-Number(v.bl)}%;`),
  },
  {
    id: "css-filter", name: "CSS Filter Builder", description: "Build a CSS filter chain.",
    category: "creative", icon: Wand2, accent: "ink",
    fields: [
      { key: "blur", label: "Blur (px)", type: "slider", min: 0, max: 20, default: 0 },
      { key: "bright", label: "Brightness (%)", type: "slider", min: 0, max: 200, default: 100 },
      { key: "contrast", label: "Contrast (%)", type: "slider", min: 0, max: 200, default: 100 },
      { key: "grayscale", label: "Grayscale (%)", type: "slider", min: 0, max: 100, default: 0 },
      { key: "hue", label: "Hue rotate (deg)", type: "slider", min: 0, max: 360, default: 0 },
    ],
    run: v => txt(`filter: blur(${v.blur}px) brightness(${v.bright}%) contrast(${v.contrast}%) grayscale(${v.grayscale}%) hue-rotate(${v.hue}deg);`),
  },
  {
    id: "css-grid-gen", name: "CSS Grid Generator", description: "Generate a responsive CSS grid template.",
    category: "creative", icon: Layers, accent: "paper",
    fields: [
      { key: "cols", label: "Columns", type: "slider", min: 1, max: 12, default: 3 },
      { key: "gap", label: "Gap (px)", type: "slider", min: 0, max: 64, default: 16 },
    ],
    run: v => txt(`display: grid;\ngrid-template-columns: repeat(${v.cols}, minmax(0, 1fr));\ngap: ${v.gap}px;`),
  },
  {
    id: "css-flex-gen", name: "Flexbox Cheatsheet", description: "Quick reference for flex alignment.",
    category: "creative", icon: Layers, accent: "stone",
    fields: [
      { key: "dir", label: "Direction", type: "select", default: "row", options: ["row","column","row-reverse","column-reverse"].map(x => ({ value: x, label: x })) },
      { key: "j", label: "Justify", type: "select", default: "center", options: ["flex-start","center","flex-end","space-between","space-around","space-evenly"].map(x => ({ value: x, label: x })) },
      { key: "a", label: "Align", type: "select", default: "center", options: ["stretch","flex-start","center","flex-end","baseline"].map(x => ({ value: x, label: x })) },
    ],
    run: v => txt(`display: flex;\nflex-direction: ${v.dir};\njustify-content: ${v.j};\nalign-items: ${v.a};`),
  },
  {
    id: "color-mixer", name: "Color Mixer", description: "Mix two colors at any ratio.",
    category: "creative", icon: PaintBucket, accent: "mist",
    fields: [
      { key: "a", label: "Color A", type: "color", default: "#3b82f6" },
      { key: "b", label: "Color B", type: "color", default: "#f59e0b" },
      { key: "p", label: "Mix % toward B", type: "slider", min: 0, max: 100, default: 50 },
    ],
    run: v => {
      const x = (s: string) => [1,3,5].map(i => parseInt(s.slice(i, i+2), 16));
      const A = x(v.a), B = x(v.b), p = Number(v.p)/100;
      const mix = A.map((c, i) => Math.round(c + (B[i]-c)*p)).map(n => n.toString(16).padStart(2,"0")).join("");
      return txt(`#${mix}`);
    },
  },
  {
    id: "color-luminance", name: "Color Luminance", description: "Get relative luminance & accessible text color.",
    category: "creative", icon: Eye, accent: "sand",
    fields: [{ key: "color", label: "Color", type: "color", default: "#3b82f6" }],
    run: v => {
      const h = String(v.color).replace("#", "");
      const [r,g,b] = [0,2,4].map(i => {
        const c = parseInt(h.slice(i, i+2), 16) / 255;
        return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
      });
      const L = 0.2126*r + 0.7152*g + 0.0722*b;
      return stats([{ k: "Luminance", v: L.toFixed(4) }, { k: "Best text", v: L > 0.5 ? "Black" : "White" }, { k: "Type", v: L > 0.5 ? "Light" : "Dark" }]);
    },
  },
  {
    id: "css-keyframes", name: "Keyframes Generator", description: "Pre-built CSS keyframe animations.",
    category: "creative", icon: Wand2, accent: "olive",
    fields: [{ key: "anim", label: "Animation", type: "select", default: "fade-in", options: [
      { value: "fade-in", label: "Fade in" }, { value: "slide-up", label: "Slide up" }, { value: "scale-in", label: "Scale in" }, { value: "shake", label: "Shake" }, { value: "bounce", label: "Bounce" },
    ]}],
    run: v => {
      const A: Record<string, string> = {
        "fade-in": "@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }\nanimation: fade-in 400ms ease-out;",
        "slide-up": "@keyframes slide-up { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }\nanimation: slide-up 500ms cubic-bezier(0.16,1,0.3,1);",
        "scale-in": "@keyframes scale-in { from { transform: scale(.95); opacity:0 } to { transform: scale(1); opacity:1 } }\nanimation: scale-in 300ms ease-out;",
        "shake": "@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }\nanimation: shake 400ms;",
        "bounce": "@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }\nanimation: bounce 600ms ease-in-out infinite;",
      };
      return txt(A[v.anim]);
    },
  },
  {
    id: "color-from-image", name: "Average Image Color", description: "Sample the average color from any image.",
    category: "creative", icon: ImageIcon, accent: "ink",
    fields: [TEXT("input", "Image URL", "https://example.com/photo.jpg", 2)],
    live: false, runLabel: "Sample",
    run: () => txt("Use the dedicated Color Picker / image tools — preview is canvas-based and runs from a chosen file."),
  },
  {
    id: "tailwind-shadow", name: "Tailwind Shadow Lookup", description: "Lookup the CSS for a Tailwind shadow class.",
    category: "creative", icon: Shapes, accent: "stone",
    fields: [{ key: "name", label: "Class", type: "select", default: "md", options: ["sm","DEFAULT","md","lg","xl","2xl","inner","none"].map(s => ({ value: s, label: "shadow-" + s })) }],
    run: v => {
      const S: Record<string, string> = {
        "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)", "none": "none",
      };
      return txt(`box-shadow: ${S[v.name]};`);
    },
  },
];

/* ================================================================== *
 * 3) IMAGE & MEDIA helpers (text-only — heavy ones live as pages)    *
 * ================================================================== */
const media: SimpleToolDef[] = [
  {
    id: "exif-stub", name: "Image Dimensions Calc", description: "Compute scaled dimensions from a base size and ratio.",
    category: "image", icon: Scaling, accent: "stone",
    fields: [
      { key: "w", label: "Original W", type: "number", default: 1920 },
      { key: "h", label: "Original H", type: "number", default: 1080 },
      { key: "scale", label: "Scale (%)", type: "slider", min: 1, max: 200, default: 50 },
    ],
    run: v => {
      const w = Math.round((Number(v.w) || 0) * Number(v.scale) / 100);
      const h = Math.round((Number(v.h) || 0) * Number(v.scale) / 100);
      return stats([{ k: "Width", v: w }, { k: "Height", v: h }, { k: "Megapixels", v: ((w*h)/1e6).toFixed(2) }]);
    },
  },
  {
    id: "image-srcset", name: "<img srcset> Generator", description: "Build a responsive srcset from a base image URL.",
    category: "image", icon: ImageIcon, accent: "ink",
    fields: [
      { key: "url", label: "Base URL (use {w} placeholder)", type: "text", default: "https://cdn.site.com/img-{w}.jpg" },
      { key: "sizes", label: "Widths (comma-sep)", type: "text", default: "320,640,1024,1536,1920" },
    ],
    run: v => {
      const list = String(v.sizes ?? "").split(",").map(s => s.trim()).filter(Boolean);
      return txt(`srcset="${list.map(w => `${String(v.url).replace("{w}", w)} ${w}w`).join(", ")}"\nsizes="(max-width: 768px) 100vw, 50vw"`);
    },
  },
  {
    id: "video-bitrate", name: "Video Bitrate Calc", description: "Estimate file size from bitrate × duration.",
    category: "image", icon: ScanLine, accent: "paper",
    fields: [
      { key: "kbps", label: "Bitrate (kbps)", type: "number", default: 5000 },
      { key: "minutes", label: "Duration (min)", type: "number", default: 10 },
    ],
    run: v => {
      const bytes = (Number(v.kbps) * 1000 / 8) * (Number(v.minutes) * 60);
      return stats([
        { k: "MB", v: (bytes / 1024 / 1024).toFixed(1) },
        { k: "GB", v: (bytes / 1024 / 1024 / 1024).toFixed(2) },
      ]);
    },
  },
  {
    id: "audio-bpm", name: "BPM ↔ Time", description: "Convert BPM to delay time and frequency.",
    category: "image", icon: Volume2, accent: "olive",
    fields: [{ key: "bpm", label: "BPM", type: "number", default: 120 }],
    run: v => {
      const ms = 60000 / (Number(v.bpm) || 1);
      return stats([
        { k: "1/4 note", v: ms.toFixed(1) + " ms" },
        { k: "1/8 note", v: (ms / 2).toFixed(1) + " ms" },
        { k: "1/16 note", v: (ms / 4).toFixed(1) + " ms" },
        { k: "Hz", v: (1000 / ms).toFixed(2) },
      ]);
    },
  },
  {
    id: "px-rem", name: "Pixel ↔ Rem", description: "Convert between pixels and rem (16px base).",
    category: "image", icon: Ruler, accent: "mist",
    fields: [
      { key: "val", label: "Value", type: "number", default: 16 },
      { key: "from", label: "From", type: "select", default: "px", options: [{ value: "px", label: "px" }, { value: "rem", label: "rem" }] },
      { key: "base", label: "Base (px)", type: "number", default: 16 },
    ],
    run: v => {
      const base = Number(v.base) || 16;
      const r = v.from === "px" ? `${(Number(v.val) / base).toFixed(4)} rem` : `${(Number(v.val) * base).toFixed(2)} px`;
      return txt(r);
    },
  },
];

/* ================================================================== *
 * 4) PRODUCTIVITY & TEXT                                             *
 * ================================================================== */
const productivity: SimpleToolDef[] = [
  {
    id: "alphabetize", name: "Alphabetize Lines", description: "Sort lines A→Z, ignoring case.",
    category: "text", icon: ArrowDownAZ, accent: "stone",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("\n").sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join("\n")),
  },
  {
    id: "trim-lines", name: "Trim Each Line", description: "Strip leading/trailing whitespace from every line.",
    category: "text", icon: Eraser, accent: "paper",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("\n").map(l => l.trim()).join("\n")),
  },
  {
    id: "extract-emails", name: "Extract Emails", description: "Find every email address in a block of text.",
    category: "text", icon: Target, accent: "ink",
    fields: [TEXT()],
    run: v => {
      const found = String(v.input ?? "").match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
      return [stats([{ k: "Found", v: found.length }]), txt(found.join("\n"))];
    },
  },
  {
    id: "extract-urls", name: "Extract URLs", description: "Find every http(s) URL in text.",
    category: "text", icon: Link2, accent: "sand",
    fields: [TEXT()],
    run: v => {
      const found = String(v.input ?? "").match(/https?:\/\/[^\s)\]]+/g) ?? [];
      return [stats([{ k: "Found", v: found.length }]), txt(found.join("\n"))];
    },
  },
  {
    id: "extract-numbers", name: "Extract Numbers", description: "Pull all numeric values from text.",
    category: "text", icon: HashIcon, accent: "mist",
    fields: [TEXT()],
    run: v => {
      const found: string[] = String(v.input ?? "").match(/-?\d+(\.\d+)?/g) ?? [];
      let sum = 0; for (const n of found) sum += Number(n);
      return [stats([{ k: "Count", v: found.length }, { k: "Sum", v: sum.toFixed(2) }]), txt(found.join("\n"))];
    },
  },
  {
    id: "remove-emojis", name: "Remove Emojis", description: "Strip all emoji from text.",
    category: "text", icon: Smile, accent: "olive",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").replace(/[\p{Extended_Pictographic}]/gu, "")),
  },
  {
    id: "remove-accents", name: "Remove Accents", description: "Convert accented characters to plain Latin.",
    category: "text", icon: Eraser, accent: "paper",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
  },
  {
    id: "smart-quotes", name: "Smart Quotes Toggle", description: "Convert straight quotes to typographic ones (or back).",
    category: "text", icon: Quote, accent: "ink",
    fields: [TEXT(), { key: "to", label: "Direction", type: "select", default: "smart", options: [{ value: "smart", label: "Straight → Smart" }, { value: "straight", label: "Smart → Straight" }] }],
    run: v => {
      let s = String(v.input ?? "");
      if (v.to === "smart") {
        s = s.replace(/(\w)'(\w)/g, "$1\u2019$2").replace(/(^|[\s(])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/(^|[\s(])'/g, "$1\u2018").replace(/'/g, "\u2019");
      } else {
        s = s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      }
      return txt(s);
    },
  },
  {
    id: "title-case", name: "Title Case", description: "Convert text to Title Case (English rules).",
    category: "text", icon: CaseSensitive, accent: "stone",
    fields: [TEXT()],
    run: v => {
      const small = new Set(["a","an","the","and","but","or","on","at","to","for","of","in","by","with"]);
      return txt(String(v.input ?? "").toLowerCase().split(/(\s+)/).map((w, i, arr) => {
        if (/^\s+$/.test(w)) return w;
        if (i !== 0 && i !== arr.length - 1 && small.has(w)) return w;
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(""));
    },
  },
  {
    id: "sentence-case", name: "Sentence case", description: "Capitalize the first letter of each sentence.",
    category: "text", icon: CaseSensitive, accent: "mist",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())),
  },
  {
    id: "alternate-case", name: "aLtErNaTiNg CaSe", description: "Alternate upper and lower case letters.",
    category: "text", icon: CaseSensitive, accent: "sand",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").split("").map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join("")),
  },
  {
    id: "snake-case", name: "snake_case", description: "Convert text to snake_case identifiers.",
    category: "text", icon: CaseSensitive, accent: "paper",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").trim().replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\W]+/g, "_").toLowerCase()),
  },
  {
    id: "kebab-case", name: "kebab-case", description: "Convert text to kebab-case.",
    category: "text", icon: CaseSensitive, accent: "olive",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").trim().replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s\W]+/g, "-").toLowerCase()),
  },
  {
    id: "camel-case", name: "camelCase", description: "Convert text to camelCase identifier.",
    category: "text", icon: CaseSensitive, accent: "ink",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())),
  },
  {
    id: "pascal-case", name: "PascalCase", description: "Convert text to PascalCase.",
    category: "text", icon: CaseSensitive, accent: "stone",
    fields: [TEXT()],
    run: v => {
      const c = String(v.input ?? "").toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase());
      return txt(c.charAt(0).toUpperCase() + c.slice(1));
    },
  },
  {
    id: "constant-case", name: "CONSTANT_CASE", description: "Convert text to UPPER_SNAKE constant case.",
    category: "text", icon: CaseSensitive, accent: "mist",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").trim().replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\W]+/g, "_").toUpperCase()),
  },
  {
    id: "dot-case", name: "dot.case", description: "Convert text to dot.separated.case.",
    category: "text", icon: CaseSensitive, accent: "sand",
    fields: [TEXT()],
    run: v => txt(String(v.input ?? "").trim().replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[\s\W]+/g, ".").toLowerCase()),
  },
  {
    id: "wrap-text", name: "Wrap Text Width", description: "Hard-wrap text to N characters per line.",
    category: "text", icon: AlignLeft, accent: "paper",
    fields: [TEXT(), { key: "width", label: "Width", type: "number", default: 80 }],
    run: v => {
      const w = Math.max(1, Number(v.width) || 80);
      return txt(String(v.input ?? "").split("\n").map(line => {
        const words = line.split(" "); const out: string[] = []; let cur = "";
        words.forEach(word => {
          if ((cur + " " + word).trim().length > w) { if (cur) out.push(cur); cur = word; } else { cur = (cur ? cur + " " : "") + word; }
        });
        if (cur) out.push(cur); return out.join("\n");
      }).join("\n"));
    },
  },
  {
    id: "indent-text", name: "Indent / Outdent", description: "Add or remove N spaces at the start of every line.",
    category: "text", icon: AlignLeft, accent: "olive",
    fields: [TEXT(), { key: "n", label: "Spaces", type: "number", default: 2 }, { key: "remove", label: "Remove instead", type: "checkbox", default: false }],
    run: v => {
      const n = Math.max(0, Number(v.n) || 0); const pad = " ".repeat(n);
      return txt(String(v.input ?? "").split("\n").map(l => v.remove ? l.replace(new RegExp(`^ {0,${n}}`), "") : pad + l).join("\n"));
    },
  },
  {
    id: "word-frequency", name: "Word Frequency", description: "Count how often each word appears.",
    category: "text", icon: Sigma, accent: "ink",
    fields: [TEXT()],
    run: v => {
      const map = new Map<string, number>();
      String(v.input ?? "").toLowerCase().match(/[a-z']+/g)?.forEach(w => map.set(w, (map.get(w) ?? 0) + 1));
      const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 50);
      return txt(sorted.map(([w, c]) => `${c.toString().padStart(4, " ")}  ${w}`).join("\n"));
    },
  },
  {
    id: "char-frequency", name: "Character Frequency", description: "Count how often each character appears.",
    category: "text", icon: Sigma, accent: "paper",
    fields: [TEXT()],
    run: v => {
      const map = new Map<string, number>();
      Array.from(String(v.input ?? "")).forEach(c => map.set(c, (map.get(c) ?? 0) + 1));
      const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 50);
      return txt(sorted.map(([c, n]) => `${n.toString().padStart(4, " ")}  ${JSON.stringify(c)}`).join("\n"));
    },
  },
  {
    id: "reading-time", name: "Reading Time", description: "Estimate reading and speaking duration.",
    category: "text", icon: Coffee, accent: "stone",
    fields: [TEXT()],
    run: v => {
      const words = (String(v.input ?? "").trim().match(/\S+/g) ?? []).length;
      return stats([
        { k: "Words", v: words },
        { k: "Read (200wpm)", v: Math.ceil(words / 200) + " min" },
        { k: "Speak (130wpm)", v: Math.ceil(words / 130) + " min" },
        { k: "Audio est.", v: (words / 130).toFixed(1) + " min" },
      ]);
    },
  },
  {
    id: "lipsum-pro", name: "Lorem Ipsum (paragraphs)", description: "Generate N paragraphs of placeholder Latin.",
    category: "text", icon: ScrollText, accent: "mist",
    fields: [{ key: "n", label: "Paragraphs", type: "slider", min: 1, max: 20, default: 3 }],
    run: v => {
      const para = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
      return txt(Array.from({ length: Number(v.n) || 1 }, () => para).join("\n\n"));
    },
  },
  {
    id: "fake-name", name: "Fake Name Generator", description: "Generate random fake names for demos.",
    category: "text", icon: Smile, accent: "sand",
    live: false, runLabel: "Generate",
    fields: [{ key: "n", label: "How many", type: "slider", min: 1, max: 50, default: 10 }],
    run: v => {
      const first = ["Alex","Sam","Jordan","Taylor","Riley","Casey","Morgan","Drew","Avery","Quinn","Reese","Skyler","Hayden","Parker","Rowan","Ezra","Nova","Iris","Maya","Leo"];
      const last = ["Carter","Reed","Hayes","Brooks","Foster","Bennett","Hughes","Bailey","Walsh","Kelly","Shaw","Cole","Ross","Mason","Lane","Quinn","Ford","Hart"];
      return txt(Array.from({ length: Number(v.n) || 10 }, () => `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`).join("\n"));
    },
  },
  {
    id: "fake-address", name: "Fake Address Generator", description: "Generate random demo addresses.",
    category: "text", icon: Bookmark, accent: "paper",
    live: false, runLabel: "Generate",
    fields: [{ key: "n", label: "How many", type: "slider", min: 1, max: 30, default: 5 }],
    run: v => {
      const street = ["Maple","Oak","Elm","Cedar","Pine","Birch","Willow","Ash","Walnut","Juniper"];
      const suffix = ["St","Ave","Rd","Blvd","Ln","Way","Dr"];
      const city = ["Lakeview","Riverton","Brookside","Fairfield","Greenwood","Hillcrest","Sunnyvale"];
      return txt(Array.from({ length: Number(v.n) || 5 }, () => `${Math.floor(Math.random()*9999)} ${street[Math.floor(Math.random()*street.length)]} ${suffix[Math.floor(Math.random()*suffix.length)]}, ${city[Math.floor(Math.random()*city.length)]}, USA ${Math.floor(10000+Math.random()*89999)}`).join("\n"));
    },
  },
  {
    id: "tip-calc", name: "Tip Calculator", description: "Compute tip and per-person split.",
    category: "utility", icon: CalcIcon, accent: "ink",
    fields: [
      { key: "bill", label: "Bill", type: "number", default: 100 },
      { key: "tip", label: "Tip %", type: "slider", min: 0, max: 30, default: 18 },
      { key: "people", label: "People", type: "number", default: 2 },
    ],
    run: v => {
      const tip = (Number(v.bill) * Number(v.tip) / 100);
      const total = Number(v.bill) + tip;
      return stats([
        { k: "Tip", v: tip.toFixed(2) },
        { k: "Total", v: total.toFixed(2) },
        { k: "Per person", v: (total / Math.max(1, Number(v.people))).toFixed(2) },
      ]);
    },
  },
  {
    id: "loan-calc", name: "Loan / EMI Calculator", description: "Monthly EMI for a loan amount, rate, and term.",
    category: "utility", icon: CalcIcon, accent: "stone",
    fields: [
      { key: "p", label: "Principal", type: "number", default: 100000 },
      { key: "r", label: "Annual rate %", type: "number", default: 7.5 },
      { key: "y", label: "Years", type: "number", default: 5 },
    ],
    run: v => {
      const P = Number(v.p), r = Number(v.r) / 100 / 12, n = Number(v.y) * 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return stats([
        { k: "EMI / month", v: emi.toFixed(2) }, { k: "Total paid", v: (emi * n).toFixed(2) }, { k: "Interest", v: (emi * n - P).toFixed(2) },
      ]);
    },
  },
  {
    id: "bmi-calc", name: "BMI Calculator", description: "Compute Body Mass Index and category.",
    category: "utility", icon: Heart, accent: "paper",
    fields: [
      { key: "h", label: "Height (cm)", type: "number", default: 170 },
      { key: "w", label: "Weight (kg)", type: "number", default: 70 },
    ],
    run: v => {
      const m = Number(v.h) / 100; const bmi = Number(v.w) / (m * m);
      const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
      return stats([{ k: "BMI", v: bmi.toFixed(1) }, { k: "Category", v: cat }]);
    },
  },
  {
    id: "age-calc", name: "Age Calculator", description: "Compute age in years, months, days from a birth date.",
    category: "utility", icon: CalendarDays, accent: "mist",
    fields: [{ key: "dob", label: "Birth date (YYYY-MM-DD)", type: "text", default: "2000-01-01" }],
    run: v => {
      const d = new Date(String(v.dob)); if (isNaN(+d)) return err("Invalid date");
      const now = new Date(); const ms = +now - +d;
      const days = Math.floor(ms / 86400000);
      return stats([
        { k: "Years", v: ((now.getFullYear() - d.getFullYear()) - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)) },
        { k: "Months total", v: Math.floor(days / 30.44) }, { k: "Weeks total", v: Math.floor(days / 7) }, { k: "Days total", v: days },
      ]);
    },
  },
  {
    id: "currency-format", name: "Currency Formatter", description: "Format numbers as currency in any locale.",
    category: "utility", icon: HashIcon, accent: "olive",
    fields: [
      { key: "n", label: "Amount", type: "number", default: 1234.56 },
      { key: "ccy", label: "Currency", type: "select", default: "USD", options: ["USD","EUR","GBP","JPY","BDT","INR","CAD","AUD","CHF","CNY"].map(c => ({ value: c, label: c })) },
      { key: "loc", label: "Locale", type: "select", default: "en-US", options: ["en-US","en-GB","de-DE","fr-FR","ja-JP","bn-BD","hi-IN"].map(c => ({ value: c, label: c })) },
    ],
    run: v => txt(new Intl.NumberFormat(v.loc, { style: "currency", currency: v.ccy }).format(Number(v.n) || 0)),
  },
  {
    id: "number-format", name: "Number Formatter", description: "Format numbers with locale separators.",
    category: "utility", icon: HashIcon, accent: "ink",
    fields: [
      { key: "n", label: "Number", type: "number", default: 1234567.89 },
      { key: "loc", label: "Locale", type: "select", default: "en-US", options: ["en-US","en-IN","de-DE","fr-FR","bn-BD","ja-JP"].map(c => ({ value: c, label: c })) },
      { key: "decimals", label: "Decimals", type: "slider", min: 0, max: 6, default: 2 },
    ],
    run: v => txt(new Intl.NumberFormat(v.loc, { maximumFractionDigits: Number(v.decimals), minimumFractionDigits: Number(v.decimals) }).format(Number(v.n) || 0)),
  },
  {
    id: "spell-number", name: "Number to Words", description: "Convert numbers to English words.",
    category: "utility", icon: ScrollText, accent: "stone",
    fields: [{ key: "n", label: "Number", type: "number", default: 12345 }],
    run: v => {
      const a = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
      const b = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
      const inWords = (num: number): string => {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num/10)] + (num % 10 ? " " + a[num%10] : "");
        if (num < 1000) return a[Math.floor(num/100)] + " hundred" + (num%100 ? " " + inWords(num%100) : "");
        if (num < 1e6) return inWords(Math.floor(num/1000)) + " thousand" + (num%1000 ? " " + inWords(num%1000) : "");
        if (num < 1e9) return inWords(Math.floor(num/1e6)) + " million" + (num%1e6 ? " " + inWords(num%1e6) : "");
        return inWords(Math.floor(num/1e9)) + " billion" + (num%1e9 ? " " + inWords(num%1e9) : "");
      };
      return txt(inWords(Math.floor(Math.abs(Number(v.n) || 0))) || "zero");
    },
  },
  {
    id: "roman-numerals", name: "Roman Numerals", description: "Convert numbers to and from Roman numerals.",
    category: "utility", icon: HashIcon, accent: "paper",
    fields: [{ key: "input", label: "Number or Roman", type: "text", default: "2026" }],
    run: v => {
      const s = String(v.input ?? "").trim();
      const M = [["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]] as const;
      if (/^\d+$/.test(s)) {
        let n = Number(s); let out = ""; M.forEach(([r, val]) => { while (n >= (val as number)) { out += r; n -= val as number; } });
        return txt(out);
      }
      let i = 0, n = 0;
      while (i < s.length) {
        const two = s.slice(i, i+2); const found = M.find(([r]) => r === two) || M.find(([r]) => r === s[i]);
        if (!found) return err("Invalid input");
        n += found[1] as number; i += (found[0] as string).length;
      }
      return txt(String(n));
    },
  },
  {
    id: "percent-calc", name: "Percentage Calculator", description: "Solve common percentage questions.",
    category: "utility", icon: CalcIcon, accent: "mist",
    fields: [
      { key: "a", label: "X", type: "number", default: 25 },
      { key: "b", label: "of Y", type: "number", default: 200 },
    ],
    run: v => stats([
      { k: "X% of Y", v: ((Number(v.a)/100)*Number(v.b)).toFixed(2) },
      { k: "X is what % of Y", v: ((Number(v.a)/Number(v.b))*100).toFixed(2) + "%" },
      { k: "% change", v: (((Number(v.b)-Number(v.a))/Number(v.a))*100).toFixed(2) + "%" },
    ]),
  },
  {
    id: "countdown", name: "Days Until Date", description: "Days remaining until any future date.",
    category: "utility", icon: CalendarDays, accent: "ink",
    fields: [{ key: "d", label: "Target date (YYYY-MM-DD)", type: "text", default: "2027-01-01" }],
    run: v => {
      const d = new Date(String(v.d)); if (isNaN(+d)) return err("Invalid date");
      const ms = +d - Date.now();
      return stats([
        { k: "Days", v: Math.ceil(ms / 86400000) }, { k: "Hours", v: Math.ceil(ms / 3600000) }, { k: "Weeks", v: Math.ceil(ms / 86400000 / 7) },
      ]);
    },
  },
  {
    id: "time-zones", name: "Timezone Lookup", description: "Convert your local time to common timezones.",
    category: "utility", icon: Globe, accent: "stone",
    fields: [{ key: "iso", label: "Local ISO time", type: "text", default: new Date().toISOString().slice(0,16) }],
    run: v => {
      const d = new Date(String(v.iso)); if (isNaN(+d)) return err("Invalid date");
      const zones = ["UTC","America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Tokyo","Asia/Singapore","Asia/Dhaka","Asia/Kolkata","Australia/Sydney"];
      return txt(zones.map(z => `${z.padEnd(22, " ")} ${new Intl.DateTimeFormat("en-GB", { timeZone: z, dateStyle: "medium", timeStyle: "short" }).format(d)}`).join("\n"));
    },
  },
  {
    id: "habit-streak", name: "Habit Streak Calculator", description: "How many days/weeks/months a habit has lasted.",
    category: "utility", icon: Crown, accent: "olive",
    fields: [{ key: "start", label: "Start date (YYYY-MM-DD)", type: "text", default: "2026-01-01" }],
    run: v => {
      const d = new Date(String(v.start)); if (isNaN(+d)) return err("Invalid date");
      const days = Math.floor((Date.now() - +d) / 86400000);
      return stats([{ k: "Days", v: days }, { k: "Weeks", v: Math.floor(days/7) }, { k: "Months", v: Math.floor(days/30.44) }, { k: "Years", v: (days/365.25).toFixed(1) }]);
    },
  },
  {
    id: "speed-pace", name: "Running Pace Calc", description: "Distance, time, and pace conversions.",
    category: "utility", icon: Target, accent: "mist",
    fields: [
      { key: "km", label: "Distance (km)", type: "number", default: 10 },
      { key: "min", label: "Time (min)", type: "number", default: 50 },
    ],
    run: v => {
      const pace = Number(v.min) / Number(v.km);
      const m = Math.floor(pace), s = Math.round((pace - m) * 60);
      return stats([
        { k: "Pace /km", v: `${m}:${s.toString().padStart(2, "0")}` },
        { k: "Speed km/h", v: (Number(v.km) / (Number(v.min) / 60)).toFixed(2) },
        { k: "Mile pace", v: (pace * 1.60934).toFixed(2) + " min" },
      ]);
    },
  },
];

/* ================================================================== *
 * Aggregate, validate, export                                        *
 * ================================================================== */
export const SIMPLE_TOOLS: SimpleToolDef[] = [
  ...developer,
  ...design,
  ...media,
  ...productivity,
];

export const SIMPLE_TOOLS_INDEX: Record<string, SimpleToolDef> = SIMPLE_TOOLS.reduce((acc, t) => {
  acc[t.id] = t; return acc;
}, {} as Record<string, SimpleToolDef>);