import React from 'react';
import styles from '../styles/Starfield.module.css';

const Starfield = () => {
  return (
    <div className={styles.starfieldContainer}>
      <div className={styles.starfield}></div>
    </div>
  );
};

export default Starfield;
