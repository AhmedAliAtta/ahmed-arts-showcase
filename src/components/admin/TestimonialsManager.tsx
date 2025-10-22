import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TestimonialsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      toast({ title: 'تم الحذف بنجاح' });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('testimonials').insert({
      client_name: formData.get('client_name') as string,
      client_title: formData.get('client_title') as string,
      message: formData.get('message') as string,
      rating: parseInt(formData.get('rating') as string),
    });

    if (error) {
      toast({ title: 'حدث خطأ', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'تمت الإضافة بنجاح' });
    queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">إدارة الشهادات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              إضافة شهادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="client_name">اسم العميل</Label>
                <Input id="client_name" name="client_name" required />
              </div>
              <div>
                <Label htmlFor="client_title">المنصب</Label>
                <Input id="client_title" name="client_title" placeholder="مدير تنفيذي في..." />
              </div>
              <div>
                <Label htmlFor="message">الرسالة</Label>
                <Textarea id="message" name="message" rows={4} required />
              </div>
              <div>
                <Label htmlFor="rating">التقييم</Label>
                <Select name="rating" defaultValue="5" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} نجوم
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                إضافة
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{testimonial.client_name}</h3>
                  {testimonial.client_title && (
                    <p className="text-sm text-muted-foreground">{testimonial.client_title}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(testimonial.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;
