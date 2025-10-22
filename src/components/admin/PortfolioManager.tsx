import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const categories = [
  { value: 'brand_identity', label: 'هوية بصرية' },
  { value: 'logo_design', label: 'تصميم شعارات' },
  { value: 'poster_design', label: 'تصميم بوستر' },
  { value: 'social_media', label: 'سوشيال ميديا' },
  { value: 'packaging', label: 'تصميم تغليف' },
  { value: 'web_design', label: 'تصميم ويب' },
  { value: 'illustration', label: 'رسوم توضيحية' },
  { value: 'other', label: 'أخرى' },
];

const PortfolioManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      toast({ title: 'تم الحذف بنجاح' });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      toast({ title: 'يرجى اختيار صورة', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      // Upload image
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      // Insert portfolio item
      const formData = new FormData(e.currentTarget);
      const { error: insertError } = await supabase
        .from('portfolio_items')
        .insert([{
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          category: formData.get('category') as any,
          image_url: publicUrl,
        }]);

      if (insertError) throw insertError;

      toast({ title: 'تمت الإضافة بنجاح' });
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      setIsDialogOpen(false);
      setImageFile(null);
    } catch (error: any) {
      toast({ title: 'حدث خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">إدارة الأعمال</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              إضافة عمل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة عمل جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">الصورة</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? 'جاري الرفع...' : 'إضافة'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {item.views_count}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;
