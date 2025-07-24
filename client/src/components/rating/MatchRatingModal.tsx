import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MessageCircle, Camera, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface MatchRatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: string;
  partnerName: string;
}

const RATING_CATEGORIES = [
  { id: 'conversation', label: 'การสนทนา', icon: MessageCircle },
  { id: 'photos', label: 'รูปภาพ', icon: Camera },
  { id: 'compatibility', label: 'ความเข้ากัน', icon: Heart },
  { id: 'personality', label: 'บุคลิกภาพ', icon: Users },
];

const MatchRatingModal = ({ open, onOpenChange, matchId, partnerName }: MatchRatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitRatingMutation = useMutation({
    mutationFn: (ratingData: any) => 
      apiRequest(`/api/matches/${matchId}/rating`, {
        method: 'POST',
        body: JSON.stringify(ratingData),
      }),
    onSuccess: () => {
      toast({
        title: "ขอบคุณสำหรับการให้คะแนน! ⭐",
        description: "ความคิดเห็นของคุณจะช่วยปรับปรุงระบบจับคู่ให้ดีขึ้น",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ratings/history'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setRating(0);
    setFeedback('');
    setSelectedCategories([]);
    setWouldRecommend(null);
    setHoveredStar(0);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "กรุณาให้คะแนน",
        description: "โปรดเลือกจำนวนดาวก่อนส่งความคิดเห็น",
        variant: "destructive",
      });
      return;
    }

    // Get partner ID from match data (you might need to adjust this based on your match structure)
    const ratingData = {
      ratedUserId: matchId, // This should be the actual partner's user ID
      rating,
      feedback: feedback.trim() || null,
      categories: selectedCategories.length > 0 ? selectedCategories : null,
      wouldRecommend,
    };

    submitRatingMutation.mutate(ratingData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold">ให้คะแนนแมตช์</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            แบ่งปันประสบการณ์ของคุณกับ <span className="font-semibold">{partnerName}</span> 
            เพื่อช่วยปรับปรุงระบบจับคู่
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <Label className="text-base font-medium mb-3 block">คะแนนโดยรวม</Label>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 0 && 'คลิกเพื่อให้คะแนน'}
              {rating === 1 && 'ไม่พอใจมาก'}
              {rating === 2 && 'ไม่พอใจ'}
              {rating === 3 && 'ปานกลาง'}
              {rating === 4 && 'พอใจ'}
              {rating === 5 && 'พอใจมาก'}
            </p>
          </div>

          {/* Categories */}
          <div>
            <Label className="text-base font-medium mb-3 block">ด้านที่ประทับใจ (เลือกได้หลายข้อ)</Label>
            <div className="grid grid-cols-2 gap-2">
              {RATING_CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCategoryToggle(id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    selectedCategories.includes(id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div>
            <Label className="text-base font-medium mb-3 block">คุณจะแนะนำให้เพื่อนคุยกับเขาหรือไม่?</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`flex-1 p-3 rounded-lg border transition-colors ${
                  wouldRecommend === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Heart className="w-4 h-4 mx-auto mb-1" />
                <span className="text-sm">แนะนำ</span>
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`flex-1 p-3 rounded-lg border transition-colors ${
                  wouldRecommend === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm">ไม่แนะนำ</span>
              </button>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <Label htmlFor="feedback" className="text-base font-medium mb-3 block">
              ความคิดเห็นเพิ่มเติม (ไม่บังคับ)
            </Label>
            <Textarea
              id="feedback"
              placeholder="แบ่งปันความคิดเห็นของคุณ เช่น สิ่งที่ชอบ หรือข้อเสนอแนะ..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {feedback.length}/500 อักขระ
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitRatingMutation.isPending || rating === 0}
              className="flex-1 btn-love"
            >
              {submitRatingMutation.isPending ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchRatingModal;