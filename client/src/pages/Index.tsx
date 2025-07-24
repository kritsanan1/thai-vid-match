import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MessageCircle, User, Sparkles, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthModal from '@/components/auth/AuthModal';
import ProfileCard from '@/components/profile/ProfileCard';
import SwipeInterface from '@/components/swipe/SwipeInterface';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('discover');
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        toast({
          title: "ยินดีต้อนรับสู่ LoveMatch Thailand! 💕",
          description: "พบเจอความรักแท้ในแบบที่คุณเป็น",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center space-y-8 max-w-lg">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                LoveMatch Thailand
              </h1>
              <p className="text-muted-foreground text-lg">
                พบเจอความรักแท้ผ่านวิดีโอและ AI ที่เข้าใจคุณ
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="swipe-card p-4">
                <CardContent className="p-0 text-center">
                  <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">วิดีโอโปรไฟล์</p>
                </CardContent>
              </Card>
              <Card className="swipe-card p-4">
                <CardContent className="p-0 text-center">
                  <Sparkles className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-sm font-medium">AI Matching</p>
                </CardContent>
              </Card>
              <Card className="swipe-card p-4">
                <CardContent className="p-0 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">แชทปลอดภัย</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={() => setShowAuth(true)}
                className="btn-love w-full text-lg py-6"
              >
                เริ่มต้นค้นหาความรัก
              </Button>
              <p className="text-sm text-muted-foreground">
                มีบัญชีแล้ว?{' '}
                <button 
                  onClick={() => setShowAuth(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  เข้าสู่ระบบ
                </button>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-2 pt-4">
              <Badge variant="secondary" className="text-xs">
                🔒 ปลอดภัย 100%
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ✨ AI ที่ฉลาด
              </Badge>
              <Badge variant="secondary" className="text-xs">
                💕 สำหรับคนไทย
              </Badge>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </div>
    );
  }

  // Main App Interface
  return (
    <div className="min-h-screen bg-background">
      {/* Content based on current view */}
      <div className="pb-20">
        {currentView === 'discover' && <SwipeInterface />}
        {currentView === 'matches' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">การจับคู่ของคุณ</h2>
            <p className="text-muted-foreground">ยังไม่มีการจับคู่ เริ่มสไวป์เพื่อค้นหาคนที่ใช่!</p>
          </div>
        )}
        {currentView === 'chat' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">แชท</h2>
            <p className="text-muted-foreground">ยังไม่มีการสนทนา พบเจอคนใหม่เพื่อเริ่มแชท!</p>
          </div>
        )}
        {currentView === 'profile' && <ProfileCard />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  );
};

export default Index;