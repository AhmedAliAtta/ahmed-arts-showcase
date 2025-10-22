import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            آراء العملاء
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما يقوله عملائي عن تجربتهم معي
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="p-6 bg-card border-border hover:border-primary transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "{testimonial.message}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-bold">{testimonial.client_name}</p>
                {testimonial.client_title && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.client_title}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
