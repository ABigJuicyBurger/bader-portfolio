import React from 'react';
import styles from '../styles/BackgroundStars.module.css';

const BackgroundStars = () => {
  return (
    <div className={styles.starsContainer}>
      <div className={styles.stars}></div>
      <div className={styles.twinkling}></div>
      <div className={styles.shootingStars}></div>
    </div>
  );
};

export default BackgroundStars;
