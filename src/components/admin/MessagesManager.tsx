import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MessagesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({ title: 'تم الحذف بنجاح' });
    },
  });

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">الرسائل</h2>
          {unreadCount > 0 && (
            <p className="text-muted-foreground mt-1">
              {unreadCount} رسالة غير مقروءة
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {messages?.length === 0 ? (
          <Card className="p-8 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد رسائل بعد</p>
          </Card>
        ) : (
          messages?.map((message) => (
            <Card
              key={message.id}
              className={`p-6 ${!message.is_read ? 'border-primary' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {!message.is_read ? (
                      <Mail className="w-5 h-5 text-primary" />
                    ) : (
                      <MailOpen className="w-5 h-5 text-muted-foreground" />
                    )}
                    <h3 className="font-bold text-lg">{message.name}</h3>
                    {!message.is_read && (
                      <Badge variant="default">جديد</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>البريد: {message.email}</p>
                    {message.phone && <p>الهاتف: {message.phone}</p>}
                    <p>
                      التاريخ:{' '}
                      {format(new Date(message.created_at), 'PPP', { locale: ar })}
                    </p>
                  </div>
                  <p className="text-foreground">{message.message}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {!message.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                    >
                      تعليم كمقروء
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
