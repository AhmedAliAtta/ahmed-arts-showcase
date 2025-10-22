import { Card } from "@/components/ui/card";
import { Palette, Sparkles, Target } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "إبداع فني",
      description: "تصاميم فريدة تعكس رؤيتك بأسلوب عصري ومميز"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent" />,
      title: "جودة عالية",
      description: "اهتمام بالتفاصيل وتسليم عمل احترافي في الوقت المحدد"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "تحقيق الأهداف",
      description: "تصاميم استراتيجية تساعد في تحقيق أهدافك التسويقية"
    }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            من أنا؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            مصمم جرافيك متخصص في تصميم الهويات البصرية، الإعلانات، والتصاميم الرقمية. 
            أساعد الشركات والأفراد على التميز من خلال تصاميم إبداعية واحترافية.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
