import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Clock, Info, Heart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const SafeModeToggle = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: safeModeStatus, isLoading } = useQuery({
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
        title: data.enabled ? "เปิดเซฟโหมดแล้ว 🛡️" : "ปิดเซฟโหมดแล้ว ⚡",
        description: data.enabled 
          ? "คุณจะเห็นโปรไฟล์ในรูปแบบรายการแทนการสไวป์"
          : "กลับมาใช้ระบบสไวป์ปกติแล้ว",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/safe-mode/status'] });
      setShowConfirmDialog(false);
      setPendingState(null);
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
      setPendingState(null);
    },
  });

  const updateReminderMutation = useMutation({
    mutationFn: (intervalDays: number) => 
      apiRequest('/api/safe-mode/reminder-interval', {
        method: 'PUT',
        body: JSON.stringify({ intervalDays }),
      }),
    onSuccess: () => {
      toast({
        title: "อัปเดตการแจ้งเตือนแล้ว",
        description: "ระบบจะแจ้งเตือนตามช่วงเวลาใหม่ที่ตั้งไว้",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/safe-mode/status'] });
    },
  });

  const handleToggleChange = (enabled: boolean) => {
    setPendingState(enabled);
    setShowConfirmDialog(true);
  };

  const confirmToggle = () => {
    if (pendingState !== null) {
      toggleSafeModeMutation.mutate(pendingState);
    }
  };

  const handleReminderIntervalChange = (value: string) => {
    updateReminderMutation.mutate(parseInt(value));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = safeModeStatus?.enabled || false;
  const activatedAt = safeModeStatus?.activatedAt;
  const reminderInterval = safeModeStatus?.reminderInterval || 7;

  return (
    <>
      <Card className={`transition-all duration-300 ${isActive ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  เซฟโหมด
                  {isActive && <Badge variant="secondary" className="bg-orange-100 text-orange-800">เปิดใช้งาน</Badge>}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isActive ? 'กำลังใช้โหมดเรียบง่าย' : 'โหมดการเรียกดูแบบผ่อนคลาย'}
                </p>
              </div>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleChange}
              disabled={toggleSafeModeMutation.isPending}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Description */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">เซฟโหมดคืออะไร?</p>
                <p className="text-blue-700">
                  {isActive ? (
                    "คุณจะเห็นโปรไฟล์ในรูปแบบรายการแทนการสไวป์ ช่วยลดความเครียดและให้เวลาคิด"
                  ) : (
                    "เปิดเพื่อเปลี่ยนจากการสไวป์เป็นการเรียกดูแบบรายการ เหมาะสำหรับการพักผ่อน"
                  )}
                </p>
              </div>
            </div>

            {/* Active Status */}
            {isActive && activatedAt && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">
                  เปิดใช้งานเมื่อ: {new Date(activatedAt).toLocaleDateString('th-TH')}
                </span>
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <Heart className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-800">ลดความเครียด</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-800">ใช้เวลาคิด</span>
              </div>
            </div>

            {/* Reminder Settings */}
            {isActive && (
              <div className="pt-3 border-t">
                <Label className="text-sm font-medium">การแจ้งเตือน</Label>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted-foreground">ทุก</span>
                  <Select 
                    value={reminderInterval.toString()} 
                    onValueChange={handleReminderIntervalChange}
                    disabled={updateReminderMutation.isPending}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">วัน</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ระบบจะแจ้งเตือนให้พิจารณาว่าจะใช้เซฟโหมดต่อหรือไม่
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {pendingState ? 'เปิดเซฟโหมด' : 'ปิดเซฟโหมด'}
            </DialogTitle>
            <DialogDescription>
              {pendingState ? (
                "คุณต้องการเปิดเซฟโหมดหรือไม่? จะเปลี่ยนจากการสไวป์เป็นการเรียกดูแบบรายการ"
              ) : (
                "คุณต้องการปิดเซฟโหมดและกลับมาใช้ระบบสไวป์ปกติหรือไม่?"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={confirmToggle}
              disabled={toggleSafeModeMutation.isPending}
              className={`flex-1 ${pendingState ? 'btn-love' : ''}`}
            >
              {toggleSafeModeMutation.isPending ? 'กำลังบันทึก...' : 'ยืนยัน'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SafeModeToggle;