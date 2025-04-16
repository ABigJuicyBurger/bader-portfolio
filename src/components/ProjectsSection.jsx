import React from 'react';
import styles from '../styles/ProjectsSection.module.css';
import Moon from './Moon';
import About from './About';
import Skills from './Skills';

const projects = [
  {
    name: 'JobCompass',
    description: 'Your featured project: AI-powered job search assistant.',
    link: '#',
    featured: true,
  },
  {
    name: 'Project Two',
    description: 'Another cool project.',
    link: '#',
  },
  {
    name: 'Project Three',
    description: 'Yet another project.',
    link: '#',
  },
];

const ProjectsSection = () => (
  <section className={styles.projects} id="projects">
    <div className={styles.leftContent}>
      <About />
      <Skills />
      <div className={styles.projectsList}>
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.link}
            className={project.featured ? styles.featured : styles.project}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </a>
        ))}
      </div>
    </div>
    <div className={styles.rightContent}>
      <Moon type="full" className={styles.fullMoon} animate />
    </div>
  </section>
);

export default ProjectsSection;
