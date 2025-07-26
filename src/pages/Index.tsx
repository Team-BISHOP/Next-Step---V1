import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareerPathsSection from "@/components/CareerPathsSection";
import AIQuizSection from "@/components/AIQuizSection";
import LearningSection from "@/components/LearningSection";
import GamificationSection from "@/components/GamificationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CareerPathsSection />
        <AIQuizSection />
        <LearningSection />
        <GamificationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
