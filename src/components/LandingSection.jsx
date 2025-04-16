import React, { useEffect, useRef } from 'react';
import styles from '../styles/LandingSection.module.css';
import Moon from './Moon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingSection = ({ fadeOut = 0, landingRef }) => {
  const moonRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const headerRef = useRef(null);
  
  useEffect(() => {
    if (!landingRef.current) return;
    
    // Create the scroll animation when the component mounts
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: landingRef.current,
        start: "top top", // Start at the top of the viewport
        end: "20% top", // End when 20% of the section is scrolled past the top
        scrub: true, // Smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      }
    });
    
    // Animate the moon to move from its original position to the header position
    timeline.to(moonRef.current, {
      y: -window.innerHeight * 0.4, // Move up by 40% of the viewport height
      x: -window.innerWidth * 0.35, // Move left by 35% of the viewport width
      scale: 0.3, // Scale down to 30% of original size
      ease: "power2.inOut",
    }, 0);
    
    // Animate the name to move from its original position to the header position
    timeline.to(nameRef.current, {
      y: -window.innerHeight * 0.4, // Move up by 40% of the viewport height
      x: -window.innerWidth * 0.2, // Move left by 20% of the viewport width
      scale: 0.6, // Scale down to 60% of original size
      ease: "power2.inOut",
    }, 0);
    
    // Fade out the tagline as we scroll
    timeline.to(taglineRef.current, {
      opacity: 0,
      ease: "power2.inOut",
    }, 0);
    
    // Create a header background that fades in
    timeline.to(headerRef.current, {
      opacity: 1,
      ease: "power2.inOut",
    }, 0);
    
    return () => {
      // Clean up the animation when component unmounts
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill();
      }
    };
  }, [landingRef]); // Add landingRef as a dependency
  
  return (
    <>
      {/* Header background */}
      <div 
        ref={headerRef}
        className={styles.headerBackground}
      />
      
      {/* Main landing section with elements that will transform */}
      <section 
        className={styles.landing} 
        id="landing"
        ref={landingRef}
        style={{ 
          opacity: 1 - fadeOut * 0.3,
        }}
      >
        <div className={styles.contentContainer}>
          <div 
            ref={moonRef}
            className={styles.moon}
          >
            <Moon type="crescent" />
          </div>
          <div className={styles.textContent}>
            <h1 
              ref={nameRef}
              className={styles.name}
            >
              Bader Muhssin
            </h1>
            <p 
              ref={taglineRef}
              className={styles.tagline}
            >
              Psychology ➔ Coding | Portfolio
            </p>
          </div>
        </div>
        <span 
          className={styles.scrollHint}
          style={{ opacity: 1 - fadeOut * 2 }}
        >
          ▼ Scroll Down
        </span>
      </section>
    </>
  );
};

export default LandingSection;
