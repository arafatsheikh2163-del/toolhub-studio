import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ACCENT_BG, type Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  tools: Tool[];
  /** Auto-slide marquee mode (continuously scrolls). */
  marquee?: boolean;
}

export function ToolsCarousel({ title, subtitle, tools, marquee = false }: Props) {
  if (marquee) return <MarqueeCarousel title={title} subtitle={subtitle} tools={tools} />;
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = ref.current; if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tools]);

  const scroll = (dir: -1 | 1) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canL} className="btn-3d-icon disabled:opacity-40 disabled:pointer-events-none" aria-label="Scroll left">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} disabled={!canR} className="btn-3d-icon disabled:opacity-40 disabled:pointer-events-none" aria-label="Scroll right">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          onScroll={update}
          className="hide-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-1 px-1 pb-2"
        >
          {tools.map(t => <CarouselTile key={t.id} tool={t} />)}
        </div>
      </div>
    </motion.section>
  );
}

function MarqueeCarousel({ title, subtitle, tools }: Omit<Props, "marquee">) {
  // Duplicate the list so the loop is seamless.
  const loop = [...tools, ...tools];
  const dur = Math.max(28, tools.length * 4);
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Live · auto-rotate</span>
      </div>
      <div className="marquee-mask group relative overflow-hidden -mx-1">
        <div
          className="flex gap-4 px-1 will-change-transform group-hover:[animation-play-state:paused]"
          style={{ animation: `marquee-x ${dur}s linear infinite`, width: "max-content" }}
        >
          {loop.map((t, i) => <CarouselTile key={`${t.id}-${i}`} tool={t} />)}
        </div>
      </div>
    </motion.section>
  );
}

function CarouselTile({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const accent = tool.accent ?? "stone";
  const isInk = accent === "ink";
  return (
    <Link
      to={tool.path}
      className="group relative shrink-0 snap-start w-[180px] sm:w-[210px] aspect-[4/5] rounded-2xl overflow-hidden surface border border-border hover:border-foreground/15 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg flex flex-col"
    >
      {/* Visual area with accent gradient */}
      <div className="flex-1 relative grid place-items-center" style={{ background: ACCENT_BG[accent] }}>
        <div className={cn(
          "h-16 w-16 rounded-2xl grid place-items-center bg-card/85 backdrop-blur-sm border border-white/40 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]",
          isInk && "bg-white/12 border-white/20"
        )}>
          <Icon className={cn("h-7 w-7", isInk ? "text-white" : "text-foreground")} strokeWidth={1.5} />
        </div>
        {tool.isNew && <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground text-background">NEW</span>}
        {tool.flagship && <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground text-background">★</span>}
      </div>
      <div className="p-3.5 bg-card">
        <div className="text-[14px] font-semibold tracking-tight text-foreground truncate text-center">{tool.name}</div>
      </div>
    </Link>
  );
}
