
-- Create enum types
CREATE TYPE user_gender AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');
CREATE TYPE match_status AS ENUM ('pending', 'matched', 'rejected', 'blocked');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE social_platform AS ENUM ('facebook', 'instagram', 'tiktok', 'twitter');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'vip');

-- Users table for detailed profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  gender user_gender NOT NULL,
  location TEXT,
  bio TEXT,
  interests TEXT[],
  occupation TEXT,
  education TEXT,
  height INTEGER, -- in cm
  profile_video_url TEXT,
  profile_images TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media connections
CREATE TABLE social_media_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  platform_user_id TEXT NOT NULL,
  platform_username TEXT,
  access_token TEXT, -- encrypted
  is_active BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- User preferences for matching
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_gender user_gender[],
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 50,
  max_distance INTEGER DEFAULT 50, -- km
  show_me_on_discovery BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches between users
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status match_status DEFAULT 'pending',
  matched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_match UNIQUE (user1_id, user2_id)
);

-- Swipe actions (likes/passes)
CREATE TABLE swipe_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL, -- true for like, false for pass
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (swiper_id != swiped_id),
  CONSTRAINT unique_swipe UNIQUE (swiper_id, swiped_id)
);

-- Messages between matched users
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, video, gif
  media_url TEXT,
  status message_status DEFAULT 'sent',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI matching scores
CREATE TABLE ai_match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2) CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  factors JSONB, -- stores AI analysis factors
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_score UNIQUE (user1_id, user2_id)
);

-- Premium features and purchases
CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'THB',
  payment_status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User reports and moderation
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view active profiles" ON user_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for social_media_connections
CREATE POLICY "Users can manage their own social connections" ON social_media_connections
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own matches" ON matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for swipe_actions
CREATE POLICY "Users can create their own swipes" ON swipe_actions
  FOR INSERT WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can view their own swipes" ON swipe_actions
  FOR SELECT USING (auth.uid() = swiper_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS Policies for ai_match_scores
CREATE POLICY "Users can view their own match scores" ON ai_match_scores
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for user_purchases
CREATE POLICY "Users can manage their own purchases" ON user_purchases
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_reports
CREATE POLICY "Users can create reports" ON user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON user_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create mutual matches
CREATE OR REPLACE FUNCTION create_mutual_match()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if both users have liked each other
    IF NEW.is_like = true THEN
        -- Check if the swiped user has also liked the swiper
        IF EXISTS (
            SELECT 1 FROM swipe_actions 
            WHERE swiper_id = NEW.swiped_id 
            AND swiped_id = NEW.swiper_id 
            AND is_like = true
        ) THEN
            -- Create a match (ensure user1_id < user2_id for consistency)
            INSERT INTO matches (user1_id, user2_id, status, matched_at)
            VALUES (
                LEAST(NEW.swiper_id, NEW.swiped_id),
                GREATEST(NEW.swiper_id, NEW.swiped_id),
                'matched',
                NOW()
            )
            ON CONFLICT (user1_id, user2_id) DO UPDATE SET
                status = 'matched',
                matched_at = NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_match_on_mutual_like
    AFTER INSERT ON swipe_actions
    FOR EACH ROW EXECUTE FUNCTION create_mutual_match();
