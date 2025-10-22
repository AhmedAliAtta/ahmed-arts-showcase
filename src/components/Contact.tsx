import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  email: z.string().trim().email('البريد الإلكتروني غير صالح').max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل').max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        message: result.data.message,
      }]);

    if (error) {
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إرسال رسالتك. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم إرسال رسالتك بنجاح',
        description: 'سأتواصل معك قريباً',
      });
      e.currentTarget.reset();
    }

    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      value: "ahmed@ahmedarts.com",
      link: "mailto:ahmed@ahmedarts.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "الهاتف",
      value: "+20 123 456 7890",
      link: "tel:+201234567890"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "واتساب",
      value: "تواصل مباشر",
      link: "https://wa.me/201234567890"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            تواصل معي
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            هل لديك مشروع تصميم؟ دعنا نتحدث ونبدأ العمل معاً
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="أحمد محمد" 
                  required
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="ahmed@example.com" 
                  required
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="+20 123 456 7890"
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="message">الرسالة</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="أخبرني عن مشروعك..." 
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </Button>
            </form>
          </Card>

          {/* Contact Methods */}
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{method.title}</h3>
                    <p className="text-muted-foreground mb-3">{method.value}</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => window.open(method.link, '_blank')}
                    >
                      اتصل الآن
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
