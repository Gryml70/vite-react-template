/**
 * Setup script för att skapa mall_content-tabellen i Supabase
 * Kör: npx tsx scripts/setup-database.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
	console.error("❌ Missing Supabase environment variables");
	console.error("   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
	console.log("🔧 Setting up database...");
	console.log(`   URL: ${supabaseUrl}`);

	// Läs SQL-filen
	const sqlPath = join(process.cwd(), "supabase", "CREATE_MALL_CONTENT_TABLE.sql");
	const sql = readFileSync(sqlPath, "utf-8");

	console.log("\n📄 SQL to execute:");
	console.log("─".repeat(80));
	console.log(sql);
	console.log("─".repeat(80));

	console.log("\n⚠️  MANUAL STEP REQUIRED:");
	console.log("   1. Go to: https://supabase.com/dashboard/project/aoovgbubyetnymvtshud/editor");
	console.log("   2. Click 'SQL Editor' → 'New Query'");
	console.log("   3. Copy and paste the SQL above");
	console.log("   4. Click 'Run'");
	console.log("\n   Or use Supabase CLI: supabase db reset");

	// Testa anslutningen
	console.log("\n🔌 Testing connection...");
	const { data, error } = await supabase.from("mall_content").select("count");

	if (error) {
		if (error.message.includes("does not exist")) {
			console.log("   ⏳ Table 'mall_content' does not exist yet");
			console.log("   👉 Please run the SQL above in Supabase Dashboard");
		} else {
			console.error("   ❌ Error:", error.message);
		}
	} else {
		console.log("   ✅ Table 'mall_content' exists!");
		console.log(`   📊 Rows: ${data?.length || 0}`);
	}
}

setupDatabase().catch(console.error);
