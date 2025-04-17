import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from '../styles/Moon3D.module.css';

const Moon3D = ({ size = 350, projects = [] }) => {
  const mountRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const projectMarkersRef = useRef([]);
  const animationRef = useRef(null);
  const rotationSpeedRef = useRef(0.005);
  const targetRotationSpeedRef = useRef(0.005);

  useEffect(() => {
    // Initialize with the first project if available
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

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

    // Load moon textures
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load('/moon_texture.png');
    const moonNormalMap = textureLoader.load('/moon_normal.png');

    // Create moon
    const geometry = new THREE.SphereGeometry(2.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: moonNormalMap,
      roughness: 0.8,
      metalness: 0.1,
    });

    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    // Create moon group to attach markers to so they rotate with the moon
    const moonGroup = new THREE.Group();
    moonGroup.add(moon);
    scene.add(moonGroup);

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
      moonGroup.add(marker); // Attach to moonGroup so it rotates with the moon

      // Create a separate point light for the glow effect that doesn't rotate with the moon
      const pulse = new THREE.PointLight(0xffffff, 1, 1);
      pulse.position.copy(position);
      scene.add(pulse);

      // Create a glow effect that rotates with the moon
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(position);
      moonGroup.add(glow); // Attach to moonGroup

      // Store references to the markers
      projectMarkers.push({ marker, pulse, glow, position, originalPosition: position.clone() });

      return { marker, pulse, glow };
    };

    // Position markers around the entire moon to increase visibility frequency
    if (projects.length > 0) {
      projects.forEach((project, index) => {
        // Distribute the markers evenly around the moon
        // Convert index to angles to position markers around the spherical surface
        const phi = Math.acos(-1 + (2 * index) / projects.length);
        const theta = Math.sqrt(projects.length * Math.PI) * phi;
        
        // Convert spherical coordinates to Cartesian (x, y, z) coordinates
        const x = 2.5 * Math.sin(phi) * Math.cos(theta);
        const y = 2.5 * Math.sin(phi) * Math.sin(theta);
        const z = 2.5 * Math.cos(phi);
        
        // Check visibility, north hemisphere bias for increased visibility
        const position = new THREE.Vector3(x, Math.abs(y), z);
        
        createProjectMarker(position, project, index);
      });
    }

    // Store reference to projectMarkers array
    projectMarkersRef.current = projectMarkers;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add point light for dramatic effect
    const pointLight = new THREE.PointLight(0x00ffff, 1, 10);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Initialize raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      
      // Convert mouse position to normalized device coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with project markers
      const intersects = raycaster.intersectObjects(
        projectMarkers.map(item => item.marker)
      );

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const hoveredProject = intersectedObject.userData.project;
        
        // Set the selected project and highlight the marker
        setSelectedProject(hoveredProject);
        setHoveredIndex(intersectedObject.userData.index);
        
        // Gradually slow down the rotation
        targetRotationSpeedRef.current = 0;
        document.body.style.cursor = 'pointer';
      } else {
        // Gradually return to normal rotation speed if not hovering over a marker
        targetRotationSpeedRef.current = 0.005;
        document.body.style.cursor = 'default';
        setHoveredIndex(null);
      }
    };

    // Handle click event (retain this for mobile compatibility)
    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with project markers
      const intersects = raycaster.intersectObjects(
        projectMarkers.map(item => item.marker)
      );

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const clickedProject = intersectedObject.userData.project;
        
        // Set the selected project
        setSelectedProject(clickedProject);
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop with variable rotation speed
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Smoothly interpolate between current and target rotation speeds
      rotationSpeedRef.current += (targetRotationSpeedRef.current - rotationSpeedRef.current) * 0.05;
      
      // Rotate the moon group at the current speed
      moonGroup.rotation.y += rotationSpeedRef.current;

      // Update light positions and pulse effects
      projectMarkers.forEach((item, index) => {
        // Calculate current world position of the marker after rotation
        const worldPosition = new THREE.Vector3();
        item.marker.getWorldPosition(worldPosition);

        // Update the pulse light position to match the marker's current position
        item.pulse.position.copy(worldPosition);

        // Pulse effect
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + index) * 0.5 + 0.5;
        
        // If this marker is highlighted (project card hover or marker hover)
        if (hoveredIndex === index) {
          item.pulse.intensity = pulse * 2.5; // Stronger pulse for highlighted marker
          
          // Scale the glow effect more dramatically when highlighted
          if (item.glow) {
            item.glow.scale.set(1 + pulse * 0.6, 1 + pulse * 0.6, 1 + pulse * 0.6);
            item.glow.material.opacity = 0.6;
          }
          
          // Make the marker itself pulse
          item.marker.scale.set(1 + pulse * 0.3, 1 + pulse * 0.3, 1 + pulse * 0.3);
        } else {
          item.pulse.intensity = pulse * 1.5; // Normal pulse
          
          // Normal glow animation
          if (item.glow) {
            item.glow.scale.set(1 + pulse * 0.3, 1 + pulse * 0.3, 1 + pulse * 0.3);
            item.glow.material.opacity = 0.3;
          }
          
          // Reset marker scale
          item.marker.scale.set(1, 1, 1);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Dispose of resources
      geometry.dispose();
      material.dispose();
      moonTexture.dispose();
      moonNormalMap.dispose();

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
  }, [size, projects]); // Remove activeProject from dependencies to prevent re-rendering

  // Handle project card hover to highlight the corresponding marker
  const handleProjectCardHover = (index) => {
    setHoveredIndex(index);
  };
  
  // Handle project card mouse leave
  const handleProjectCardLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className={styles.container}>
      <div ref={mountRef} className={styles.moon3D} style={{ width: size, height: size }} />

      {/* Project info card - Always visible */}
      <div 
        className={styles.projectCard}
        onMouseEnter={() => selectedProject && handleProjectCardHover(projects.findIndex(p => p.name === selectedProject.name))}
        onMouseLeave={handleProjectCardLeave}
      >
        {selectedProject ? (
          <>
            <h3>{selectedProject.name}</h3>
            <p>{selectedProject.description}</p>
            <div className={styles.projectTags}>
              {selectedProject.tags && selectedProject.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
            
            {/* Use the 'link' property that exists in the project data */}
            {selectedProject.link && (
              <a 
                href={selectedProject.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                View Project
              </a>
            )}
          </>
        ) : (
          <p className={styles.noProject}>Hover over a marker to see project details</p>
        )}
      </div>
    </div>
  );
};

export default Moon3D;
