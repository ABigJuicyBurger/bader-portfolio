import React from 'react';
import styles from '../styles/LandingSection.module.css';
import Moon from './Moon';

const LandingSection = ({ fadeOut = 0, showHeader = false, landingRef }) => {
  return (
    <>
      {/* Header version that appears when scrolled */}
      <header 
        className={`${styles.headerVersion} ${showHeader ? styles.visible : ''}`}
      >
        <div className={styles.headerContent}>
          <div className={styles.moonSmall}>
            <Moon type="crescent" />
          </div>
          <h2 className={styles.headerName}>
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
          opacity: showHeader ? 0.2 : 1 - fadeOut * 0.5,
          transform: `translateY(-${fadeOut * 30}px)`
        }}
      >
        <div className={styles.contentContainer}>
          <div 
            className={styles.moon}
            style={{
              transform: `translateY(-${fadeOut * 40}px) scale(${1 - fadeOut * 0.2})`,
            }}
          >
            <Moon type="crescent" />
          </div>
          <div 
            className={styles.textContent}
            style={{
              transform: `translateY(-${fadeOut * 40}px)`,
            }}
          >
            <h1 className={styles.name}>Bader Muhssin</h1>
            <p 
              className={styles.tagline}
              style={{
                opacity: 1 - fadeOut * 1.5,
              }}
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
