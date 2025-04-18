import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import LandingSection from './components/LandingSection';
import StarBackground from './components/StarBackground';
import './App.css';

// Lazy load components that aren't needed on initial load
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

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
        }
      },
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );
    
    observer.observe(observedElement);
    
    return () => {
      if (observedElement) {
        observer.unobserve(observedElement);
      }
    };
  }, []);
  
  // Throttle scroll event for improved performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const progress = Math.min(Math.max(scrollPosition / 300, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Global star background */}
      <StarBackground />
      
      <LandingSection 
        fadeOut={scrollProgress} 
        showHeader={showHeader} 
        landingRef={landingRef} 
      />
      <Suspense fallback={<div className="loading-section">Loading...</div>}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<div className="loading-section">Loading...</div>}>
        <ContactSection />
      </Suspense>
    </div>
  );
}

export default App;
