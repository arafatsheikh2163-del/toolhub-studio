import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Stat } from "@/components/tools/Field";

export default function IpInfo() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const f = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const n = navigator;
  const items: [string, React.ReactNode][] = [
    ["User Agent", n.userAgent],
    ["Platform", (n as any).userAgentData?.platform || n.platform],
    ["Language", n.language],
    ["Languages", n.languages.join(", ")],
    ["Cookies", n.cookieEnabled ? "Enabled" : "Disabled"],
    ["Online", n.onLine ? "Yes" : "No"],
    ["Cores", n.hardwareConcurrency || "—"],
    ["Memory (GB)", (n as any).deviceMemory ?? "—"],
    ["Viewport", `${vp.w} × ${vp.h}`],
    ["Screen", `${screen.width} × ${screen.height}`],
    ["Pixel Ratio", window.devicePixelRatio],
    ["Color Depth", `${screen.colorDepth}-bit`],
    ["Touch Points", n.maxTouchPoints],
    ["Timezone", Intl.DateTimeFormat().resolvedOptions().timeZone],
  ];
  return (
    <ToolWorkspace toolId="ip-info">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(([k,v]) => <Stat key={k} k={k} v={v} />)}
      </div>
    </ToolWorkspace>
  );
}
