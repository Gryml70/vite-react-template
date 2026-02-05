import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = "https://aoovgbubyetnymvtshud.supabase.co";
const serviceRoleKey = "sbp_65c79988c11b348a3b67518b033dc3cce5c3fe30";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function insertSEORules() {
  // Läs md-filen
  const mdPath = path.join(process.cwd(), "supabase/functions/skrivregler-ai/grundregler-seo.md");
  const content = fs.readFileSync(mdPath, "utf-8");

  // Infoga i databasen
  const { data, error } = await supabase
    .from("seo_rules")
    .insert([{ content }]);

  if (error) {
    console.error("Error inserting SEO rules:", error);
  } else {
    console.log("✅ SEO rules inserted successfully!");
  }
}

insertSEORules();
