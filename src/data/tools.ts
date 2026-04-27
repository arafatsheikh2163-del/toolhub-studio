import {
  Type, CaseSensitive, Eraser, ArrowDownAZ,
  ImageDown, Crop, RotateCw, Scaling, FileImage,
  Braces, Binary, Link2, Code2, Minimize2,
  FileText, FileSearch,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "text"
  | "image"
  | "developer"
  | "pdf"
  | "viewer";

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
];

export const getToolById = (id: string) => TOOLS.find(t => t.id === id);
