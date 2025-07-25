import { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  bio?: string;
  interests: string[];
  profile_images: string[];
  video_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  occupation?: string;
  education?: string;
  verification_status?: string;
  last_active?: string;
  compatibility_score?: number;
}

interface FilterSettings {
  ageRange: [number, number];
  maxDistance: number;
  interests: string[];
  verifiedOnly: boolean;
  hasVideo: boolean;
}

const AIMatchingEngine = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterSettings>({
    ageRange: [18, 50],
    maxDistance: 50,
    interests: [],
    verifiedOnly: false,
    hasVideo: false,
  });
  
  const { toast } = useToast();
  const location = useLocation();

  const availableInterests = [
    'ท่องเที่ยว', 'อ่านหนังสือ', 'หนัง', 'กาแฟ', 'เทคโนโลยี', 'ธรรมชาติ',
    'ถ่ายรูป', 'ไฮกิ้ง', 'ทำอาหาร', 'สัตว์เลี้ยง', 'ดนตรี', 'ศิลปะ',
    'กีฬา', 'ออกกำลังกาย', 'โยคะ', 'เต้นรำ', 'เกม', 'การ์ตูน'
  ];

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateCompatibilityScore = (profile: any) => {
    let score = 0;
    
    // Interest compatibility (40%)
    const currentUser = JSON.parse(localStorage.getItem('currentUserProfile') || '{}');
    const currentInterests = currentUser.interests || [];
    const profileInterests = profile.interests || [];
    const commonInterests = profileInterests.filter((interest: string) => 
      currentInterests.includes(interest)
    );
    score += (commonInterests.length / Math.max(profileInterests.length, 1)) * 40;
    
    // Location proximity (30%)
    if (location.latitude && location.longitude && profile.latitude && profile.longitude) {
      const distance = calculateDistance(
        location.latitude, location.longitude,
        profile.latitude, profile.longitude
      );
      score += Math.max(0, (50 - distance) / 50) * 30;
    }
    
    // Profile completeness (20%)
    let completeness = 0;
    if (profile.bio) completeness += 25;
    if (profile.video_url) completeness += 25;
    if (profile.profile_images.length > 1) completeness += 25;
    if (profile.verification_status === 'verified') completeness += 25;
    score += completeness * 0.2;
    
    // Recent activity (10%)
    const lastActive = new Date(profile.last_active);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, (7 - daysSinceActive) / 7) * 10;
    
    return Math.round(score);
  };

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profiles with filters
      let query = supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', user.id)
        .gte('age', filters.ageRange[0])
        .lte('age', filters.ageRange[1]);

      if (filters.verifiedOnly) {
        query = query.eq('verification_status', 'verified');
      }

      if (filters.hasVideo) {
        query = query.not('video_url', 'is', null);
      }

      // Exclude already swiped profiles
      const { data: swipedProfiles } = await supabase
        .from('swipe_actions')
        .select('swiped_id')
        .eq('swiper_id', user.id);

      const swipedIds = swipedProfiles?.map(s => s.swiped_id) || [];
      if (swipedIds.length > 0) {
        query = query.not('user_id', 'in', `(${swipedIds.join(',')})`);
      }

      const { data: profilesData, error } = await query.limit(20);

      if (error) throw error;

      // Calculate compatibility scores and sort
      const profilesWithScores = (profilesData || []).map((profile: any) => ({
        ...profile,
        interests: profile.interests || [],
        verification_status: profile.verification_status || 'unverified',
        last_active: profile.last_active || new Date().toISOString(),
        compatibility_score: calculateCompatibilityScore(profile)
      })).sort((a: any, b: any) => (b.compatibility_score || 0) - (a.compatibility_score || 0));

      setProfiles(profilesWithScores);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดโปรไฟล์ได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (isLike: boolean, isSuperLike: boolean = false) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Record swipe action
      const { error: swipeError } = await supabase
        .from('swipe_actions')
        .insert({
          swiper_id: user.id,
          swiped_id: currentProfile.user_id,
          is_like: isLike,
          is_super_like: isSuperLike
        });

      if (swipeError) throw swipeError;

      // If super like, create super like record
      if (isSuperLike && isLike) {
        // For now, we'll track super likes in the swipe_actions table with is_super_like flag
        console.log('Super like recorded in swipe_actions');
      }

      if (isLike) {
        // Check for mutual match
        const { data: mutualSwipe } = await supabase
          .from('swipe_actions')
          .select('*')
          .eq('swiper_id', currentProfile.user_id)
          .eq('swiped_id', user.id)
          .eq('is_like', true)
          .single();

        if (mutualSwipe) {
          toast({
            title: "🎉 It's a Match!",
            description: `คุณและ ${currentProfile.full_name} ไลค์กัน!`,
          });
        } else {
          toast({
            title: isSuperLike ? "Super Like ส่งแล้ว! ⭐" : "ไลค์แล้ว! 💕",
            description: `คุณได้${isSuperLike ? 'ส่ง Super Like ให้' : 'ไลค์'} ${currentProfile.full_name}`,
          });
        }
      }

      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Load more profiles
        await fetchProfiles();
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการสไวป์ได้",
        variant: "destructive",
      });
    }
  };

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Sparkles className="w-8 h-8 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">กำลังค้นหาคนที่เหมาะกับคุณ...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Heart className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">ไม่มีโปรไฟล์ใหม่</h2>
        <p className="text-muted-foreground mb-4">
          ลองปรับเงื่อนไขการค้นหาหรือกลับมาใหม่ภายหลัง
        </p>
        <Button onClick={() => setShowFilters(true)} variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          ปรับเงื่อนไขการค้นหา
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      {/* Header with AI badge and filters */}
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary-glow text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Matching
        </Badge>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">ตัวกรองการค้นหา</h3>
            
            <div>
              <label className="text-sm font-medium">อายุ: {filters.ageRange[0]}-{filters.ageRange[1]} ปี</label>
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => setFilters(prev => ({...prev, ageRange: value as [number, number]}))}
                min={18}
                max={60}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">ระยะทาง: {filters.maxDistance} กม.</label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={(value) => setFilters(prev => ({...prev, maxDistance: value[0]}))}
                min={1}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.verifiedOnly}
                onCheckedChange={(checked) => setFilters(prev => ({...prev, verifiedOnly: !!checked}))}
              />
              <label className="text-sm">เฉพาะบัญชีที่ยืนยันแล้ว</label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.hasVideo}
                onCheckedChange={(checked) => setFilters(prev => ({...prev, hasVideo: !!checked}))}
              />
              <label className="text-sm">มีวิดีโอโปรไฟล์</label>
            </div>

            <Button onClick={() => setShowFilters(false)} className="w-full">
              ใช้ตัวกรอง
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress indicator */}
      <div className="flex gap-1 mb-4">
        {profiles.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              index <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Profile Card */}
      <Card className="swipe-card overflow-hidden mb-6">
        <div className="relative">
          {/* Compatibility Score */}
          {currentProfile.compatibility_score && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                {currentProfile.compatibility_score}% Match
              </Badge>
            </div>
          )}

          {/* Profile Image/Video */}
          <div className="aspect-[3/4] bg-gradient-to-br from-primary-soft to-accent overflow-hidden">
            {currentProfile.video_url ? (
              <video
                src={currentProfile.video_url}
                poster={currentProfile.profile_images[0]}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentProfile.profile_images[0] || '/placeholder.svg'}
                alt={currentProfile.full_name}
                className="w-full h-full object-cover"
              />
            )}

            {/* Verification badge */}
            {currentProfile.verification_status === 'verified' && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  ✓ ยืนยันแล้ว
                </Badge>
              </div>
            )}
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">
                  {currentProfile.full_name}, {currentProfile.age}
                </h3>
              </div>
              
              {currentProfile.location && (
                <div className="flex items-center gap-1 text-sm opacity-90">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.location}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Bio */}
          {currentProfile.bio && (
            <p className="text-foreground">{currentProfile.bio}</p>
          )}

          {/* Occupation & Education */}
          <div className="space-y-2">
            {currentProfile.occupation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>💼</span>
                <span>{currentProfile.occupation}</span>
              </div>
            )}
            {currentProfile.education && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>🎓</span>
                <span>{currentProfile.education}</span>
              </div>
            )}
          </div>

          {/* Interests */}
          {currentProfile.interests && currentProfile.interests.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">ความสนใจ</h4>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Swipe Actions */}
      <div className="flex justify-center gap-6">
        <Button
          variant="outline"
          size="lg"
          className="btn-pass w-16 h-16 rounded-full p-0"
          onClick={() => handleSwipe(false)}
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Button
          size="lg"
          className="btn-love w-16 h-16 rounded-full p-0"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="w-6 h-6" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full p-0 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
          onClick={() => handleSwipe(true, true)}
        >
          <Star className="w-6 h-6" />
        </Button>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        AI ได้คัดเลือกคนที่เหมาะกับคุณแล้ว
      </p>
    </div>
  );
};

export default AIMatchingEngine;