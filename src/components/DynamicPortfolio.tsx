import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const categoryLabels: Record<string, string> = {
  brand_identity: 'هوية بصرية',
  logo_design: 'تصميم شعارات',
  poster_design: 'تصميم بوستر',
  social_media: 'سوشيال ميديا',
  packaging: 'تصميم تغليف',
  web_design: 'تصميم ويب',
  illustration: 'رسوم توضيحية',
  other: 'أخرى',
};

const DynamicPortfolio = () => {
  const { data: works, isLoading } = useQuery({
    queryKey: ['portfolio-items-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const handleViewIncrement = async (id: string) => {
    await supabase.rpc('increment_portfolio_views', { item_id: id });
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              معرض الأعمال
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نماذج من أعمالي في مجالات التصميم المختلفة
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            معرض الأعمال
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نماذج من أعمالي في مجالات التصميم المختلفة
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works?.map((work, index) => (
            <Card 
              key={work.id}
              className="group overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleViewIncrement(work.id)}
            >
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={work.image_url} 
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{work.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabels[work.category]}
                    </p>
                    {work.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {work.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicPortfolio;
