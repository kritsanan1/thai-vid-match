import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Award } from 'lucide-react';
import RatingHistory from '@/components/rating/RatingHistory';
import MatchRatingModal from '@/components/rating/MatchRatingModal';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const Ratings = () => {
  const { user } = useAuth();
  const [showDemoRating, setShowDemoRating] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: [`/api/users/${user?.id}/rating-stats`],
    enabled: !!user?.id,
  });

  const stats = statsData || { averageRating: 0, categoryRatings: {}, totalRatings: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            การให้คะแนนและความคิดเห็น
          </h1>
          <p className="text-muted-foreground">
            ช่วยปรับปรุงระบบจับคู่ด้วยความคิดเห็นของคุณ
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="history">ประวัติการให้คะแนน</TabsTrigger>
            <TabsTrigger value="demo">ทดลองให้คะแนน</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    จาก 5.0 คะแนน
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">จำนวนการให้คะแนน</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalRatings || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ความคิดเห็นที่ได้รับ
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">อันดับ</CardTitle>
                  <Award className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating >= 4.5 ? 'S' : 
                     stats.averageRating >= 4.0 ? 'A' : 
                     stats.averageRating >= 3.5 ? 'B' : 
                     stats.averageRating >= 3.0 ? 'C' : 'D'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ระดับความพึงพอใจ
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            {Object.keys(stats.categoryRatings || {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    คะแนนตามหมวดหมู่
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.categoryRatings).map(([category, rating]) => {
                      const categoryLabels: Record<string, string> = {
                        conversation: 'การสนทนา',
                        photos: 'รูปภาพ',
                        compatibility: 'ความเข้ากัน',
                        personality: 'บุคลิกภาพ',
                      };
                      
                      const percentage = (rating / 5) * 100;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {categoryLabels[category] || category}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {rating.toFixed(1)}/5.0
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No ratings yet */}
            {stats.totalRatings === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">ยังไม่มีการให้คะแนน</h3>
                  <p className="text-muted-foreground mb-4">
                    เริ่มสร้างแมตช์และรับความคิดเห็นจากคู่แมตช์ของคุณ
                  </p>
                  <Button className="btn-love">
                    เริ่มหาแมตช์
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <RatingHistory />
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>ทดลองระบบให้คะแนน</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ทดลองใช้ระบบให้คะแนนเพื่อดูว่าจะทำงานอย่างไร
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowDemoRating(true)}
                  className="btn-love w-full"
                >
                  <Star className="w-4 h-4 mr-2" />
                  เปิดหน้าต่างให้คะแนนตัวอย่าง
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo Rating Modal */}
        <MatchRatingModal
          open={showDemoRating}
          onOpenChange={setShowDemoRating}
          matchId="demo-match-id"
          partnerName="สมาชิกตัวอย่าง"
        />
      </div>
    </div>
  );
};

export default Ratings;