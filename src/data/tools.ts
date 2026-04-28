import {
  Type, CaseSensitive, Eraser, ArrowDownAZ, Replace,
  ImageDown, Crop, RotateCw, Scaling, FileImage, Droplet,
  Braces, Binary, Link2, Code2, Minimize2,
  FileText, FileSearch, FilePlus2, Scissors,
  LayoutGrid,
  KeyRound, QrCode, Pipette, AlignLeft, Hash, Ruler, CalendarDays,
  Fingerprint, Shuffle, Calculator, Clock, Globe,
  Regex, ShieldCheck, GitCompare, FileCode2, FileJson, Table2, Sigma, Database, Eye, Lock,
  Palette, Layers, Shapes, Mic, Volume2, Camera, Timer, NotebookPen, StickyNote, Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "text"
  | "image"
  | "developer"
  | "pdf"
  | "viewer"
  | "utility"
  | "converter"
  | "generator"
  | "security"
  | "creative";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  path: string;
  flagship?: boolean;
  popular?: boolean;
  isNew?: boolean;
  /** Tile gradient — one of named accents */
  accent?: "stone" | "ink" | "sand" | "paper" | "mist" | "olive";
  keywords?: string[];
}

export const CATEGORIES: Record<ToolCategory, { label: string; }> = {
  text:      { label: "Text" },
  image:     { label: "Image" },
  developer: { label: "Developer" },
  pdf:       { label: "PDF" },
  viewer:    { label: "Viewer" },
  utility:   { label: "Utilities" },
  converter: { label: "Converters" },
  generator: { label: "Generators" },
  security:  { label: "Security" },
  creative:  { label: "Studio" },
};

