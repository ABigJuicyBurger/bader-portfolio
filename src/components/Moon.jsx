import React from 'react';
import styles from '../styles/Moon.module.css';

const CrescentMoonSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 120 120" width="120" height="120" fill="none">
    <path d="M60,5 a55,55 0 1,0 0,110 a25,55 0 1,1 0,-110" fill="#fff" />
  </svg>
);

const FullMoonSVG = ({ className, animate }) => (
  <svg className={className + (animate ? ' ' + styles.rotate : '')} viewBox="0 0 120 120" width="160" height="160" fill="none">
    <circle cx="60" cy="60" r="55" fill="#fff" />
    <circle cx="80" cy="50" r="7" fill="#e0e0e0" />
    <circle cx="40" cy="70" r="5" fill="#e9e9e9" />
    <circle cx="70" cy="85" r="3" fill="#d0d0d0" />
  </svg>
);

const Moon = ({ type = 'crescent', className = '', animate = false }) => {
  if (type === 'full') return <FullMoonSVG className={className} animate={animate} />;
  return <CrescentMoonSVG className={className} />;
};

export default Moon;
