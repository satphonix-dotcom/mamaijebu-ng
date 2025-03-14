
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

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({
          error: "Payment reference is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Verifying payment with reference: ${reference}`);

    // Verify the transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error("Error verifying payment:", verifyData);
      return new Response(
        JSON.stringify({
          error: verifyData.message || "Failed to verify payment",
        }),
        {
          status: verifyResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the payment was successful
    if (verifyData.data.status !== "success") {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Payment ${verifyData.data.status}`,
          data: verifyData.data,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract the user ID and plan details from the metadata
    const userId = verifyData.data.metadata?.userId;
    const planId = verifyData.data.metadata?.planId;
    const planName = verifyData.data.metadata?.planName;
    const planPeriod = verifyData.data.metadata?.planPeriod;
    
    if (!userId) {
      console.error("User ID not found in payment metadata");
      return new Response(
        JSON.stringify({
          error: "User ID not found in payment data",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the user's premium status in the database
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({ 
        is_premium: true,
        // Could store subscription details here if needed
      })
      .eq("id", userId)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating user profile:", profileError);
      return new Response(
        JSON.stringify({
          error: "Failed to update user profile",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create subscription record in a real app, we would store the subscription
    // details here along with expiry dates, etc.

    console.log("Payment verified and user upgraded successfully:", userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and premium status updated",
        data: {
          userId: userId,
          isPremium: true,
          planDetails: {
            id: planId,
            name: planName,
            period: planPeriod
          }
        },
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
