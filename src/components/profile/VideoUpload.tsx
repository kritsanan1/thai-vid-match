import { useState, useRef } from 'react';
import { Camera, Upload, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  currentVideoUrl?: string;
  onVideoUploaded: (url: string) => void;
  onVideoRemoved: () => void;
}

const VideoUpload = ({ currentVideoUrl, onVideoUploaded, onVideoRemoved }: VideoUploadProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentVideoUrl || null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 640, facingMode: 'user' },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Stop the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเข้าถึงกล้องได้",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: "ไฟล์ใหญ่เกินไป",
            description: "กรุณาเลือกวิดีโอที่มีขนาดไม่เกิน 50MB",
            variant: "destructive",
          });
          return;
        }
        
        setRecordedBlob(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์วิดีโอ",
          variant: "destructive",
        });
      }
    }
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileName = `${user.id}/profile-video-${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, recordedBlob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      // For now, we'll store video URL in localStorage since the schema doesn't have video_url yet
      localStorage.setItem(`user_video_${user.id}`, publicUrl);

      onVideoUploaded(publicUrl);
      setRecordedBlob(null);
      
      toast({
        title: "อัปโหลดสำเร็จ! 🎥",
        description: "วิดีโอโปรไฟล์ของคุณถูกบันทึกแล้ว",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดวิดีโอได้",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove video URL from localStorage
      localStorage.removeItem(`user_video_${user.id}`);

      setPreviewUrl(null);
      setRecordedBlob(null);
      onVideoRemoved();
      
      toast({
        title: "ลบวิดีโอแล้ว",
        description: "วิดีโอโปรไฟล์ถูกลบออกแล้ว",
      });
    } catch (error) {
      console.error('Error removing video:', error);
    }
  };

  return (
    <Card className="swipe-card">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">วิดีโอโปรไฟล์</h3>
          {previewUrl && (
            <Badge variant="secondary">มีวิดีโอแล้ว</Badge>
          )}
        </div>

        {previewUrl ? (
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover"
                poster="/placeholder.svg"
              />
            </div>
            
            <div className="flex gap-2">
              {recordedBlob && (
                <Button 
                  onClick={uploadVideo} 
                  disabled={isUploading}
                  className="btn-love flex-1"
                >
                  {isUploading ? 'กำลังอัปโหลด...' : 'บันทึกวิดีโอ'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={removeVideo}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isRecording ? (
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Button 
                  onClick={stopRecording}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  หยุดบันทึก
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-soft to-accent rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      แนะนำให้อัดวิดีโอแนะนำตัว 15-60 วินาที
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={startRecording} className="btn-love">
                    <Camera className="w-4 h-4 mr-2" />
                    บันทึกวิดีโอ
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    อัปโหลด
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 เคล็ดลับ: วิดีโอโปรไฟล์จะช่วยเพิ่มโอกาสในการจับคู่</p>
          <p>📱 ขนาดไฟล์สูงสุด: 50MB</p>
          <p>⏱️ ระยะเวลาแนะนำ: 15-60 วินาที</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;