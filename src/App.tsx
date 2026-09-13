import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyResultsDifferent from './components/WhyResultsDifferent';
import PathCards from './components/PathCards';
import NutritionSection from './components/NutritionSection';
import JourneyTimeline from './components/JourneyTimeline';
import OutcomesSection from './components/OutcomesSection';
import CommunitySection from './components/CommunitySection';
import PricingSection from './components/PricingSection';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WizardOnboarding from './components/WizardOnboarding';
import { useLang } from './context/LanguageContext';

// 1. Standalone Dedicated Questionnaire Assessment Page (First Entry / Entry Point)
function AssessmentPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      <WizardOnboarding />
    </div>
  );
}

// 2. Full Website Homepage Page (/home)
function HomePage() {
  const { dir, lang } = useLang();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen bg-dark-950 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={dir}>
      <Navbar />
      <main>
        <Hero />
        <WhyResultsDifferent />
        <PathCards />
        <NutritionSection />
        <JourneyTimeline />
        <OutcomesSection />
        <CommunitySection />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Root Entry Point: Dedicated Interactive Onboarding Page */}
      <Route path="/" element={<AssessmentPage />} />
      <Route path="/subscribe" element={<AssessmentPage />} />
      <Route path="/subscribe/:planId" element={<AssessmentPage />} />
      
      {/* Full Website Homepage */}
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
