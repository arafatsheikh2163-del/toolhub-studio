import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { prompt, lang } = await req.json();
    if (typeof prompt !== "string" || prompt.trim().length < 2) throw new Error("Write at least 2 characters describing the code.");
    if (typeof lang !== "string" || lang.trim().length < 1) throw new Error("Choose a programming language.");

    const sys = `You are an expert programmer. Convert the user's natural-language description into clean, idiomatic ${lang} code. Reply with ONLY a single fenced code block — no explanation, no prose. Use modern best practices and include necessary imports.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: prompt.trim().slice(0, 6000) }],
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Gateway ${r.status}: ${t}`);
    }
    const data = await r.json();
    let code: string = data?.choices?.[0]?.message?.content ?? "";
    const m = code.match(/```[a-zA-Z+#-]*\n([\s\S]*?)```/);
    if (m) code = m[1];
    return new Response(JSON.stringify({ code: code.trim() }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
