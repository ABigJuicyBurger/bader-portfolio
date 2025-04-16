import { useState, useEffect, useRef } from 'react';
import LandingSection from './components/LandingSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import './App.css';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const landingRef = useRef(null);

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
      <LandingSection 
        fadeOut={scrollProgress} 
        landingRef={landingRef} 
      />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App;
