import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from '../styles/Moon3D.module.css';

const Moon3D = ({ size = 350, projects = [] }) => {
  const mountRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const projectMarkersRef = useRef([]);
  
  useEffect(() => {
    // Store reference to avoid closure issues during cleanup
    const currentRef = mountRef.current;
    if (!currentRef) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup with transparent background
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to the DOM
    currentRef.appendChild(renderer.domElement);
    
    // Create procedural moon texture
    const createMoonTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Create gradient background for the moon
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, '#f5f5f5');
      gradient.addColorStop(0.8, '#e0e0e0');
      gradient.addColorStop(1, '#d0d0d0');
      
      // Fill the canvas with the gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add craters
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 5 + Math.random() * 15;
        
        ctx.fillStyle = `rgba(150, 150, 150, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    const moonTexture = createMoonTexture();
    
    // Create moon
    const geometry = new THREE.SphereGeometry(2.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.8,
      metalness: 0.1,
    });
    
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);
    
    // Create project markers
    const projectMarkers = [];
    const createProjectMarker = (position, project, index) => {
      // Make markers larger and more visible
      const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = { project, index };
      scene.add(marker);
      
      // Create stronger pulsing effect
      const pulse = new THREE.PointLight(0xffffff, 1, 1);
      pulse.position.copy(position);
      scene.add(pulse);
      
      // Add a glow effect
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(position);
      scene.add(glow);
      
      // Store references to the markers
      projectMarkers.push({ marker, pulse, glow, position });
      
      return { marker, pulse, glow };
    };
    
    // Position markers prominently on the front hemisphere of the moon
    if (projects.length > 0) {
      // Calculate positions that favor the front of the moon
      const positions = [
        new THREE.Vector3(0, 0.8, 2.4),     // Top center (directly facing)
        new THREE.Vector3(0, -0.8, 2.4),    // Bottom center (directly facing)
        new THREE.Vector3(1.9, 0.8, 1.8),   // Top right
        new THREE.Vector3(-1.9, -0.8, 1.8)  // Bottom left
      ];
      
      // Use predefined positions for up to 4 projects
      projects.slice(0, 4).forEach((project, index) => {
        createProjectMarker(positions[index], project, index);
      });
      
      // If there are more than 4 projects, position them evenly
      if (projects.length > 4) {
        projects.slice(4).forEach((project, index) => {
          const i = index + 4; // Offset by the predefined positions
          
          // Place additional markers still somewhat visible from front
          const phi = Math.acos(-0.5 + (i * 0.75) / projects.length);
          const theta = Math.sqrt(projects.length * Math.PI) * phi;
          
          const position = new THREE.Vector3(
            2.6 * Math.sin(phi) * Math.cos(theta),
            2.6 * Math.sin(phi) * Math.sin(theta),
            2.6 * Math.cos(phi) * 0.7 // Push toward front
          );
          
          createProjectMarker(position, project, i);
        });
      }
    }
    
    // Store for raycasting
    projectMarkersRef.current = projectMarkers;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Setup raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Normalize mouse position
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections with project markers
      const intersects = raycaster.intersectObjects(
        projectMarkers.map(item => item.marker)
      );
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        setActiveProject(intersectedObject.userData.project);
        document.body.style.cursor = 'pointer';
        
        // Highlight the selected marker
        projectMarkers.forEach(item => {
          if (item.marker === intersectedObject) {
            item.marker.material.color.set(0x00ffff);
            item.glow.material.color.set(0x00ffff);
          } else {
            item.marker.material.color.set(0xffffff);
            item.glow.material.color.set(0xffffff);
          }
        });
      } else {
        setActiveProject(null);
        document.body.style.cursor = 'default';
        
        // Reset all markers
        projectMarkers.forEach(item => {
          item.marker.material.color.set(0xffffff);
          item.glow.material.color.set(0xffffff);
        });
      }
    };
    
    // Handle click
    const handleClick = () => {
      if (activeProject && activeProject.link) {
        window.open(activeProject.link, '_blank');
      }
    };
    
    // Add event listeners
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);
    
    // Animation loop
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Rotate the moon slowly
      moon.rotation.y += 0.003;
      
      // Update markers to face camera and pulse
      projectMarkers.forEach((item, index) => {
        // Make markers always face the camera
        item.marker.lookAt(camera.position);
        if (item.glow) item.glow.lookAt(camera.position);
        
        // Pulse effect
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + index) * 0.5 + 0.5;
        item.pulse.intensity = pulse * 1.5; // Stronger pulse
        
        // Scale the glow with the pulse
        if (item.glow) {
          item.glow.scale.set(1 + pulse * 0.3, 1 + pulse * 0.3, 1 + pulse * 0.3);
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      if (currentRef && currentRef.contains(renderer.domElement)) {
        // Remove event listeners
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('click', handleClick);
        
        currentRef.removeChild(renderer.domElement);
      }
      
      // Stop animation
      cancelAnimationFrame(animationFrame);
      
      // Dispose of resources
      geometry.dispose();
      material.dispose();
      moonTexture.dispose();
      
      // Dispose of marker resources
      projectMarkers.forEach(({ marker, glow }) => {
        marker.geometry.dispose();
        marker.material.dispose();
        if (glow) {
          glow.geometry.dispose();
          glow.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, [size, projects, activeProject]);
  
  return (
    <div className={styles.container}>
      <div ref={mountRef} className={styles.moon3D} style={{ width: size, height: size }} />
      
      {/* Project info card on hover */}
      {activeProject && (
        <div className={styles.projectCard}>
          <h3>{activeProject.name}</h3>
          <p>{activeProject.description}</p>
          <div className={styles.projectTags}>
            {activeProject.tags && activeProject.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.projectLink}>Click to explore</div>
        </div>
      )}
    </div>
  );
};

export default Moon3D;
