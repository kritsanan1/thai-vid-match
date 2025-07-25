import { useState, useEffect } from 'react';
import { Camera, Settings, LogOut, Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileCard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Try to get user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(profileData);
      }
    };

    getProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "ออกจากระบบแล้ว",
        description: "แล้วพบกันใหม่! 👋",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-sm mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="swipe-card">
        <CardContent className="p-6 text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto gradient-primary rounded-full flex items-center justify-center shadow-glow">
              {profile?.profile_images?.[0] ? (
                <img
                  src={profile.profile_images[0]}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </div>
            <Button
              size="sm"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">
            {profile?.full_name || 'โปรไฟล์ยังไม่สมบูรณ์'}
          </h2>
          
          {profile ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {profile.age} ปี • {profile.location || 'ไม่ระบุที่อยู่'}
              </p>
              <p className="text-sm">{profile.bio || 'ยังไม่มีคำแนะนำตัว'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">อายุไม่ระบุ • ที่อยู่ไม่ระบุ</p>
              <Button variant="outline" className="mt-2">
                สร้างโปรไฟล์
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Stats */}
      {profile && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="swipe-card">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">ไลค์</div>
            </CardContent>
          </Card>
          
          <Card className="swipe-card">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">แมทช์</div>
            </CardContent>
          </Card>
          
          <Card className="swipe-card">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">เยี่ยมชม</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Status */}
      <Card className="swipe-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">แพ็กเกจของคุณ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">FREE</Badge>
            <span className="text-sm text-muted-foreground">ใช้งานฟรี</span>
          </div>
          
          <Button className="btn-love w-full">
            อัปเกรดเป็น Premium
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✨ ไลค์ไม่จำกัด</p>
            <p>👀 ดูใครไลค์คุณ</p>
            <p>⚡ Boost โปรไฟล์</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="swipe-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">ตั้งค่าบัญชี</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            แก้ไขโปรไฟล์
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Heart className="w-4 h-4 mr-2" />
            ตั้งค่าการจับคู่
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>LoveMatch Thailand v1.0</p>
        <p>Made with 💕 for Thai singles</p>
      </div>
    </div>
  );
};

export default ProfileCard;