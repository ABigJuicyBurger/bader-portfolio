import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ContactSection.module.css';

const ContactSection = () => {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Only set up the observer if animation hasn't played yet
    if (!animated && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            // Trigger animation when section is visible
            setAnimated(true);
            // Disconnect the observer since we only need to trigger once
            observer.disconnect();
          }
        },
        { threshold: 0.3 } // Trigger when 30% of the section is visible
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [animated]);

  return (
    <section className={styles.contact} id="contact" ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Connect{" "}
          <span className={`${styles.highlight} ${animated ? styles.animateText : ''}`}>
            With Me
          </span>
        </h2>
        <p className={styles.subtitle}>Let's collaborate on something stellar</p>
        
        <div className={styles.linksContainer}>
          <a 
            href="mailto:bader.muhssin@email.com" 
            className={styles.contactLink}
            aria-label="Email"
          >
            <div className={styles.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className={styles.linkLabel}>Email</span>
            </div>
          </a>
          
          <a 
            href="https://github.com/ABigJuicyBurger" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.contactLink}
            aria-label="GitHub"
          >
            <div className={styles.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span className={styles.linkLabel}>GitHub</span>
            </div>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/badermuhssin/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.contactLink}
            aria-label="LinkedIn"
          >
            <div className={styles.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span className={styles.linkLabel}>LinkedIn</span>
            </div>
          </a>
        </div>
        
        <p className={styles.footer}> {new Date().getFullYear()} Bader Muhssin • Full Stack Developer</p>
      </div>
    </section>
  );
};

export default ContactSection;
