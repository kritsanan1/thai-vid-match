import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Bell, Shield, Heart, ChevronLeft } from 'lucide-react';
import SafeModeToggle from '@/components/safemode/SafeModeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

const Settings = () => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/')}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              การตั้งค่า
            </h1>
            <p className="text-muted-foreground">จัดการบัญชีและความต้องการของคุณ</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                ข้อมูลบัญชี
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user?.isVerified ? "default" : "secondary"}>
                      {user?.isVerified ? '✓ ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      สมาชิกตั้งแต่ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH') : ''}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  แก้ไข
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safe Mode Settings */}
          <SafeModeToggle />

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                การแจ้งเตือน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">แจ้งเตือนแมทช์ใหม่</p>
                    <p className="text-sm text-muted-foreground">ได้รับการแจ้งเตือนเมื่อมีคนสนใจคุณ</p>
                  </div>
                  <Button variant="outline" size="sm">เปิด</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">แจ้งเตือนข้อความ</p>
                    <p className="text-sm text-muted-foreground">ได้รับการแจ้งเตือนข้อความใหม่</p>
                  </div>
                  <Button variant="outline" size="sm">เปิด</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">เคล็ดลับการหาคู่</p>
                    <p className="text-sm text-muted-foreground">รับคำแนะนำเพื่อปรับปรุงโปรไฟล์</p>
                  </div>
                  <Button variant="outline" size="sm">เปิด</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ความปลอดภัย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">ซ่อนโปรไฟล์</p>
                    <p className="text-sm text-muted-foreground">หยุดแสดงโปรไฟล์ของคุณชั่วคราว</p>
                  </div>
                  <Button variant="outline" size="sm">ปิด</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">บล็อกผู้ติดต่อ</p>
                    <p className="text-sm text-muted-foreground">จัดการรายชื่อผู้ที่ถูกบล็อก</p>
                  </div>
                  <Button variant="ghost" size="sm">จัดการ</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">รายงานปัญหา</p>
                    <p className="text-sm text-muted-foreground">รายงานพฤติกรรมที่ไม่เหมาะสม</p>
                  </div>
                  <Button variant="ghost" size="sm">รายงาน</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                ความต้องการในการหาคู่
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">ช่วงอายุ</p>
                    <p className="text-sm text-muted-foreground">18 - 50 ปี</p>
                  </div>
                  <Button variant="ghost" size="sm">แก้ไข</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">ระยะทาง</p>
                    <p className="text-sm text-muted-foreground">ภายใน 50 กม.</p>
                  </div>
                  <Button variant="ghost" size="sm">แก้ไข</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">เพศที่สนใจ</p>
                    <p className="text-sm text-muted-foreground">ทุกเพศ</p>
                  </div>
                  <Button variant="ghost" size="sm">แก้ไข</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  ข้อกำหนดการใช้งาน
                </Button>
                <Button variant="outline" className="w-full">
                  นโยบายความเป็นส่วนตัว
                </Button>
                <Button variant="outline" className="w-full">
                  ติดต่อสนับสนุน
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Version Info */}
          <div className="text-center text-xs text-muted-foreground py-4">
            LoveMatch Thailand v1.0.0
            <br />
            Made with ❤️ for Thai community
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;