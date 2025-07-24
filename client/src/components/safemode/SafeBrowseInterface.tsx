import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, MapPin, Calendar, GraduationCap, Briefcase, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SafeBrowseInterfaceProps {
  onShowProfile?: (userId: string) => void;
}

const SafeBrowseInterface = ({ onShowProfile }: SafeBrowseInterfaceProps) => {
  const [expandedProfiles, setExpandedProfiles] = useState<Set<string>>(new Set());

  const { data: profilesData, isLoading } = useQuery({
    queryKey: ['/api/discovery-profiles'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const profiles = profilesData?.profiles || [];

  const toggleExpanded = (profileId: string) => {
    const newExpanded = new Set(expandedProfiles);
    if (newExpanded.has(profileId)) {
      newExpanded.delete(profileId);
    } else {
      newExpanded.add(profileId);
    }
    setExpandedProfiles(newExpanded);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-orange-800">เซฟโหมด</h3>
          <p className="text-orange-600">กำลังโหลดโปรไฟล์...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Safe Mode Header */}
      <div className="text-center py-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <Shield className="w-10 h-10 text-orange-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-orange-800 mb-1">เซฟโหมด</h2>
        <p className="text-orange-600 text-sm">
          เรียกดูโปรไฟล์อย่างสบายใจ ไม่มีการสไวป์
        </p>
        <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700">
          {profiles.length} โปรไฟล์
        </Badge>
      </div>

      {/* Profile List */}
      {profiles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่มีโปรไฟล์ใหม่</h3>
            <p className="text-muted-foreground">
              ลองกลับมาดูใหม่ภายหลัง หรือปรับการตั้งค่าการค้นหา
            </p>
          </CardContent>
        </Card>
      ) : (
        profiles.map((profile: any) => {
          const isExpanded = expandedProfiles.has(profile.id);
          const age = profile.birthDate ? calculateAge(profile.birthDate) : profile.age;
          
          return (
            <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Profile Image */}
                  <div className="relative">
                    <img
                      src={profile.profileImages?.[0] || '/placeholder-avatar.jpg'}
                      alt={profile.displayName || profile.fullName}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-avatar.jpg';
                      }}
                    />
                    {profile.isVerified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg truncate">
                          {profile.displayName || profile.fullName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {age && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {age} ปี
                            </div>
                          )}
                          {profile.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {profile.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(profile.id)}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Bio Preview */}
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {/* Quick Info */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {profile.occupation && (
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {profile.occupation}
                        </Badge>
                      )}
                      {profile.education && (
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {profile.education}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <>
                    <Separator />
                    <div className="p-4 bg-gray-50">
                      {/* More Images */}
                      {profile.profileImages && profile.profileImages.length > 1 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">รูปภาพเพิ่มเติม</h4>
                          <div className="flex gap-2 overflow-x-auto">
                            {profile.profileImages.slice(1, 4).map((image: string, index: number) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${profile.displayName} ${index + 2}`}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interests */}
                      {profile.interests && profile.interests.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">ความสนใจ</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.interests.slice(0, 6).map((interest: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => onShowProfile?.(profile.id)}
                          className="flex-1 btn-love"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          สนใจ
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onShowProfile?.(profile.id)}
                          className="flex-1"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          ดูเพิ่มเติม
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Safe Mode Reminder */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-blue-800">
            💡 เซฟโหมดช่วยให้คุณใช้เวลาคิดและตัดสินใจได้อย่างสบายใจ
            <br />
            <span className="text-blue-600">ปิดได้ตุกเมื่อในการตั้งค่า</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeBrowseInterface;