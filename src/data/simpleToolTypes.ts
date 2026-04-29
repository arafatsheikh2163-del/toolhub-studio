import type { LucideIcon } from "lucide-react";
import type { ToolCategory } from "./tools";

export type FieldType =
  | "text"      // single-line input
  | "textarea"  // multi-line input — usually the main payload
  | "number"
  | "select"
  | "checkbox"
  | "color"
  | "slider";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  default?: string | number | boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  /** Show only when this predicate is true */
  when?: (values: Record<string, any>) => boolean;
  hint?: string;
}

export type RunResult =
  | { type: "text"; value: string; mono?: boolean; html?: boolean }
  | { type: "stats"; items: Array<{ k: string; v: string | number }> }
  | { type: "html"; html: string }
  | { type: "error"; message: string };

export interface SimpleToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  accent?: "stone" | "ink" | "sand" | "paper" | "mist" | "olive";
  popular?: boolean;
  isNew?: boolean;
  keywords?: string[];
  fields: FieldDef[];
  /** Pure function: take values → produce a result (or several). */
  run: (values: Record<string, any>) => RunResult | RunResult[];
  /** Optional: auto-run on every change (default: true). Set false for heavy ops. */
  live?: boolean;
  /** Optional: button label override */
  runLabel?: string;
}