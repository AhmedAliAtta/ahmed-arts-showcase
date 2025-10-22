import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "برامج التصميم",
      skills: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Figma"]
    },
    {
      title: "التخصصات",
      skills: ["هويات بصرية", "تصميم إعلانات", "سوشيال ميديا", "تصميم ويب UI/UX", "تصميم طباعة"]
    },
    {
      title: "المهارات الإضافية",
      skills: ["Typography", "Color Theory", "Branding", "Motion Graphics"]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            المهارات والخبرات
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أدوات وتقنيات التصميم التي أتقنها
          </p>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className="animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 150}ms` }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <Badge 
                    key={skillIndex}
                    variant="secondary"
                    className="text-base py-2 px-4 bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
