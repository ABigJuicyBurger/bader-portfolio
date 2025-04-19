import React, { memo, useState, useEffect, useRef } from 'react';
import styles from '../styles/SkillsLogos.module.css';

const SkillsLogos = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const timeoutRef = useRef(null);
  const isMobileRef = useRef(false);
  
  // Detect if on mobile/tablet
  useEffect(() => {
    isMobileRef.current = window.matchMedia('(max-width: 1024px)').matches;
    
    // Clean up any timeouts when unmounting
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Handle skill activation without preventDefault
  const handleSkillInteraction = (skillName) => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Toggle active skill
    if (activeSkill === skillName) {
      setActiveSkill(null);
    } else {
      setActiveSkill(skillName);
      
      // Only auto-clear on mobile after 3 seconds
      if (isMobileRef.current) {
        timeoutRef.current = setTimeout(() => {
          setActiveSkill(null);
        }, 3000);
      }
    }
  };
  
  const skills = [
    {
      name: 'HTML5',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      category: 'frontend',
      description: 'Web structure'
    },
    {
      name: 'CSS3',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      category: 'frontend',
      description: 'Web styling'
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      category: 'frontend',
      description: 'Web interactivity'
    },
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      category: 'frontend',
      description: 'UI components'
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      category: 'frontend',
      description: 'Type-safe JS'
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      category: 'backend',
      description: 'Server runtime'
    },
    {
      name: 'Express',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      category: 'backend',
      description: 'Backend framework'
    },
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      category: 'tools',
      description: 'Version control'
    },
    {
      name: 'Vercel',
      icon: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
      category: 'cloud',
      description: 'Deployment'
    },
    {
      name: 'Netlify',
      icon: 'https://www.netlify.com/v3/img/components/logomark.png',
      category: 'cloud',
      description: 'Hosting'
    }
  ];

  return (
    <div className={styles.skillsContainer}>
      <h2 className={styles.title}>Technical Universe</h2>
      <div className={styles.skillsGrid}>
        {skills.map((skill) => (
          <div 
            key={skill.name} 
            className={`${styles.skillItem} ${activeSkill === skill.name ? styles.active : ''}`}
            aria-label={`${skill.name}: ${skill.description}`}
            onClick={() => handleSkillInteraction(skill.name)}
            role="button"
            tabIndex={0}
          >
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
              <div className={styles.skillTooltip}>
                <span>{skill.description}</span>
              </div>
            </div>
            <span className={styles.skillName}>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillsLogos);
