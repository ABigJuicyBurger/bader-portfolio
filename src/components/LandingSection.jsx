import React from 'react';
import styles from '../styles/LandingSection.module.css';
import Moon from './Moon';

const LandingSection = ({ fadeOut = 0, showHeaderMode = false, landingRef, transitionProgress = 0 }) => {
  return (
    <>
      {/* Header version that appears when scrolled */}
      <header 
        className={`${styles.headerVersion} ${showHeaderMode ? styles.visible : ''}`}
        style={{
          transform: showHeaderMode 
            ? 'translateY(0)' 
            : `translateY(${-100 + transitionProgress * 100}%)`,
          opacity: transitionProgress
        }}
      >
        <div className={styles.headerContent}>
          <div 
            className={styles.moonSmall}
            style={{
              transform: `scale(${0.7 + (1 - transitionProgress) * 0.3})`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Moon type="crescent" />
          </div>
          <h2 
            className={styles.headerName}
            style={{
              transform: `translateX(${(1 - transitionProgress) * 20}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            Bader Muhssin
          </h2>
        </div>
      </header>
      
      {/* Main landing section that fades out when scrolled */}
      <section 
        className={styles.landing} 
        id="landing"
        ref={landingRef}
        style={{ 
          opacity: showHeaderMode ? 0.2 : 1 - fadeOut * 0.5,
          transform: `translateY(-${fadeOut * 30}px)`
        }}
      >
        <div className={styles.contentContainer}>
          <div 
            className={styles.moon}
            style={{
              transform: `translateY(${transitionProgress * -50}px) 
                         scale(${1 - transitionProgress * 0.2})`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <Moon type="crescent" />
          </div>
          <div 
            className={styles.textContent}
            style={{
              transform: `translateY(${transitionProgress * -50}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <h1 className={styles.name}>Bader Muhssin</h1>
            <p className={styles.tagline}>Psychology ➔ Coding | Portfolio</p>
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
