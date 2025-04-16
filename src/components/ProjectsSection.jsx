import React from 'react';
import styles from '../styles/ProjectsSection.module.css';
import Moon3D from './Moon3D';
import About from './About';
import SkillsLogos from './SkillsLogos';

const projects = [
  {
    name: 'JobCompass',
    description: 'AI-powered job search assistant with personalized recommendations.',
    link: 'https://github.com/yourusername/jobcompass',
    tags: ['React', 'AI', 'Node.js'],
  },
  {
    name: 'Stellar Weather',
    description: 'Interactive weather visualization app with astronomical data.',
    link: 'https://github.com/yourusername/stellar-weather',
    tags: ['JavaScript', 'APIs', 'Canvas'],
  },
  {
    name: 'Cosmic Blog',
    description: 'Space-themed blog platform with rich content management.',
    link: 'https://github.com/yourusername/cosmic-blog',
    tags: ['React', 'MongoDB', 'Express'],
  },
  {
    name: 'Orbital',
    description: 'Physics-based space orbit simulation and visualization.',
    link: 'https://github.com/yourusername/orbital',
    tags: ['Three.js', 'Physics', 'WebGL'],
  },
];

const ProjectsSection = () => (
  <section className={styles.projects} id="projects">
    <div className={styles.starfield}></div>
    <div className={styles.container}>
      <div className={styles.sectionLayout}>
        <div className={styles.content}>
          <About />
          <SkillsLogos />
        </div>
        <div className={styles.moonContainer}>
          <Moon3D size={400} projects={projects} />
        </div>
      </div>
    </div>
  </section>
);

export default ProjectsSection;
