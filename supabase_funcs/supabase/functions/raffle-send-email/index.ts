import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

console.log("Starting Edge Function to choose a raffle winner...");

serve(async (req) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    console.error(`Invalid request method: ${req.method}`);
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  try {
    console.log(
      "Fetching a random winner from the raffle_entries_test table..."
    );

    const { data, error } = await supabase
      .from("raffle_entries_test")
      .select("*");

    if (error || !data) {
      console.error("Error fetching entries:", error);
      return new Response("Failed to fetch entries", { status: 500 });
    }

    const winner = data[Math.floor(Math.random() * data.length)];

    if (error || !winner) {
      console.error("Error fetching winner:", error);
      return new Response("Failed to fetch a winner", { status: 500 });
    }

    console.log("Winner selected:", winner);

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const TEST_EMAIL = Deno.env.get("TEST_EMAIL");

    if (!BREVO_API_KEY || !TEST_EMAIL) {
      console.error("Missing required environment variables");
      return new Response("Server configuration error", { status: 500 });
    }

    const emailData = {
      sender: { email: TEST_EMAIL },
      to: [{ email: winner.email }],
      subject: "Mutts in the 6ix raffle winner!",
      htmlContent: `<p>Hello <strong>${winner.name}</strong>,</p><p>We are excited to inform you that you have been selected as a winner in our raffle!</p>`,
    };

    // Notify partner
    const partnerNotification = {
      sender: { email: TEST_EMAIL },
      to: [{ email: TEST_EMAIL }],
      subject: "Raffle Winner Selected",
      htmlContent: `<p>The winner is <strong>${winner.name}</strong> (${winner.email}).</p>`,
    };

    // Send emails using Brevo API
    const sendEmail = async (emailData) => {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Failed to send email:", errorDetails);
        throw new Error("Failed to send email");
      }
    };

    await sendEmail(emailData);
    await sendEmail(partnerNotification);

    console.log("Emails sent successfully!");
    return new Response(`Winner chosen: ${winner.name}`, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
});
