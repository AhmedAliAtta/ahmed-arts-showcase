import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

const Contact = () => {
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
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            تواصل معي
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            هل لديك مشروع تصميم؟ دعنا نتحدث ونبدأ العمل معاً
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card 
              key={index}
              className="p-6 text-center bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                {method.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{method.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{method.value}</p>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                onClick={() => window.open(method.link, '_blank')}
              >
                اتصل الآن
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
