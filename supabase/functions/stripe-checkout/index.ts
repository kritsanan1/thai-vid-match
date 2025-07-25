import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) throw new Error('User not authenticated');

    const { planType } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define subscription plans
    const plans = {
      premium: {
        price: 299, // 299 THB
        name: 'LoveMatch Premium',
        features: ['ไลค์ไม่จำกัด', 'ดูใครไลค์คุณ', 'Boost โปรไฟล์', 'Super Likes 5 ครั้ง/วัน']
      },
      gold: {
        price: 599, // 599 THB  
        name: 'LoveMatch Gold',
        features: ['ทุกอย่างใน Premium', 'เปลี่ยนสถานที่ได้', 'อ่านข้อความแล้ว', 'Super Likes 10 ครั้ง/วัน']
      }
    };

    const selectedPlan = plans[planType as keyof typeof plans];
    if (!selectedPlan) throw new Error('Invalid plan type');

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: { 
              name: selectedPlan.name,
              description: selectedPlan.features.join(', ')
            },
            unit_amount: selectedPlan.price * 100, // Convert to satang
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/profile`,
      metadata: {
        user_id: user.id,
        plan_type: planType
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});