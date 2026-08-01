import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const env = Object.fromEntries(readFileSync("./.env.local","utf8").split(/\r?\n/).filter(l=>l&&!l.startsWith("#")&&l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth:{persistSession:false} });
for (const [t,col] of [["visa_enquiries","email"],["tour_enquiries","email"],["hotel_enquiries","email"],["payments","customer_email"],["visa_applications","email"]]) {
  const { data, error } = await s.from(t).select(`reference,${col}`).order("created_at",{ascending:false}).limit(30);
  console.log(error ? `${t}: ERR ${error.message}` : `${t}: ${data.length} → ${JSON.stringify(data.map(r=>r[col]))}`);
}
