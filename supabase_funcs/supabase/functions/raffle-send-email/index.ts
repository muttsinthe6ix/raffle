// Import the required libraries
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Edge Function logic
interface EmailData {
  sender: { email: string; name: string };
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
}

interface RaffleWinner {
  name: string;
  email: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "GET") {
    console.error(`Invalid request method: ${req.method}`);
    return new Response("Invalid request method. Only GET is allowed.", {
      status: 405,
    });
  }

  try {
    console.log("Starting Edge Function to pick a random raffle winner...");

    // Call the SQL function `pick_random_winner`
    const { data, error } = await supabase.rpc<RaffleWinner>(
      "pick_random_winner"
    );

    const winner = data[0];

    if (error) {
      console.error("Error picking random winner:", error);
      return new Response(
        JSON.stringify({ error: "Failed to pick a random winner" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          message:
            "No eligible raffle entries found. All participants may have already won.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL");

    if (!BREVO_API_KEY || !SENDER_EMAIL) {
      console.error("Missing required environment variables");
      return new Response("Server configuration error", { status: 500 });
    }

    const emailData: EmailData = {
      sender: { email: SENDER_EMAIL, name: "Mutts in the 6ix" },
      to: [{ email: winner.email, name: winner.name }],
      subject: "Congratulations! You're a Mutts in the 6ix Raffle Winner!",
      htmlContent: `<p>Hi <strong>${winner.name}</strong>,</p><p>We are thrilled to let you know that you have been selected as a winner in our raffle! Thank you for participating and supporting Mutts in the 6ix. We hope this brings a smile to your face!</p><br><p>We'd love to hear your feedback on the event, please fill out this <a href="https://forms.gle/LzvaJ7UYywM7pwMx7">feedback form</a>!</p><br><p>We'll see you at the event!</p>`,
    };

    // Notify partner
    const partnerNotification: EmailData = {
      sender: { email: SENDER_EMAIL, name: "Mutts in the 6ix" },
      to: [{ email: SENDER_EMAIL, name: "Mutts in the 6ix" }],
      subject: "Raffle Winner Selected",
      htmlContent: `<p>The winner is <strong>${winner.name}</strong> (${winner.email}).</p>`,
    };

    // Send emails using Brevo API
    const sendEmail = async (emailData: EmailData): Promise<void> => {
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

    // Respond with the winner's details
    return new Response(JSON.stringify({ winner: data[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
