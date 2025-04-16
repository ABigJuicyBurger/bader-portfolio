import React from 'react';
import styles from '../styles/Header.module.css';
import Moon from './Moon';

const Header = ({ visible }) => (
  <header 
    className={`${styles.header} ${visible ? styles.visible : ''}`}
  >
    <div className={styles.headerContent}>
      <div className={styles.moonContainer}>
        <Moon type="crescent" className={styles.moon} />
      </div>
      <h2 className={styles.name}>Bader Muhssin</h2>
    </div>
  </header>
);

export default Header;
