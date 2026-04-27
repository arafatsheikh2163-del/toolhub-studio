import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { CopyButton } from "@/components/tools/CopyButton";

export default function Timestamp() {
  const [now, setNow] = useState(Math.floor(Date.now()/1000));
  const [ts, setTs] = useState(String(Math.floor(Date.now()/1000)));
  const [dt, setDt] = useState(new Date().toISOString().slice(0,16));
  useEffect(() => { const i = setInterval(()=>setNow(Math.floor(Date.now()/1000)), 1000); return ()=>clearInterval(i); }, []);
  const tsNum = parseInt(ts,10);
  const fromTs = !isNaN(tsNum) ? new Date(tsNum*1000) : null;
  const fromDt = new Date(dt);
  return (
    <ToolWorkspace toolId="timestamp">
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-3">
          <Stat k="Current Unix" v={now} />
          <Stat k="UTC" v={new Date(now*1000).toUTCString()} />
          <Stat k="ISO" v={new Date(now*1000).toISOString()} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Timestamp → Date</h3>
            <Field label="Unix seconds"><TextInput value={ts} onChange={e=>setTs(e.target.value)} /></Field>
            {fromTs && <>
              <Stat k="Local" v={fromTs.toString()} />
              <Stat k="UTC" v={fromTs.toUTCString()} />
              <Stat k="ISO" v={fromTs.toISOString()} />
            </>}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Date → Timestamp</h3>
            <Field label="Date & time"><TextInput type="datetime-local" value={dt} onChange={e=>setDt(e.target.value)} /></Field>
            <div className="flex items-center gap-2">
              <Stat k="Unix" v={Math.floor(fromDt.getTime()/1000)} />
              <CopyButton text={String(Math.floor(fromDt.getTime()/1000))} label="" />
            </div>
            <Stat k="Milliseconds" v={fromDt.getTime()} />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