export const TOOLS: Tool[] = [
  // ===== Text =====
  { id: "text-counter",   name: "Text Counter",       description: "Live word, character, sentence & reading-time stats.",   category: "text", icon: Type,          accent: "paper", path: "/tools/text-counter",   keywords: ["count","words","stats"], popular: true },
  { id: "case-converter", name: "Case Converter",     description: "Switch between upper, lower, title, sentence & camel.",   category: "text", icon: CaseSensitive, accent: "stone", path: "/tools/case-converter", keywords: ["upper","lower","camel"] },
  { id: "whitespace",     name: "Whitespace Cleaner", description: "Strip extra spaces, blank lines, and stray tabs.",        category: "text", icon: Eraser,        accent: "mist",  path: "/tools/whitespace",     keywords: ["trim","clean","spaces"] },
  { id: "text-sort",      name: "Text Sorter",        description: "Sort lines alphabetically, numerically, or by length.",   category: "text", icon: ArrowDownAZ,   accent: "sand",  path: "/tools/text-sort",      keywords: ["sort","lines","order"] },
  { id: "find-replace",   name: "Find & Replace",     description: "Multi-rule search & replace with regex and live preview.",category: "text", icon: Replace,       accent: "ink",   path: "/tools/find-replace",   keywords: ["replace","regex","find"], isNew: true },
  { id: "notepad",        name: "Quick Notepad",      description: "Distraction-free notepad — autosaves to your browser.",   category: "text", icon: NotebookPen,   accent: "paper", path: "/tools/notepad",        keywords: ["notes","markdown"], isNew: true },

  // ===== Image =====
  { id: "image-compress", name: "Image Compressor",   description: "Quality-controlled JPEG/WEBP compression in browser.",   category: "image", icon: ImageDown,    accent: "stone", path: "/tools/image-compress", keywords: ["compress","optimize","jpeg"], popular: true },
  { id: "image-resize",   name: "Image Resize",       description: "Resize with aspect-ratio lock and pixel precision.",     category: "image", icon: Scaling,      accent: "sand",  path: "/tools/image-resize",   keywords: ["resize","scale"] },
  { id: "image-convert",  name: "Format Converter",   description: "Convert between PNG, JPG and WEBP losslessly.",          category: "image", icon: FileImage,    accent: "mist",  path: "/tools/image-convert",  keywords: ["convert","png","jpg","webp"] },
  { id: "image-crop",     name: "Crop Tool",          description: "Drag to crop with live overlay and ratio presets.",      category: "image", icon: Crop,         accent: "paper", path: "/tools/image-crop",     keywords: ["crop","trim"] },
  { id: "image-rotate",   name: "Rotate & Flip",      description: "Rotate by degree or flip across either axis.",           category: "image", icon: RotateCw,     accent: "olive", path: "/tools/image-rotate",   keywords: ["rotate","flip"] },
  { id: "image-watermark",name: "Watermark Studio",   description: "Add custom text watermarks with opacity & position.",    category: "image", icon: Droplet,      accent: "ink",   path: "/tools/image-watermark",keywords: ["watermark","brand"], isNew: true },
  { id: "webcam-capture", name: "Webcam Capture",     description: "Snap high-resolution photos straight from your camera.", category: "image", icon: Camera,       accent: "stone", path: "/tools/webcam-capture", keywords: ["webcam","photo","camera"], isNew: true },

  // ===== Developer =====
  { id: "json-format",    name: "JSON Formatter",     description: "Pretty-print, validate, and minify JSON payloads.",      category: "developer", icon: Braces,    accent: "ink",   path: "/tools/json-format",  keywords: ["json","format","lint"], popular: true },
  { id: "base64",         name: "Base64 Encoder",     description: "Encode and decode Base64 strings instantly.",            category: "developer", icon: Binary,    accent: "paper", path: "/tools/base64",       keywords: ["base64","encode"] },
  { id: "url-codec",      name: "URL Encoder",        description: "Encode and decode URI components safely.",               category: "developer", icon: Link2,     accent: "stone", path: "/tools/url-codec",    keywords: ["url","uri","encode"] },
  { id: "html-preview",   name: "HTML Live Preview",  description: "Sandbox HTML/CSS with an instant rendered preview.",     category: "developer", icon: Code2,     accent: "sand",  path: "/tools/html-preview", keywords: ["html","preview","render"] },
  { id: "css-minify",     name: "CSS Minifier",       description: "Strip whitespace and comments from CSS in one pass.",    category: "developer", icon: Minimize2, accent: "mist",  path: "/tools/css-minify",   keywords: ["css","minify"] },

  // ===== PDF =====
  { id: "pdf-viewer",     name: "PDF Viewer",         description: "Open and page through any PDF in your browser.",         category: "pdf", icon: FileText,    accent: "paper", path: "/tools/pdf-viewer",  keywords: ["pdf","read"] },
  { id: "pdf-extract",    name: "PDF Text Extract",   description: "Extract selectable text from PDF pages locally.",        category: "pdf", icon: FileSearch,  accent: "stone", path: "/tools/pdf-extract", keywords: ["pdf","text","extract"] },
  { id: "pdf-merge",      name: "PDF Merge",          description: "Merge multiple PDFs into a single file in any order.",   category: "pdf", icon: FilePlus2,   accent: "ink",   path: "/tools/pdf-merge",   keywords: ["pdf","merge","combine"], isNew: true },
  { id: "pdf-split",      name: "PDF Split",          description: "Extract a page range from a PDF as a new file.",         category: "pdf", icon: Scissors,    accent: "sand",  path: "/tools/pdf-split",   keywords: ["pdf","split","extract"], isNew: true },

  // Flagship
  { id: "multi-tab",      name: "Multi-tab Viewer",   description: "Compare multiple sites side-by-side in a live grid.",    category: "viewer", icon: LayoutGrid, accent: "ink", path: "/tools/multi-tab", flagship: true, keywords: ["iframe","grid","compare"] },

  // ===== Generators =====
  { id: "password-gen",   name: "Password Generator", description: "Cryptographically strong passwords with custom rules.",  category: "generator", icon: KeyRound,    accent: "ink",   path: "/tools/password-gen",  keywords: ["password","secure","random"], popular: true },
  { id: "qr-gen",         name: "QR Code Generator",  description: "Build QR codes for URLs, text, Wi-Fi or contact cards.", category: "generator", icon: QrCode,      accent: "paper", path: "/tools/qr-gen",        keywords: ["qr","barcode"] },
  { id: "lorem",          name: "Lorem Ipsum",        description: "Generate placeholder paragraphs, sentences and words.",  category: "generator", icon: AlignLeft,   accent: "stone", path: "/tools/lorem",         keywords: ["dummy","placeholder","text"] },
  { id: "uuid",           name: "UUID Generator",     description: "Bulk-generate v4 UUIDs / GUIDs with one-click copy.",    category: "generator", icon: Fingerprint, accent: "mist",  path: "/tools/uuid",          keywords: ["guid","uuid","id"] },
  { id: "slug",           name: "Slug Generator",     description: "Turn any string into a clean URL-safe slug.",            category: "generator", icon: Link2,       accent: "sand",  path: "/tools/slug",          keywords: ["url","slug","seo"] },
  { id: "random-num",     name: "Random Number",      description: "Pick numbers in any range with optional uniqueness.",    category: "generator", icon: Shuffle,     accent: "olive", path: "/tools/random-num",    keywords: ["random","number"] },

  // ===== Utilities =====
  { id: "color-picker",   name: "Color Picker",       description: "Pick colors and convert HEX / RGB / HSL / OKLCH live.",  category: "utility", icon: Pipette,     accent: "paper", path: "/tools/color-picker", keywords: ["color","hex","rgb"], popular: true },
  { id: "unit-convert",   name: "Unit Converter",     description: "Convert length, weight, temperature, data and more.",    category: "utility", icon: Ruler,       accent: "stone", path: "/tools/unit-convert", keywords: ["unit","convert","metric"] },
  { id: "date-calc",      name: "Date Calculator",    description: "Add/subtract days, find difference between dates.",      category: "utility", icon: CalendarDays,accent: "mist",  path: "/tools/date-calc",    keywords: ["date","calendar","diff"] },
  { id: "calculator",     name: "Calculator",         description: "Expression calculator with history & scientific ops.",   category: "utility", icon: Calculator,  accent: "ink",   path: "/tools/calculator",   keywords: ["math","calc"] },
  { id: "timestamp",      name: "Timestamp Converter",description: "Convert between Unix epoch and human-readable dates.",   category: "utility", icon: Clock,       accent: "sand",  path: "/tools/timestamp",    keywords: ["unix","epoch","time"] },
  { id: "ip-info",        name: "Browser & UA Info",  description: "Inspect your browser, OS, viewport and capabilities.",   category: "utility", icon: Globe,       accent: "olive", path: "/tools/ip-info",      keywords: ["user agent","browser"] },
  { id: "pomodoro",       name: "Pomodoro Timer",     description: "Focus timer with customizable work & break intervals.",  category: "utility", icon: Timer,       accent: "ink",   path: "/tools/pomodoro",     keywords: ["timer","focus","pomodoro"], isNew: true },

  // ===== Converters =====
  { id: "csv-json",       name: "CSV ↔ JSON",         description: "Convert CSV to JSON or back, with header detection.",    category: "converter", icon: Table2,    accent: "paper", path: "/tools/csv-json",    keywords: ["csv","json"] },
  { id: "yaml-json",      name: "YAML ↔ JSON",        description: "Convert between YAML and JSON safely in browser.",       category: "converter", icon: FileJson,  accent: "stone", path: "/tools/yaml-json",   keywords: ["yaml","json"] },
  { id: "json-ts",        name: "JSON → TypeScript",  description: "Generate TypeScript interfaces from any JSON sample.",   category: "converter", icon: FileCode2, accent: "ink",   path: "/tools/json-ts",     keywords: ["json","typescript"] },
  { id: "md-html",        name: "Markdown → HTML",    description: "Live Markdown rendering with copyable HTML output.",     category: "converter", icon: FileText,  accent: "sand",  path: "/tools/md-html",     keywords: ["markdown","html"] },
  { id: "sql-format",     name: "SQL Formatter",      description: "Pretty-print SQL queries with consistent indentation.",  category: "converter", icon: Database,  accent: "mist",  path: "/tools/sql-format",  keywords: ["sql","format"] },
  { id: "number-base",    name: "Number Base",        description: "Convert numbers between binary, octal, decimal & hex.",  category: "converter", icon: Sigma,     accent: "olive", path: "/tools/number-base", keywords: ["binary","hex","base"] },
  { id: "image-base64",   name: "Image → Base64",     description: "Encode images to data URIs for inlining in code.",       category: "converter", icon: ImageIcon, accent: "paper", path: "/tools/image-base64",keywords: ["image","base64","data uri"] },

  // ===== Security =====
  { id: "hash",           name: "Hash Generator",     description: "Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes locally.",category: "security", icon: Hash,       accent: "ink",  path: "/tools/hash",      keywords: ["sha","hash"], popular: true },
  { id: "regex",          name: "Regex Tester",       description: "Test regular expressions with live highlights & groups.", category: "security", icon: Regex,      accent: "stone",path: "/tools/regex",     keywords: ["regex","pattern"] },
  { id: "jwt",            name: "JWT Decoder",        description: "Decode JSON Web Tokens, inspect header & payload.",       category: "security", icon: ShieldCheck,accent: "paper",path: "/tools/jwt",       keywords: ["jwt","token"] },
  { id: "diff",           name: "Text Diff",          description: "Compare two text blocks with line-by-line diff view.",    category: "security", icon: GitCompare, accent: "sand", path: "/tools/diff",      keywords: ["diff","compare"] },
  { id: "contrast",       name: "Contrast Checker",   description: "WCAG color contrast ratios with live preview.",           category: "security", icon: Eye,        accent: "mist", path: "/tools/contrast",  keywords: ["contrast","wcag","a11y"] },
  { id: "encrypt",        name: "AES Encryption",     description: "Encrypt and decrypt text with AES-GCM via Web Crypto.",   category: "security", icon: Lock,       accent: "ink",  path: "/tools/encrypt",   keywords: ["encrypt","aes","crypto"], isNew: true },

  // ===== Creative Studio =====
  { id: "shadow-studio",  name: "Box-Shadow Studio",  description: "Layered CSS box-shadow builder with live preview.",       category: "creative", icon: Shapes,    accent: "paper", path: "/tools/shadow-studio", keywords: ["shadow","css"] },
  { id: "palette-lab",    name: "Palette Lab",        description: "Generate harmonious color palettes from a base hue.",     category: "creative", icon: Palette,   accent: "stone", path: "/tools/palette-lab",   keywords: ["palette","colors"] },
  { id: "gradient-gen",   name: "Gradient Generator", description: "Build linear / radial / conic gradients with live CSS.",  category: "creative", icon: Layers,    accent: "ink",   path: "/tools/gradient-gen",  keywords: ["gradient","css"], isNew: true },
  { id: "speech-text",    name: "Speech → Text",      description: "Live speech recognition using your browser microphone.",  category: "creative", icon: Mic,       accent: "sand",  path: "/tools/speech-text",   keywords: ["speech","voice"] },
  { id: "tts",            name: "Text → Speech",      description: "Read text aloud using on-device system voices.",          category: "creative", icon: Volume2,   accent: "mist",  path: "/tools/tts",           keywords: ["speech","voice","tts"], isNew: true },
];

export const getToolById = (id: string) => TOOLS.find(t => t.id === id);

export const POPULAR_TOOLS = TOOLS.filter(t => t.popular);
export const NEW_TOOLS = TOOLS.filter(t => t.isNew);

/** Accent → tile background gradient (light theme) */
export const ACCENT_BG: Record<NonNullable<Tool["accent"]>, string> = {
  stone:  "linear-gradient(160deg, #f5f2ef 0%, #e9e4dd 100%)",
  ink:    "linear-gradient(160deg, #292524 0%, #0f0e0d 100%)",
  sand:   "linear-gradient(160deg, #faf6ee 0%, #ece2cb 100%)",
  paper:  "linear-gradient(160deg, #ffffff 0%, #f1f1f1 100%)",
  mist:   "linear-gradient(160deg, #eef0f2 0%, #d8dde2 100%)",
  olive:  "linear-gradient(160deg, #eeede1 0%, #ceccb6 100%)",
};
