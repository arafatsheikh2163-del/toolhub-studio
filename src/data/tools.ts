import {
  Type, CaseSensitive, Eraser, ArrowDownAZ,
  ImageDown, Crop, RotateCw, Scaling, FileImage,
  Braces, Binary, Link2, Code2, Minimize2,
  FileText, FileSearch,
  LayoutGrid,
  KeyRound, QrCode, Pipette, AlignLeft, Hash, Ruler, CalendarDays, Dice5, Coins,
  Fingerprint, Shuffle, Calculator, Clock, Globe, Cookie,
  Regex, ShieldCheck, GitCompare, FileCode2, FileJson, Table2, Sigma, Database, Eye, Image as ImageIcon,
  Palette, Sparkles, Layers, Box, Shapes, AudioLines, Mic, Wand2,
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
  keywords?: string[];
}

export const CATEGORIES: Record<ToolCategory, { label: string; }> = {
  text:      { label: "Text Tools" },
  image:     { label: "Image Tools" },
  developer: { label: "Developer Tools" },
  pdf:       { label: "PDF Tools" },
  viewer:    { label: "Multi-tab Viewer" },
  utility:   { label: "Utilities" },
  converter: { label: "Converters" },
  generator: { label: "Generators" },
  security:  { label: "Security" },
  creative:  { label: "Creative Lab" },
};

