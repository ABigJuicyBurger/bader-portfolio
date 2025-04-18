import React from 'react';
import styles from '../styles/ProjectsSection.module.css';
import Moon3D from './Moon3D';
import About from './About';
import SkillsLogos from './SkillsLogos';

const projects = [
  {
    name: 'JobCompass',
    description: 'A smart job search platform integrating features similar to Rent Faster and Indeed.',
    link: 'http://jobcompass.duckdns.org/',
    tags: ['React', 'Node.js', 'TypeScript'],
  },
  {
    name: 'Admin Dashboard',
    description: 'Dashboard of all projects I\'ve completed through The Odin Project.',
    link: 'https://abigjuicyburger.github.io/Admin-Dashboard',
    tags: ['JavaScript', 'APIs', 'Canvas'],
  },
  {
    name: 'Shop.AI',
    description: 'A not so smart e-commerce platform.',
    link: 'https://shopai-react.netlify.app/',
    tags: ['React', 'TypeScript', 'JavaScript'],
  },
  {
    name: 'Restaurant Page',
    description: 'A restaurant landing page, flexing my Webpack and npm skills.',
    link: 'https://abigjuicyburger.github.io/RestaurantPage',
    tags: ['JavaScript', 'Webpack', 'npm'],
  },
];

const ProjectsSection = () => (
  <section className={styles.projects} id="projects">
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
