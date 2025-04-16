import React from 'react';
import styles from '../styles/ProjectsSection.module.css';
import Moon3D from './Moon3D';
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
    <div className={styles.container}>
      <div className={styles.sectionLayout}>
        <div className={styles.content}>
          <About />
          <Skills />
          <h2 className={styles.heading}>Projects</h2>
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <div
                key={project.name}
                className={styles.project}
              >
                <h3 className={styles.projectTitle}>{project.name}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectTech}>
                  <span className={styles.techTag}>React</span>
                  <span className={styles.techTag}>JavaScript</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.moonContainer}>
          <Moon3D size={250} />
        </div>
      </div>
    </div>
  </section>
);

export default ProjectsSection;
