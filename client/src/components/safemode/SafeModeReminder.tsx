import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield, Clock, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const SafeModeReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: safeModeStatus } = useQuery({
    queryKey: ['/api/safe-mode/status'],
  });

  const toggleSafeModeMutation = useMutation({
    mutationFn: (enabled: boolean) => 
      apiRequest('/api/safe-mode/toggle', {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      }),
    onSuccess: (data) => {
      toast({
        title: data.enabled ? "เซฟโหมดยังคงเปิดอยู่" : "ปิดเซฟโหมดแล้ว ⚡",
        description: data.enabled 
          ? "ขอบคุณที่ใช้เซฟโหมดอย่างต่อเนื่อง" 
          : "กลับสู่ระบบสไวป์ปกติแล้ว",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/safe-mode/status'] });
      setShowReminder(false);
      setShowDetailDialog(false);
    },
  });

  // Check if reminder should be shown
  useEffect(() => {
    if (!safeModeStatus?.enabled) return;

    const activatedAt = safeModeStatus.activatedAt;
    const reminderInterval = safeModeStatus.reminderInterval || 7;
    const lastReminder = safeModeStatus.lastSafeModeReminder;

    if (!activatedAt) return;

    const now = new Date();
    const activatedDate = new Date(activatedAt);
    const daysSinceActivation = Math.floor((now.getTime() - activatedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shouldShow = false;

    if (lastReminder) {
      const lastReminderDate = new Date(lastReminder);
      const daysSinceLastReminder = Math.floor((now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24));
      shouldShow = daysSinceLastReminder >= reminderInterval;
    } else {
      shouldShow = daysSinceActivation >= reminderInterval;
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowReminder(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [safeModeStatus]);

  const handleKeepSafeMode = () => {
    // Mark reminder as sent
    setShowReminder(false);
    toast({
      title: "เซฟโหมดยังคงเปิดอยู่",
      description: "จะแจ้งเตือนอีกครั้งตามเวลาที่กำหนด",
    });
  };

  const handleDisableSafeMode = () => {
    toggleSafeModeMutation.mutate(false);
  };

  const handleMoreInfo = () => {
    setShowDetailDialog(true);
  };

  const daysSinceActivation = safeModeStatus?.activatedAt 
    ? Math.floor((new Date().getTime() - new Date(safeModeStatus.activatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (!showReminder || !safeModeStatus?.enabled) return null;

  return (
    <>
      {/* Banner Reminder */}
      <Card className="mb-4 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">การแจ้งเตือนเซฟโหมด</h3>
                <p className="text-sm text-orange-700">
                  คุณใช้เซฟโหมดมา {daysSinceActivation} วันแล้ว
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                <Clock className="w-3 h-3 mr-1" />
                {daysSinceActivation} วัน
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setShowReminder(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <Button 
              size="sm" 
              onClick={handleKeepSafeMode}
              className="btn-love"
            >
              ใช้ต่อ
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDisableSafeMode}
              disabled={toggleSafeModeMutation.isPending}
            >
              กลับสไวป์
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMoreInfo}
            >
              <Settings className="w-4 h-4 mr-1" />
              ตั้งค่า
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              เซฟโหมดของคุณ
            </DialogTitle>
            <DialogDescription>
              ปรับแต่งการใช้งานเซฟโหมดให้เหมาะกับคุณ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-800">{daysSinceActivation}</p>
                  <p className="text-xs text-orange-600">วันที่ใช้</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-800">{safeModeStatus?.reminderInterval || 7}</p>
                  <p className="text-xs text-orange-600">วัน/แจ้งเตือน</p>
                </div>
              </div>
            </div>

            {/* Benefits Reminder */}
            <div className="space-y-2">
              <h4 className="font-medium">ประโยชน์ของเซฟโหมด:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ลดความเครียดจากการสไวป์</li>
                <li>• มีเวลาคิดและตัดสินใจมากขึ้น</li>
                <li>• เรียกดูโปรไฟล์อย่างละเอียด</li>
                <li>• สร้างการเชื่อมต่อที่มีคุณภาพ</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailDialog(false)}
                className="flex-1"
              >
                ปิด
              </Button>
              <Button 
                onClick={handleKeepSafeMode}
                className="flex-1 btn-love"
              >
                ใช้ต่อ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SafeModeReminder;