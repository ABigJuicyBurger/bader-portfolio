import React from 'react';
import styles from '../styles/ContactSection.module.css';

const ContactSection = () => (
  <section className={styles.contact} id="contact">
    <h2>Contact</h2>
    <ul className={styles.links}>
      <li>
        <a href="mailto:bader.muhssin@email.com">bader.muhssin@email.com</a>
      </li>
      <li>
        <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">GitHub</a>
      </li>
      <li>
        <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </li>
      <li>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
      </li>
    </ul>
  </section>
);

export default ContactSection;
