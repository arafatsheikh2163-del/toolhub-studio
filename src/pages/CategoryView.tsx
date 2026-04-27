import { useParams, Navigate } from "react-router-dom";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";

export default function CategoryView() {
  const { category } = useParams<{ category: string }>();
  if (!category || !(category in CATEGORIES)) return <Navigate to="/" replace />;
  const cat = category as ToolCategory;
  const tools = TOOLS.filter(t => t.category === cat);
  const meta = CATEGORIES[cat];

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Category</div>
        <h1 className="text-3xl font-medium tracking-tight text-gradient-soft">{meta.label}</h1>
        <p className="text-sm text-muted-foreground">{tools.length} tools · all running locally in your browser.</p>
      </header>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map(t => <ToolCard key={t.id} tool={t} />)}
      </div>
    </div>
  );
}
