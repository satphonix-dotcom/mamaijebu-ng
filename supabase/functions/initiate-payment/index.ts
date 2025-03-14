
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "";

    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "Payment service configuration error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { userId, userEmail, amount, callbackUrl } = await req.json();

    if (!userId || !userEmail || !amount) {
      return new Response(
        JSON.stringify({
          error: "User ID, email, and amount are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Initiating payment for user ${userId} with email ${userEmail}`);

    // Prepare the request to Paystack API
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amount * 100, // Paystack requires amount in kobo (smallest currency unit)
        callback_url: callbackUrl || `${req.headers.get("origin")}/premium-confirmation`,
        metadata: {
          userId: userId,
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userId,
            },
            {
              display_name: "Purchase Type",
              variable_name: "purchase_type",
              value: "premium_membership",
            },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Error from Paystack:", paystackData);
      return new Response(
        JSON.stringify({
          error: paystackData.message || "Failed to initialize payment",
        }),
        {
          status: paystackResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Payment initialized successfully:", paystackData.data.reference);

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
