import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) throw new Error('User not authenticated');

    const { targetUserId } = await req.json();

    // Get both user profiles
    const { data: userProfile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: targetProfile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (!userProfile || !targetProfile) {
      throw new Error('Profile not found');
    }

    // Calculate compatibility score
    const compatibilityFactors = calculateCompatibility(userProfile, targetProfile);
    const finalScore = Math.round(compatibilityFactors.totalScore);

    // Save AI match score
    const { error: saveError } = await supabaseClient
      .from('ai_match_scores')
      .upsert({
        user1_id: user.id,
        user2_id: targetUserId,
        compatibility_score: finalScore,
        factors: compatibilityFactors,
        calculated_at: new Date().toISOString()
      });

    if (saveError) throw saveError;

    return new Response(JSON.stringify({
      compatibility_score: finalScore,
      factors: compatibilityFactors
    }), {
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

function calculateCompatibility(user1: any, user2: any) {
  let totalScore = 0;
  const factors: any = {};

  // Age compatibility (15 points max)
  const ageDiff = Math.abs(user1.age - user2.age);
  const ageScore = Math.max(0, 15 - ageDiff);
  factors.age_compatibility = ageScore;
  totalScore += ageScore;

  // Interest overlap (25 points max)
  const user1Interests = user1.interests || [];
  const user2Interests = user2.interests || [];
  const commonInterests = user1Interests.filter((interest: string) => 
    user2Interests.includes(interest)
  );
  const interestScore = Math.min(25, commonInterests.length * 5);
  factors.interest_overlap = interestScore;
  factors.common_interests = commonInterests;
  totalScore += interestScore;

  // Location proximity (20 points max)
  let locationScore = 0;
  if (user1.latitude && user1.longitude && user2.latitude && user2.longitude) {
    const distance = calculateDistance(
      user1.latitude, user1.longitude,
      user2.latitude, user2.longitude
    );
    locationScore = Math.max(0, 20 - distance / 5); // 1 point per 5km
  }
  factors.location_proximity = locationScore;
  totalScore += locationScore;

  // Profile completeness (20 points max)
  const user1Completeness = calculateProfileCompleteness(user1);
  const user2Completeness = calculateProfileCompleteness(user2);
  const completenessScore = ((user1Completeness + user2Completeness) / 2) * 0.2;
  factors.profile_completeness = completenessScore;
  totalScore += completenessScore;

  // Activity level (10 points max)
  const user1Activity = calculateActivityScore(user1.last_active);
  const user2Activity = calculateActivityScore(user2.last_active);
  const activityScore = ((user1Activity + user2Activity) / 2) * 0.1;
  factors.activity_level = activityScore;
  totalScore += activityScore;

  // Verification status (10 points max)
  let verificationScore = 0;
  if (user1.verification_status === 'verified') verificationScore += 5;
  if (user2.verification_status === 'verified') verificationScore += 5;
  factors.verification_status = verificationScore;
  totalScore += verificationScore;

  factors.totalScore = Math.min(100, totalScore);
  return factors;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateProfileCompleteness(profile: any): number {
  let score = 0;
  if (profile.bio && profile.bio.length > 10) score += 25;
  if (profile.profile_images && profile.profile_images.length > 1) score += 25;
  if (profile.video_url) score += 25;
  if (profile.interests && profile.interests.length > 3) score += 25;
  return score;
}

function calculateActivityScore(lastActive: string): number {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const daysSinceActive = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceActive <= 1) return 100;
  if (daysSinceActive <= 3) return 80;
  if (daysSinceActive <= 7) return 60;
  if (daysSinceActive <= 14) return 40;
  if (daysSinceActive <= 30) return 20;
  return 0;
}