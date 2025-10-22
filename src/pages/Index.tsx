import Hero from "@/components/Hero";
import About from "@/components/About";
import DynamicPortfolio from "@/components/DynamicPortfolio";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <DynamicPortfolio />
      <Testimonials />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
