import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// Floating Blob Component
const FloatingBlob = ({ delay, duration, size, color, initialX, initialY }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      x: [initialX, initialX + 100, initialX - 50, initialX],
      y: [initialY, initialY - 80, initialY + 60, initialY],
      scale: [1, 1.2, 0.9, 1],
      transition: {
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    });
  }, [controls, delay, duration, initialX, initialY]);

  return (
    <motion.div
      animate={controls}
      className={`absolute rounded-full blur-3xl opacity-70 ${color}`}
      style={{
        width: size,
        height: size,
        filter: 'blur(80px)',
        background: `radial-gradient(circle, ${color}, transparent)`,
      }}
    />
  );
};

// Educational Symbol Component
const EducationalSymbol = ({ symbol, x, y, delay, duration, darkMode }) => {
  const symbols = ['📚', '🎓', '💡', '📖', '📝', '🔬', '🎨', '📐', '💻', '🌟'];
  const randomSymbol = symbol || symbols[Math.floor(Math.random() * symbols.length)];
  
  return (
    <motion.div
      className={`absolute text-2xl opacity-20 select-none pointer-events-none ${darkMode ? 'text-white' : 'text-gray-700'}`}
      style={{
        left: x,
        top: y,
        fontSize: `${Math.random() * 20 + 16}px`,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        opacity: [0.1, 0.4, 0.1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {randomSymbol}
    </motion.div>
  );
};

// Enhanced Particle Component
const Particle = ({ x, y, size, delay, duration, darkMode }) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-60 ${darkMode ? 'bg-cyan-400' : 'bg-blue-400'}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        boxShadow: darkMode ? '0 0 10px rgba(34, 211, 238, 0.5)' : '0 0 10px rgba(59, 130, 246, 0.5)',
      }}
      animate={{
        y: [0, -35, 0],
        opacity: [0.2, 0.7, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

// Grid Overlay Component
const GridOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="w-full h-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

// Main Animated Background Component
const AnimatedBG = ({ children, darkMode = true }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  // Mouse parallax effect
  const handleMouseMove = useCallback((e) => {
    if (containerRef.current) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    }
  }, []);

  // Generate random particles and educational symbols
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  const educationalSymbols = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 4 + 3,
  }));

  // Background gradient variants
  const gradientVariants = {
    initial: {
      background: darkMode 
        ? "linear-gradient(135deg, #1e3a8a 0%, #312e81 20%, #1e40af 40%, #3730a3 60%, #1e3a8a 80%, #312e81 100%)"
        : "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #ddd6fe 50%, #c7d2fe 75%, #dbeafe 100%)",
    },
    animate: {
      background: darkMode
        ? "linear-gradient(135deg, #1e40af 0%, #3730a3 20%, #1e3a8a 40%, #312e81 60%, #1e40af 80%, #3730a3 100%)"
        : "linear-gradient(135deg, #dbeafe 0%, #c7d2fe 25%, #ddd6fe 50%, #e0e7ff 75%, #dbeafe 100%)",
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        variants={gradientVariants}
        initial="initial"
        animate="animate"
      />

      {/* Floating Blobs - LMS Themed */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingBlob
          delay={0}
          duration={10}
          size="450px"
          color={darkMode ? "bg-blue-700" : "bg-blue-400"}
          initialX={-150}
          initialY={-150}
        />
        <FloatingBlob
          delay={3}
          duration={12}
          size="380px"
          color={darkMode ? "bg-indigo-600" : "bg-indigo-400"}
          initialX={typeof window !== 'undefined' ? window.innerWidth - 250 : 900}
          initialY={150}
        />
        <FloatingBlob
          delay={6}
          duration={14}
          size="320px"
          color={darkMode ? "bg-purple-600" : "bg-purple-400"}
          initialX={typeof window !== 'undefined' ? window.innerWidth / 2 : 500}
          initialY={typeof window !== 'undefined' ? window.innerHeight - 250 : 450}
        />
        <FloatingBlob
          delay={9}
          duration={11}
          size="280px"
          color={darkMode ? "bg-violet-600" : "bg-violet-400"}
          initialX={150}
          initialY={typeof window !== 'undefined' ? window.innerHeight / 2 : 350}
        />
        <FloatingBlob
          delay={12}
          duration={13}
          size="240px"
          color={darkMode ? "bg-sky-600" : "bg-sky-400"}
          initialX={typeof window !== 'undefined' ? window.innerWidth / 3 : 300}
          initialY={typeof window !== 'undefined' ? window.innerHeight / 3 : 200}
        />
      </div>

      {/* Grid Overlay */}
      <GridOverlay />

      {/* Particles and Educational Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            x={`${particle.x}%`}
            y={`${particle.y}%`}
            size={`${particle.size}px`}
            delay={particle.delay}
            duration={particle.duration}
            darkMode={darkMode}
          />
        ))}
        {educationalSymbols.map((symbol) => (
          <EducationalSymbol
            key={symbol.id}
            x={`${symbol.x}%`}
            y={`${symbol.y}%`}
            delay={symbol.delay}
            duration={symbol.duration}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Mouse Parallax Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: useTransform(useMotionValue(mousePosition.x), [-0.5, 0.5], [-20, 20]),
          y: useTransform(useMotionValue(mousePosition.y), [-0.5, 0.5], [-20, 20]),
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30"
          style={{
            transform: `translate(${-mousePosition.x * 50}px, ${-mousePosition.y * 50}px)`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Fade-in Animation */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default AnimatedBG;