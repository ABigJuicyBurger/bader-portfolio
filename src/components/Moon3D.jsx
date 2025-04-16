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
      const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = { project, index };
      scene.add(marker);
      
      // Create pulsing effect
      const pulse = new THREE.PointLight(0xffffff, 0.5, 0.5);
      pulse.position.copy(position);
      scene.add(pulse);
      
      // Store references to the markers
      projectMarkers.push({ marker, pulse, position });
      
      return { marker, pulse };
    };
    
    // Position markers around the moon
    if (projects.length > 0) {
      const radius = 2.8; // Slightly larger than moon radius
      projects.forEach((project, index) => {
        // Calculate position on moon surface
        const phi = Math.acos(-1 + (2 * index) / projects.length);
        const theta = Math.sqrt(projects.length * Math.PI) * phi;
        
        const position = new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );
        
        createProjectMarker(position, project, index);
      });
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
      } else {
        setActiveProject(null);
        document.body.style.cursor = 'default';
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
        
        // Pulse effect
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + index) * 0.5 + 0.5;
        item.pulse.intensity = pulse * 0.8;
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
      projectMarkers.forEach(({ marker }) => {
        marker.geometry.dispose();
        marker.material.dispose();
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
        </div>
      )}
    </div>
  );
};

export default Moon3D;
