-- Create missing tables that failed in the first migration

-- Super likes table for tracking special likes
CREATE TABLE IF NOT EXISTS super_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- User boosts table for profile boosting
CREATE TABLE IF NOT EXISTS user_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  boost_type TEXT DEFAULT 'standard',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table for social features
CREATE TABLE IF NOT EXISTS dating_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'social',
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER DEFAULT 50,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES dating_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Reports table for safety features
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table for gamification
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Premium subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on missing tables
ALTER TABLE super_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for super_likes
CREATE POLICY "Users can view their own super likes" ON super_likes
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can create super likes" ON super_likes
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for user_boosts
CREATE POLICY "Users can view their own boosts" ON user_boosts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create boosts" ON user_boosts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dating_events
CREATE POLICY "Everyone can view active events" ON dating_events
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can create events" ON dating_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for event_attendees
CREATE POLICY "Users can view event attendees" ON event_attendees
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own attendance" ON event_attendees
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_reports
CREATE POLICY "Users can create reports" ON user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON user_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Add storage buckets for videos and profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;