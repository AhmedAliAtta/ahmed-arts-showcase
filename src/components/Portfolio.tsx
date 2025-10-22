import { Card } from "@/components/ui/card";
import work1 from "@/assets/work1.jpg";
import work2 from "@/assets/work2.jpg";
import work3 from "@/assets/work3.jpg";
import work4 from "@/assets/work4.jpg";
import work5 from "@/assets/work5.jpg";
import work6 from "@/assets/work6.jpg";

const Portfolio = () => {
  const works = [
    { image: work1, title: "هوية بصرية", category: "Brand Identity" },
    { image: work2, title: "تصميم بوستر", category: "Poster Design" },
    { image: work3, title: "سوشيال ميديا", category: "Social Media" },
    { image: work4, title: "تصميم تغليف", category: "Packaging" },
    { image: work5, title: "تصميم ويب", category: "Web Design" },
    { image: work6, title: "تصميم شعارات", category: "Logo Design" }
  ];

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
          {works.map((work, index) => (
            <Card 
              key={index}
              className="group overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={work.image} 
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{work.title}</h3>
                    <p className="text-sm text-muted-foreground">{work.category}</p>
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

export default Portfolio;
