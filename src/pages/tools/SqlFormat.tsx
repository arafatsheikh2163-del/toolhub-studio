import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

const KW = ["select","from","where","and","or","group by","order by","having","limit","offset","join","left join","right join","inner join","outer join","on","insert into","values","update","set","delete from","create table","alter table","drop table","union","union all","with","case","when","then","else","end","as","distinct","returning"];

function formatSql(sql: string) {
  let s = sql.replace(/\s+/g," ").trim();
  // Normalize keywords case
  KW.sort((a,b)=>b.length-a.length);
  for (const k of KW) s = s.replace(new RegExp(`\\b${k.replace(/ /g,"\\s+")}\\b`,"gi"), k.toUpperCase());
  // Add line breaks
  s = s.replace(/\bSELECT\b/g, "SELECT");
  for (const k of ["FROM","WHERE","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","LEFT JOIN","RIGHT JOIN","INNER JOIN","JOIN","ON","UNION ALL","UNION","SET","VALUES","RETURNING"]) {
    s = s.replace(new RegExp(`\\s${k}\\b`,"g"), `\n${k}`);
  }
  // Indent comma-separated SELECT list
  s = s.replace(/SELECT\s/, "SELECT\n  ").replace(/,\s/g, ",\n  ");
  // Re-split on FROM etc to prevent over-indent
  s = s.replace(/\n  (FROM|WHERE|AND|OR|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|ON|UNION ALL|UNION)/g, "\n$1");
  return s.trim() + ";";
}

export default function SqlFormat() {
  const [sql, setSql] = useState("select id, name, email from users where active = true and created_at > '2024-01-01' order by name limit 10");
  const out = useMemo(() => formatSql(sql), [sql]);
  return (
    <ToolWorkspace toolId="sql-format" actions={<CopyButton text={out} />}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Input"><TextArea rows={16} value={sql} onChange={e=>setSql(e.target.value)} /></Field>
        <Field label="Formatted"><TextArea rows={16} readOnly value={out} /></Field>
      </div>
    </ToolWorkspace>
  );
}
