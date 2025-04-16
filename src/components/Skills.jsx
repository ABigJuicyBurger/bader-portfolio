import React from 'react';
import styles from '../styles/Skills.module.css';

const skills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'CSS', level: 80 },
  { name: 'Python', level: 75 },
  { name: 'UI/UX', level: 70 },
];

const Skills = () => (
  <div className={styles.skills}>
    <h3>Skills</h3>
    <ul>
      {skills.map(skill => (
        <li key={skill.name}>
          <span>{skill.name}</span>
          <div className={styles.barBg}>
            <div className={styles.bar} style={{ width: `${skill.level}%` }} />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default Skills;
