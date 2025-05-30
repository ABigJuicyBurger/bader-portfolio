import React from "react";
import styles from "../styles/ProjectsSection.module.css";
import Moon3D from "./Moon3D";
import About from "./About";
import SkillsLogos from "./SkillsLogos";

const projects = [
  {
    name: "JobCompass",
    description:
      "A smart job search platform integrating features similar to Rent Faster and Indeed.",
    link: "https://jobcompass-demo.netlify.app/",
    tags: ["React", "Node.js", "TypeScript"],
  },
  {
    name: "Admin Dashboard",
    description:
      "Dashboard of all projects I've completed through The Odin Project.",
    link: "https://abigjuicyburger.github.io/Admin-Dashboard",
    tags: ["JavaScript", "APIs", "Canvas"],
  },
  {
    name: "AI vs Jobs",
    description: `Used Python, to model AI adoption vs. U.S. unemployment, showing AI's role in creating specialized tech jobs.`,
    link: "https://abigjuicyburger.github.io/data-science-project-clean/ai_unemployment_visualization.html",
    tags: ["Python", "Scikit", "Pandas"],
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
