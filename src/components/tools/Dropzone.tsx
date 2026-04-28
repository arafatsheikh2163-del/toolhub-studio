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
    e.preventDefault(); setDrag(false);
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
        "relative block cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-250 ease-out-expo",
        drag ? "border-foreground/40 bg-accent" : "border-border surface-soft hover:border-foreground/20 hover:bg-accent/60",
        className
      )}
    >
      <input type="file" accept={accept} multiple={multiple} onChange={handleSelect} className="sr-only" />
      <div className={cn(
        "mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-card border border-border mb-4 transition-transform duration-250 ease-out-expo shadow-sm",
        drag && "scale-110"
      )}>
        {accept.includes("image") ? <ImageIcon className="h-6 w-6 text-foreground" /> : <Upload className="h-6 w-6 text-foreground" />}
      </div>
      <div className="text-sm font-semibold text-foreground">{drag ? "Release to upload" : "Drop file here or click to browse"}</div>
      <div className="text-[12px] text-muted-foreground mt-1">{hint}</div>
    </label>
  );
}
