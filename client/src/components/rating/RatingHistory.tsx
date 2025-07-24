import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Edit3, Calendar, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Rating {
  id: string;
  matchId: string;
  rating: number;
  feedback?: string;
  categories?: string[];
  wouldRecommend?: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  conversation: 'การสนทนา',
  photos: 'รูปภาพ',
  compatibility: 'ความเข้ากัน',
  personality: 'บุคลิกภาพ',
};

const RatingHistory = () => {
  const { data: ratingsData, isLoading } = useQuery({
    queryKey: ['/api/ratings/history'],
  });

  const ratings: Rating[] = ratingsData?.ratings || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ยังไม่มีการให้คะแนน</h3>
          <p className="text-muted-foreground">
            เมื่อคุณให้คะแนนแมตช์ ประวัติจะแสดงที่นี่
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">ประวัติการให้คะแนน</h2>
        <Badge variant="secondary">
          {ratings.length} รายการ
        </Badge>
      </div>

      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.rating}/5 ดาว
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(rating.createdAt), 'dd MMM yyyy')}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Categories */}
            {rating.categories && rating.categories.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">ด้านที่ประทับใจ:</p>
                <div className="flex flex-wrap gap-1">
                  {rating.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {CATEGORY_LABELS[category] || category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Would Recommend */}
            {rating.wouldRecommend !== null && rating.wouldRecommend !== undefined && (
              <div className="mb-3">
                <Badge 
                  variant={rating.wouldRecommend ? "default" : "secondary"}
                  className={rating.wouldRecommend ? "bg-green-100 text-green-800" : ""}
                >
                  {rating.wouldRecommend ? '✓ แนะนำ' : '✗ ไม่แนะนำ'}
                </Badge>
              </div>
            )}

            {/* Feedback */}
            {rating.feedback && (
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{rating.feedback}"
                  </p>
                </div>
              </div>
            )}

            <Separator className="my-3" />

            {/* Actions */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Match ID: {rating.matchId.slice(0, 8)}...
              </p>
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                แก้ไข
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RatingHistory;