export const TOOLS: Tool[] = [
  // Text
  { id: "text-counter",   name: "Text Counter",      description: "Live word, character, sentence & reading-time stats.", category: "text", icon: Type,          path: "/tools/text-counter",   keywords: ["count","words","stats"] },
  { id: "case-converter", name: "Case Converter",    description: "Switch between upper, lower, title, sentence & camel.", category: "text", icon: CaseSensitive, path: "/tools/case-converter", keywords: ["upper","lower","camel"] },
  { id: "whitespace",     name: "Whitespace Cleaner",description: "Strip extra spaces, blank lines, and stray tabs.",     category: "text", icon: Eraser,        path: "/tools/whitespace",     keywords: ["trim","clean","spaces"] },
  { id: "text-sort",      name: "Text Sorter",       description: "Sort lines alphabetically, numerically, or by length.",category: "text", icon: ArrowDownAZ,   path: "/tools/text-sort",      keywords: ["sort","lines","order"] },

  // Image
  { id: "image-compress", name: "Image Compressor",  description: "Quality-controlled JPEG/WEBP compression in browser.",category: "image", icon: ImageDown,    path: "/tools/image-compress", keywords: ["compress","optimize","jpeg"] },
  { id: "image-resize",   name: "Image Resize",      description: "Resize with aspect-ratio lock and pixel precision.",  category: "image", icon: Scaling,      path: "/tools/image-resize",   keywords: ["resize","scale"] },
  { id: "image-convert",  name: "Format Converter",  description: "Convert between PNG, JPG and WEBP losslessly.",       category: "image", icon: FileImage,    path: "/tools/image-convert",  keywords: ["convert","png","jpg","webp"] },
  { id: "image-crop",     name: "Crop Tool",         description: "Drag to crop with live overlay and ratio presets.",   category: "image", icon: Crop,         path: "/tools/image-crop",     keywords: ["crop","trim"] },
  { id: "image-rotate",   name: "Rotate & Flip",     description: "Rotate by degree or flip across either axis.",        category: "image", icon: RotateCw,     path: "/tools/image-rotate",   keywords: ["rotate","flip","mirror"] },

  // Developer
  { id: "json-format",    name: "JSON Formatter",    description: "Pretty-print, validate, and minify JSON payloads.",    category: "developer", icon: Braces,   path: "/tools/json-format", keywords: ["json","format","lint"] },
  { id: "base64",         name: "Base64 Encoder",    description: "Encode and decode Base64 strings instantly.",          category: "developer", icon: Binary,   path: "/tools/base64",      keywords: ["base64","encode"] },
  { id: "url-codec",      name: "URL Encoder",       description: "Encode and decode URI components safely.",             category: "developer", icon: Link2,    path: "/tools/url-codec",   keywords: ["url","uri","encode"] },
  { id: "html-preview",   name: "HTML Live Preview", description: "Sandbox HTML/CSS with an instant rendered preview.",   category: "developer", icon: Code2,    path: "/tools/html-preview",keywords: ["html","preview","render"] },
  { id: "css-minify",     name: "CSS Minifier",      description: "Strip whitespace and comments from CSS in one pass.",  category: "developer", icon: Minimize2,path: "/tools/css-minify",  keywords: ["css","minify","compress"] },

  // PDF
  { id: "pdf-viewer",     name: "PDF Viewer",        description: "Open and page through any PDF in your browser.",      category: "pdf", icon: FileText,    path: "/tools/pdf-viewer",  keywords: ["pdf","read"] },
  { id: "pdf-extract",    name: "PDF Text Extract",  description: "Extract selectable text from PDF pages locally.",      category: "pdf", icon: FileSearch,  path: "/tools/pdf-extract", keywords: ["pdf","text","extract"] },

  // Flagship
  { id: "multi-tab",      name: "Multi-tab Viewer",  description: "Compare multiple sites side-by-side in a live grid.", category: "viewer", icon: LayoutGrid, path: "/tools/multi-tab", flagship: true, keywords: ["iframe","grid","compare"] },

  // ===== Generators =====
  { id: "password-gen",   name: "Password Generator", description: "Cryptographically strong passwords with custom rules.", category: "generator", icon: KeyRound,   path: "/tools/password-gen",   keywords: ["password","secure","random"] },
  { id: "qr-gen",         name: "QR Code Generator",  description: "Build QR codes for URLs, text, Wi-Fi or contact cards.", category: "generator", icon: QrCode,     path: "/tools/qr-gen",         keywords: ["qr","barcode"] },
  { id: "lorem",          name: "Lorem Ipsum",        description: "Generate placeholder paragraphs, sentences and words.",   category: "generator", icon: AlignLeft,  path: "/tools/lorem",          keywords: ["dummy","placeholder","text"] },
  { id: "uuid",           name: "UUID Generator",     description: "Bulk-generate v4 UUIDs / GUIDs with one click copy.",     category: "generator", icon: Fingerprint,path: "/tools/uuid",           keywords: ["guid","uuid","id"] },
  { id: "slug",           name: "Slug Generator",     description: "Turn any string into a clean URL-safe slug.",             category: "generator", icon: Link2,      path: "/tools/slug",           keywords: ["url","slug","seo"] },
  { id: "random-num",     name: "Random Number",      description: "Pick numbers in any range with optional uniqueness.",     category: "generator", icon: Shuffle,    path: "/tools/random-num",     keywords: ["random","number","pick"] },
  { id: "dice",           name: "Dice Roller",        description: "Roll d4–d100 dice combinations instantly.",               category: "generator", icon: Dice5,      path: "/tools/dice",           keywords: ["dice","random","rpg"] },
  { id: "coin-flip",      name: "Coin Flip",          description: "Animated coin flip with heads/tails statistics.",         category: "generator", icon: Coins,      path: "/tools/coin-flip",      keywords: ["coin","flip","random"] },
  { id: "favicon-gen",    name: "Favicon Generator",  description: "Generate favicons in multiple sizes from text or image.", category: "generator", icon: Sparkles,   path: "/tools/favicon-gen",    keywords: ["favicon","icon","ico"] },

  // ===== Utilities =====
  { id: "color-picker",   name: "Color Picker",       description: "Pick colors and convert HEX / RGB / HSL / OKLCH live.",   category: "utility", icon: Pipette,     path: "/tools/color-picker",   keywords: ["color","hex","rgb"] },
  { id: "unit-convert",   name: "Unit Converter",     description: "Convert length, weight, temperature, data and more.",     category: "utility", icon: Ruler,       path: "/tools/unit-convert",   keywords: ["unit","convert","metric"] },
  { id: "date-calc",      name: "Date Calculator",    description: "Add/subtract days, find difference between dates.",       category: "utility", icon: CalendarDays, path: "/tools/date-calc",      keywords: ["date","calendar","diff"] },
  { id: "calculator",     name: "Calculator",         description: "Expression calculator with history & scientific ops.",    category: "utility", icon: Calculator,  path: "/tools/calculator",     keywords: ["math","calc"] },
  { id: "timestamp",      name: "Timestamp Converter",description: "Convert between Unix epoch and human-readable dates.",    category: "utility", icon: Clock,       path: "/tools/timestamp",      keywords: ["unix","epoch","time"] },
  { id: "ip-info",        name: "Browser & UA Info",  description: "Inspect your browser, OS, viewport and capabilities.",    category: "utility", icon: Globe,       path: "/tools/ip-info",        keywords: ["user agent","browser","info"] },

  // ===== Converters =====
  { id: "csv-json",       name: "CSV ↔ JSON",         description: "Convert CSV to JSON or back, with header detection.",     category: "converter", icon: Table2,    path: "/tools/csv-json",       keywords: ["csv","json","convert"] },
  { id: "yaml-json",      name: "YAML ↔ JSON",        description: "Convert between YAML and JSON safely in browser.",        category: "converter", icon: FileJson,  path: "/tools/yaml-json",      keywords: ["yaml","json"] },
  { id: "json-ts",        name: "JSON → TypeScript",  description: "Generate TypeScript interfaces from any JSON sample.",    category: "converter", icon: FileCode2, path: "/tools/json-ts",        keywords: ["json","typescript","types"] },
  { id: "md-html",        name: "Markdown → HTML",    description: "Live Markdown rendering with copyable HTML output.",      category: "converter", icon: FileText,  path: "/tools/md-html",        keywords: ["markdown","md","html"] },
  { id: "sql-format",     name: "SQL Formatter",      description: "Pretty-print SQL queries with consistent indentation.",   category: "converter", icon: Database,  path: "/tools/sql-format",     keywords: ["sql","format","query"] },
  { id: "number-base",    name: "Number Base",        description: "Convert numbers between binary, octal, decimal & hex.",   category: "converter", icon: Sigma,     path: "/tools/number-base",    keywords: ["binary","hex","base"] },
  { id: "image-base64",   name: "Image → Base64",     description: "Encode images to data URIs for inlining in code.",        category: "converter", icon: ImageIcon, path: "/tools/image-base64",   keywords: ["image","base64","data uri"] },

  // ===== Security =====
  { id: "hash",           name: "Hash Generator",     description: "Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes locally.", category: "security", icon: Hash,         path: "/tools/hash",         keywords: ["sha","hash","md5"] },
  { id: "regex",          name: "Regex Tester",       description: "Test regular expressions with live highlights & groups.",  category: "security", icon: Regex,        path: "/tools/regex",        keywords: ["regex","regexp","pattern"] },
  { id: "jwt",            name: "JWT Decoder",        description: "Decode JSON Web Tokens, inspect header & payload.",        category: "security", icon: ShieldCheck,  path: "/tools/jwt",          keywords: ["jwt","token","decode"] },
  { id: "diff",           name: "Text Diff",          description: "Compare two text blocks with line-by-line diff view.",     category: "security", icon: GitCompare,   path: "/tools/diff",         keywords: ["diff","compare","text"] },
  { id: "cookie",         name: "Cookie Inspector",   description: "Decode and inspect cookie strings line by line.",          category: "security", icon: Cookie,       path: "/tools/cookie",       keywords: ["cookie","header"] },
  { id: "contrast",       name: "Contrast Checker",   description: "WCAG color contrast ratios with live preview.",            category: "security", icon: Eye,          path: "/tools/contrast",     keywords: ["contrast","wcag","a11y"] },

  // ===== Creative Lab =====
  { id: "ascii-art",      name: "ASCII Art",          description: "Convert any text into giant figlet-style ASCII art.",      category: "creative", icon: Type,         path: "/tools/ascii-art",    keywords: ["ascii","art","figlet"] },
  { id: "image-ascii",    name: "Image → ASCII",      description: "Turn any image into expressive ASCII line art.",           category: "creative", icon: ImageIcon,    path: "/tools/image-ascii",  keywords: ["ascii","image"] },
  { id: "mesh-gradient", name: "Mesh Gradient",      description: "Generate randomized mesh gradient backgrounds.",           category: "creative", icon: Layers,        path: "/tools/mesh-gradient",keywords: ["gradient","mesh","background"] },
  { id: "glass-ui",       name: "Glass UI Studio",    description: "Tune glassmorphism panels and copy the CSS.",              category: "creative", icon: Box,          path: "/tools/glass-ui",     keywords: ["glass","glassmorphism","css"] },
  { id: "shadow-studio",  name: "Box-Shadow Studio",  description: "Layered CSS box-shadow builder with live preview.",        category: "creative", icon: Shapes,       path: "/tools/shadow-studio",keywords: ["shadow","css"] },
  { id: "palette-lab",    name: "Palette Lab",        description: "Generate harmonious color palettes from a base hue.",      category: "creative", icon: Palette,      path: "/tools/palette-lab",  keywords: ["palette","colors"] },
  { id: "audio-viz",      name: "Audio Visualizer",   description: "Drop an audio file and watch a live waveform visual.",     category: "creative", icon: AudioLines,   path: "/tools/audio-viz",    keywords: ["audio","waveform"] },
  { id: "speech-text",    name: "Speech → Text",      description: "Live speech recognition using your browser microphone.",   category: "creative", icon: Mic,          path: "/tools/speech-text",  keywords: ["speech","voice","transcribe"] },
  { id: "wand-cleanup",   name: "Image Magic Clean",  description: "Auto-enhance brightness/contrast and strip metadata.",     category: "creative", icon: Wand2,        path: "/tools/wand-cleanup", keywords: ["enhance","clean"] },
];

export const getToolById = (id: string) => TOOLS.find(t => t.id === id);
