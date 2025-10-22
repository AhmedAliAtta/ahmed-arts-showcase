import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ProfileManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) {
      setFormData({
        full_name: data.full_name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user?.id);

    if (error) {
      toast({
        title: 'حدث خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم تحديث معلومات البروفايل',
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">إدارة البروفايل</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="full_name">الاسم الكامل</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="bio">النبذة الشخصية</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="نبذة مختصرة عنك وعن خبرتك..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+20 123 456 7890"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="whatsapp">رقم الواتساب</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="201234567890"
            />
            <p className="text-sm text-muted-foreground mt-1">
              أدخل الرقم بدون + أو مسافات (مثال: 201234567890)
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileManager;
