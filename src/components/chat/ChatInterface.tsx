import { useState, useEffect, useRef } from 'react';
import { Send, Heart, MoreVertical, Phone, Video, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  other_user: {
    user_id: string;
    full_name: string;
    profile_images: string[];
    age: number;
    last_active: string;
  };
}

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

const ChatInterface = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      markMessagesAsRead(selectedMatch.id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedMatch) {
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`messages:${selectedMatch.id}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `match_id=eq.${selectedMatch.id}`
          }, 
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedMatch]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: matchesData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'matched')
        .order('matched_at', { ascending: false });

      if (error) throw error;

      // Get other user profiles for each match
      const formattedMatches = [];
      if (matchesData) {
        for (const match of matchesData) {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('user_id, full_name, profile_images, age, last_active')
            .eq('user_id', otherUserId)
            .single();

          if (profileData) {
            formattedMatches.push({
              ...match,
              other_user: profileData
            });
          }
        }
      }

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('id, match_id, sender_id, content, message_type, created_at, updated_at')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = messagesData?.map(msg => ({
        ...msg,
        is_read: true // For now, assume all fetched messages are read
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (matchId: string) => {
    try {
      // Update message status to 'read' for messages from other users
      await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('match_id', matchId)
        .neq('sender_id', currentUser?.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || !currentUser) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: selectedMatch.id,
          sender_id: currentUser.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อความได้",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reportUser = async () => {
    if (!selectedMatch || !currentUser) return;

    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: currentUser.id,
          reported_id: selectedMatch.other_user.user_id,
          reason: 'inappropriate_behavior',
          description: 'Reported from chat interface'
        });

      if (error) throw error;

      toast({
        title: "รายงานแล้ว",
        description: "เราจะตรวจสอบรายงานของคุณ",
      });
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    if (days < 7) return `${days} วันที่แล้ว`;
    return date.toLocaleDateString('th-TH');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Heart className="w-8 h-8 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">กำลังโหลดการสนทนา...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Heart className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">ยังไม่มีการจับคู่</h2>
        <p className="text-muted-foreground">
          เริ่มสไวป์เพื่อค้นหาคนที่ใช่และเริ่มแชท!
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {!selectedMatch ? (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">การจับคู่ของคุณ</h2>
          <div className="space-y-3">
            {matches.map((match) => (
              <Card 
                key={match.id} 
                className="swipe-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMatch(match)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={match.other_user.profile_images[0]} 
                        alt={match.other_user.full_name} 
                      />
                      <AvatarFallback>
                        {match.other_user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold truncate">
                          {match.other_user.full_name}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {formatTime(match.matched_at)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        กดเพื่อเริ่มแชท
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedMatch(null)}
                >
                  ←
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={selectedMatch.other_user.profile_images[0]} 
                    alt={selectedMatch.other_user.full_name} 
                  />
                  <AvatarFallback>
                    {selectedMatch.other_user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-semibold">{selectedMatch.other_user.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    ออนไลน์ {formatTime(selectedMatch.other_user.last_active)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={reportUser}>
                      <Flag className="w-4 h-4 mr-2" />
                      รายงานผู้ใช้
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender_id === currentUser?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === currentUser?.id 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="btn-love"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;