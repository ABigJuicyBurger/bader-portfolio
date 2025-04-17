import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from '../styles/Moon3D.module.css';

const Moon3D = ({ size = 350, projects = [] }) => {
  const mountRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const projectMarkersRef = useRef([]);
  const animationRef = useRef(null);
  const rotationSpeedRef = useRef(0.005);
  const targetRotationSpeedRef = useRef(0.005);
  const targetRotationRef = useRef(null);
  const moonGroupRef = useRef(null);
  const projectCardRef = useRef(null);

  useEffect(() => {
    // Initialize with the first project if available
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
      setSelectedIndex(0);
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
    moonGroupRef.current = moonGroup;

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
      // Calculate positions for markers distributed evenly around the moon
      const positions = [];
      const count = Math.max(12, projects.length * 2); // Use more markers for better coverage

      // Create positions evenly around the moon with some bias toward the front
      for (let i = 0; i < count; i++) {
        // Distribute markers evenly around the full 360 degrees
        const angle = (i / count) * Math.PI * 2;

        // Bias markers toward the front of the moon
        const x = 2.5 * Math.cos(angle);
        const y = (Math.random() - 0.5) * 2; // Random Y position
        const z = 2.5 * Math.sin(angle);

        positions.push(new THREE.Vector3(x, y, z));
      }

      // Create markers for the actual projects
      projects.forEach((project, index) => {
        // Pick a position from our calculated positions
        const posIndex = index % positions.length;
        createProjectMarker(positions[posIndex], project, index);
      });
    }

    // Update projectMarkersRef to make it accessible outside this effect
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
        const hoveredProject = intersectedObject.userData.project;
        
        // Set the selected project and track hovered index
        setSelectedProject(hoveredProject);
        setHoveredIndex(intersectedObject.userData.index);
        
        // Gradually slow down the rotation
        targetRotationSpeedRef.current = 0;
        document.body.style.cursor = 'pointer';

        // Directly set marker colors - key improvement from original code
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
        // Gradually return to normal rotation speed if not hovering over a marker
        targetRotationSpeedRef.current = 0.005;
        document.body.style.cursor = 'default';
        setHoveredIndex(null);
        
        // Reset all markers to white
        projectMarkers.forEach(item => {
          item.marker.material.color.set(0xffffff);
          item.glow.material.color.set(0xffffff);
        });
      }
    };

    // Handle click for mobile compatibility
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
        
        // Highlight the clicked marker
        projectMarkers.forEach(item => {
          if (item.marker === intersectedObject) {
            item.marker.material.color.set(0x00ffff);
            item.glow.material.color.set(0x00ffff);
          } else {
            item.marker.material.color.set(0xffffff);
            item.glow.material.color.set(0xffffff);
          }
        });
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop with variable rotation speed
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Smoothly adjust rotation speed
      rotationSpeedRef.current += (targetRotationSpeedRef.current - rotationSpeedRef.current) * 0.05;
      
      // Rotate the moon group at the current speed
      moonGroupRef.current.rotation.y += rotationSpeedRef.current;

      // Update light positions and pulse effects
      projectMarkers.forEach((item, index) => {
        // Calculate current world position of the marker after rotation
        const worldPosition = new THREE.Vector3();
        item.marker.getWorldPosition(worldPosition);
        
        // Update pulse position to match marker
        item.pulse.position.copy(worldPosition);
        
        // Pulse animation using time
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + index) * 0.5 + 0.5;
        
        // Check if this is the hovered/selected marker (index matches)
        if (hoveredIndex === index) {
          item.pulse.intensity = 2 + pulse; // Brighter pulse
          
          // Enhanced glow animation for selected marker
          if (item.glow) {
            item.glow.scale.set(1 + pulse * 0.5, 1 + pulse * 0.5, 1 + pulse * 0.5);
          }
          
          // Scale the marker slightly
          item.marker.scale.set(1.2, 1.2, 1.2);
        } else {
          item.pulse.intensity = pulse * 1.5; // Normal pulse
          
          // Normal glow animation
          if (item.glow) {
            item.glow.scale.set(1 + pulse * 0.3, 1 + pulse * 0.3, 1 + pulse * 0.3);
          }
          
          // Reset marker scale
          item.marker.scale.set(1, 1, 1);
        }
      });

      // Rotate the moon to face the target rotation
      if (targetRotationRef.current !== null) {
        moonGroupRef.current.rotation.y += (targetRotationRef.current - moonGroupRef.current.rotation.y) * 0.05;
      }

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
  }, [size, projects]); // Remove hoveredIndex from dependencies to prevent re-rendering

  // Focus on a specific marker and rotate the moon to center it
  const focusOnMarker = (index) => {
    if (!moonGroupRef.current || !projectMarkersRef.current || projectMarkersRef.current.length === 0) return;
    
    // Get the marker position
    const marker = projectMarkersRef.current[index];
    if (!marker) return;
    
    // Calculate the angle needed to bring the marker to the front
    const position = marker.originalPosition.clone();
    
    // Calculate the rotation to bring the marker to face the user
    // First get the angle of the marker relative to the center
    const theta = Math.atan2(position.z, position.x);
    
    // Add 270 degrees (3π/2 radians) to make it face directly toward the camera
    // This adds an additional 90 degrees to the previous 180 degree rotation
    targetRotationRef.current = theta + Math.PI + Math.PI/2;
    
    // Pause automatic rotation while focusing
    targetRotationSpeedRef.current = 0;
    
    // Highlight this marker
    setHoveredIndex(index);
    
    // Update marker colors directly
    if (projectMarkersRef.current && projectMarkersRef.current.length > 0) {
      projectMarkersRef.current.forEach((item, i) => {
        if (i === index) {
          item.marker.material.color.set(0x00ffff);
          item.glow.material.color.set(0x00ffff);
        } else {
          item.marker.material.color.set(0xffffff);
          item.glow.material.color.set(0xffffff);
        }
      });
    }
    
    // Automatically resume rotation after 4 seconds
    setTimeout(() => {
      targetRotationSpeedRef.current = 0.005;
      // Keep the current rotation as starting point rather than resetting target
      targetRotationRef.current = null;
    }, 4000);
  };

  // Navigate through projects with carousel buttons
  const navigateProject = (direction) => {
    if (projects.length === 0) return;
    
    let newIndex = selectedIndex;
    
    if (direction === 'next') {
      newIndex = (selectedIndex + 1) % projects.length;
    } else {
      newIndex = (selectedIndex - 1 + projects.length) % projects.length;
    }
    
    setSelectedIndex(newIndex);
    setSelectedProject(projects[newIndex]);
    
    // Focus on the corresponding marker
    focusOnMarker(newIndex);
  };

  // Handle project card hover to highlight the corresponding marker
  const handleProjectCardHover = (index) => {
    if (index >= 0) {
      setHoveredIndex(index);
      
      // Direct update of marker colors when hovering over project card
      if (projectMarkersRef.current && projectMarkersRef.current.length > 0) {
        projectMarkersRef.current.forEach((item, i) => {
          if (i === index) {
            item.marker.material.color.set(0x00ffff);
            item.glow.material.color.set(0x00ffff);
          } else {
            item.marker.material.color.set(0xffffff);
            item.glow.material.color.set(0xffffff);
          }
        });
      }
    }
  };
  
  // Handle project card mouse leave
  const handleProjectCardLeave = () => {
    setHoveredIndex(null);
    
    // Reset all marker colors when mouse leaves project card
    if (projectMarkersRef.current && projectMarkersRef.current.length > 0) {
      projectMarkersRef.current.forEach(item => {
        item.marker.material.color.set(0xffffff);
        item.glow.material.color.set(0xffffff);
      });
    }
  };

  return (
    <div className={styles.container}>
      <div ref={mountRef} className={styles.moon3D} style={{ width: size, height: size }} />

      {/* Project info card - Always visible */}
      <div 
        ref={projectCardRef}
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
        
        {/* Carousel navigation buttons */}
        {projects.length > 1 && (
          <div className={styles.carouselNav}>
            <button 
              className={styles.navButton} 
              onClick={() => navigateProject('prev')}
            >
              &lt;
            </button>
            <button 
              className={styles.navButton} 
              onClick={() => navigateProject('next')}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moon3D;
