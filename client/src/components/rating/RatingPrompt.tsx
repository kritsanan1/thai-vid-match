import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import MatchRatingModal from './MatchRatingModal';

interface RatingPromptProps {
  matchId: string;
  partnerName: string;
  partnerPhoto?: string;
  onDismiss: () => void;
}

const RatingPrompt = ({ matchId, partnerName, partnerPhoto, onDismiss }: RatingPromptProps) => {
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Auto-show after some interaction time (simulate engagement)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) {
        // This would normally be triggered by actual user interaction
        // For demo purposes, we'll show it after a delay
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  return (
    <>
      <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {partnerPhoto && (
                <img 
                  src={partnerPhoto} 
                  alt={partnerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">ให้คะแนนแมตช์กับ {partnerName}</p>
                <p className="text-sm text-muted-foreground">
                  ช่วยปรับปรุงระบบจับคู่ให้ดีขึ้น
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="btn-love"
              >
                <Star className="w-4 h-4 mr-2" />
                ให้คะแนน
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <MatchRatingModal
        open={showModal}
        onOpenChange={setShowModal}
        matchId={matchId}
        partnerName={partnerName}
      />
    </>
  );
};

export default RatingPrompt;