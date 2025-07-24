import { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo - In real app, this would come from your database
const mockProfiles = [
  {
    id: '1',
    full_name: 'พิมพ์ลดา',
    age: 25,
    location: 'กรุงเทพฯ',
    bio: 'รักการท่องเที่ยว ชอบอ่านหนังสือ และดูหนัง Netflix 📚✈️🎬',
    interests: ['ท่องเที่ยว', 'อ่านหนังสือ', 'หนัง', 'กาแฟ'],
    profile_images: ['/placeholder.svg', '/placeholder.svg'],
    occupation: 'นักการตลาด',
    education: 'จุฬาลงกรณ์มหาวิทยาลัย',
  },
  {
    id: '2',
    full_name: 'ธนากร',
    age: 28,
    location: 'เชียงใหม่',
    bio: 'โปรแกรมเมอร์ที่รักธรรมชาติ ชอบไฮกิ้งและถ่ายรูป 🏔️📸💻',
    interests: ['เทคโนโลยี', 'ธรรมชาติ', 'ถ่ายรูป', 'ไฮกิ้ง'],
    profile_images: ['/placeholder.svg'],
    occupation: 'โปรแกรมเมอร์',
    education: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้า',
  },
  {
    id: '3',
    full_name: 'อารยา',
    age: 23,
    location: 'ภูเก็ต',
    bio: 'เชฟมือใหม่ ชอบทำอาหาร และรักสัตว์ 🍳🐱❤️',
    interests: ['ทำอาหาร', 'สัตว์เลี้ยง', 'ดนตรี', 'ศิลปะ'],
    profile_images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    occupation: 'เชฟ',
    education: 'สถาบันอาหารนานาชาติ',
  },
];

const SwipeInterface = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState(mockProfiles);
  const { toast } = useToast();

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (isLike: boolean) => {
    if (!currentProfile) return;

    try {
      // In a real app, you'd save this swipe action to the database
      // For now, we'll just show a toast and move to next profile
      
      if (isLike) {
        toast({
          title: "ไลค์แล้ว! 💕",
          description: `คุณได้ไลค์ ${currentProfile.full_name}`,
        });
      }

      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more profiles
        toast({
          title: "หมดแล้ว! 🎉",
          description: "ไม่มีโปรไฟล์ใหม่ในตอนนี้ กลับมาใหม่พรุ่งนี้!",
        });
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <Heart className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">ไม่มีโปรไฟล์ใหม่</h2>
        <p className="text-muted-foreground">
          กลับมาใหม่พรุ่งนี้เพื่อดูคนใหม่ๆ!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      {/* Progress indicator */}
      <div className="flex gap-1 mb-4">
        {profiles.map((_, index) => (
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
          {/* Profile Images */}
          <div className="aspect-[3/4] bg-gradient-to-br from-primary-soft to-accent overflow-hidden">
            <img
              src={currentProfile.profile_images[0]}
              alt={currentProfile.full_name}
              className="w-full h-full object-cover"
            />
            {currentProfile.profile_images.length > 1 && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  <Camera className="w-3 h-3 mr-1" />
                  {currentProfile.profile_images.length}
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
              
              <div className="flex items-center gap-1 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                {currentProfile.location}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Bio */}
          <p className="text-foreground">{currentProfile.bio}</p>

          {/* Occupation & Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>💼</span>
              <span>{currentProfile.occupation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🎓</span>
              <span>{currentProfile.education}</span>
            </div>
          </div>

          {/* Interests */}
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
          onClick={() => {
            toast({
              title: "Super Like! ⭐",
              description: "คุณได้ส่ง Super Like แล้ว!",
            });
            handleSwipe(true);
          }}
        >
          <Star className="w-6 h-6" />
        </Button>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        สไวป์ซ้ายเพื่อผ่าน • สไวป์ขวาเพื่อไลค์
      </p>
    </div>
  );
};

export default SwipeInterface;