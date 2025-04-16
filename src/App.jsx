import { useState, useEffect, useRef } from 'react';
import LandingSection from './components/LandingSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import BackgroundStars from './components/BackgroundStars';
import './App.css';

function App() {
  const [showHeader, setShowHeader] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const landingRef = useRef(null);

  // Handle header visibility with Intersection Observer
  useEffect(() => {
    const observedElement = landingRef.current;
    
    if (!observedElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // When landing section goes out of view, show header
        if (entries[0]) {
          setShowHeader(!entries[0].isIntersecting);
          console.log("Header visibility changed:", !entries[0].isIntersecting);
        }
      },
      {
        root: null,
        threshold: 0.1, // Header appears when 90% of the landing section is out of view
      }
    );
    
    observer.observe(observedElement);
    
    return () => {
      if (observedElement) observer.unobserve(observedElement);
    };
  }, []);

  // Handle scroll progress for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const progress = Math.min(Math.max(scrollPosition / 300, 0), 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Subtle background stars that won't interfere with header */}
      <BackgroundStars />
      
      <LandingSection 
        fadeOut={scrollProgress} 
        showHeader={showHeader} 
        landingRef={landingRef} 
      />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App;
