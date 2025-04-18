import React, { memo } from 'react';
import styles from '../styles/SkillsLogos.module.css';

const SkillsLogos = () => {
  const skills = [
    {
      name: 'HTML5',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      category: 'frontend'
    },
    {
      name: 'CSS3',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      category: 'frontend'
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      category: 'frontend'
    },
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      category: 'frontend'
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      category: 'frontend'
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      category: 'backend'
    },
    {
      name: 'Express',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      category: 'backend'
    },
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      category: 'tools'
    },
    {
      name: 'Vercel',
      icon: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
      category: 'cloud'
    },
    {
      name: 'Netlify',
      icon: 'https://www.netlify.com/v3/img/components/logomark.png',
      category: 'cloud'
    }
  ];

  return (
    <div className={styles.skillsContainer}>
      <h2 className={styles.title}>Technical Universe</h2>
      <div className={styles.skillsGrid}>
        {skills.map((skill) => (
          <div key={skill.name} className={styles.skillItem}>
            <div className={styles.iconContainer}>
              <img 
                src={skill.icon} 
                alt={`${skill.name} logo`} 
                className={styles.skillIcon} 
                loading="lazy"
                width="40"
                height="40"
              />
              <div className={styles.orbitRing}></div>
            </div>
            <span className={styles.skillName}>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillsLogos);
