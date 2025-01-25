import { serve } from "https://deno.land/std@0.130.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "GET") {
    console.error(`Invalid request method: ${req.method}`);
    return new Response("Invalid request method. Only GET is allowed.", {
      status: 405,
    });
  }

  try {
    const { error } = await supabase.rpc("deactivate_all_entries");

    if (error) {
      console.error("Error deactivating entries:", error);
      return new Response("Failed to deactivate entries", { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "All entries deactivated successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
