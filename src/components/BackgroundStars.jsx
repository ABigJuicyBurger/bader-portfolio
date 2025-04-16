import React, { useEffect } from 'react';
import styles from '../styles/BackgroundStars.module.css';

const BackgroundStars = () => {
  // Generate random stars on component mount
  useEffect(() => {
    createStars();
  }, []);

  const createStars = () => {
    const container = document.querySelector(`.${styles.starsContainer}`);
    if (!container) return;
    
    // Clear any existing stars
    container.innerHTML = '';
    
    // Generate 100 random stars with varying sizes
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = styles.star;
      
      // Random position
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      
      // Random size (0.5px to 2px)
      const size = 0.5 + Math.random() * 1.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      // Make some stars colored (5% chance for a colored star)
      if (Math.random() < 0.05) {
        star.style.background = '#00FFFF'; // Cyan color for a few stars
      }
      
      container.appendChild(star);
    }
    
    // Add 2 shooting stars
    const shootingStar1 = document.createElement('div');
    shootingStar1.className = styles.shootingStar;
    container.appendChild(shootingStar1);
    
    const shootingStar2 = document.createElement('div');
    shootingStar2.className = styles.shootingStar;
    shootingStar2.style.animationDelay = '7s';
    shootingStar2.style.top = '30%';
    shootingStar2.style.left = '80%';
    container.appendChild(shootingStar2);
  };

  return (
    <div className={styles.starsContainer} />
  );
};

export default BackgroundStars;
