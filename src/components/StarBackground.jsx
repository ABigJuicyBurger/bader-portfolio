import React, { useState, useEffect } from 'react';

const StarBackground = () => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Generate between 100-150 stars
    const starCount = Math.floor(Math.random() * 50) + 100;
    const newStars = [];
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        animationDuration: `${3 + Math.random() * 7}s`,
        color: Math.random() > 0.95 ? '#00ffff' : '#ffffff'
      });
    }
    
    setStars(newStars);
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 2,
      pointerEvents: 'none'
    }}>
      {stars.map(star => (
        <div 
          key={star.id}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration} infinite alternate ease-in-out`,
            boxShadow: star.size > 1.2 ? `0 0 2px ${star.color}` : 'none'
          }}
        />
      ))}
      
      {/* Add 2 shooting stars */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '2px',
        height: '20px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1), rgba(255,255,255,0))',
        transform: 'rotate(45deg)',
        animation: 'shooting 8s linear infinite',
        animationDelay: '5s',
        filter: 'blur(0.5px)'
      }}/>
      
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '80%',
        width: '2px',
        height: '20px',
        background: 'linear-gradient(to bottom, rgba(0,255,255,0), rgba(0,255,255,1), rgba(0,255,255,0))',
        transform: 'rotate(45deg)',
        animation: 'shooting 8s linear infinite',
        animationDelay: '12s',
        filter: 'blur(0.5px)'
      }}/>
      
      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 1; }
          100% { opacity: 0.1; }
        }
        
        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          15% {
            transform: translateX(300px) translateY(300px) rotate(45deg);
            opacity: 0;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StarBackground;
