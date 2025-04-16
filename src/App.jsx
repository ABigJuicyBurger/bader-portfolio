import { useState, useEffect, useRef } from 'react';
import LandingSection from './components/LandingSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import './App.css';

function App() {
  const [showHeaderMode, setShowHeaderMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerTransitionProgress, setHeaderTransitionProgress] = useState(0);
  const landingRef = useRef(null);

  useEffect(() => {
    const observedElement = landingRef.current;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowHeaderMode(!entry.isIntersecting);
      },
      {
        threshold: 0.01,
      }
    );
    
    if (observedElement) {
      observer.observe(observedElement);
    }
    
    return () => {
      if (observedElement) observer.unobserve(observedElement);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const progress = Math.min(Math.max(scrollPosition / 300, 0), 1);
      
      // This creates a separate progress value specifically for the header transition
      // It starts earlier and completes faster for a more dynamic effect
      const headerProgress = Math.min(Math.max((scrollPosition - 50) / 200, 0), 1);
      
      setScrollProgress(progress);
      setHeaderTransitionProgress(headerProgress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <LandingSection 
        fadeOut={scrollProgress} 
        showHeaderMode={showHeaderMode} 
        landingRef={landingRef} 
        transitionProgress={headerTransitionProgress}
      />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App;
