import { useCallback, useState, DragEvent, ChangeEvent } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  accept?: string;
  onFile: (file: File) => void;
  hint?: string;
  className?: string;
  multiple?: boolean;
}

export function Dropzone({ accept = "image/*", onFile, hint = "PNG, JPG, WEBP up to 30MB", className, multiple }: Props) {
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    files.forEach(onFile);
  }, [onFile]);

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(onFile);
    e.target.value = "";
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={cn(
        "relative block cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-all duration-250 ease-out-expo recess",
        drag ? "border-primary/60 bg-primary/5 shadow-glow-cyan" : "border-white/10 hover:border-white/20",
        className
      )}
    >
      <input type="file" accept={accept} multiple={multiple} onChange={handleSelect} className="sr-only" />
      <div className={cn(
        "mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4 transition-transform duration-250 ease-out-expo",
        drag && "scale-110 bg-primary/15 border-primary/40"
      )}>
        {accept.includes("image") ? <ImageIcon className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-primary" />}
      </div>
      <div className="text-sm font-medium">{drag ? "Release to upload" : "Drop file here or click to browse"}</div>
      <div className="text-[12px] text-muted-foreground mt-1">{hint}</div>
    </label>
  );
}
