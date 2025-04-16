import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styles from '../styles/Moon3D.module.css';

const Moon3D = ({ size = 200 }) => {
  const mountRef = useRef(null);
  
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
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.8,
      metalness: 0.1,
    });
    
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the moon
      moon.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      if (currentRef && currentRef.contains(renderer.domElement)) {
        currentRef.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      geometry.dispose();
      material.dispose();
      moonTexture.dispose();
      renderer.dispose();
    };
  }, [size]);
  
  return (
    <div ref={mountRef} className={styles.moon3D} />
  );
};

export default Moon3D;
