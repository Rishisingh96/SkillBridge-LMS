# AnimatedBG Component Documentation

## Overview

A modern, premium animated background component for Learning Management Systems (LMS) built with React, Tailwind CSS, and Framer Motion. Features smooth gradient transitions, floating glassmorphism blobs, particle animations, and mouse parallax effects.

## Features

✅ **Modern Design**: Dark navy, purple, cyan gradients with glassmorphism effects  
✅ **Smooth Animations**: Continuous, performance-optimized animations  
✅ **Interactive Elements**: Mouse parallax and hover effects  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
✅ **Dark/Light Mode**: Built-in theme support  
✅ **Modular Architecture**: Reusable components and clean code  
✅ **Premium UX**: Professional quality similar to Stripe, Vercel, Linear  

## Installation

```bash
npm install framer-motion
```

## Usage

### Basic Usage

```jsx
import AnimatedBG from './component/AnimatedBG';

function App() {
  return (
    <AnimatedBG>
      <YourLMSContent />
    </AnimatedBG>
  );
}
```

### With Light Mode

```jsx
<AnimatedBG darkMode={false}>
  <YourContent />
</AnimatedBG>
```

### Example Implementation

```jsx
import React from 'react';
import AnimatedBG from './component/AnimatedBG';
import { motion } from 'framer-motion';

const LoginPage = () => {
  return (
    <AnimatedBG darkMode={true}>
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Login</h1>
          {/* Login form content */}
        </motion.div>
      </div>
    </AnimatedBG>
  );
};
```

## Component Structure

### Main AnimatedBG Component

- **Props**: `children`, `darkMode` (boolean, default: true)
- **Features**: Gradient animations, mouse tracking, fade-in effects

### Sub-Components

1. **FloatingBlob**: Animated glassmorphism blobs
2. **Particle**: Glowing dot animations  
3. **GridOverlay**: Subtle grid pattern

## Customization

### Colors

The component uses Tailwind CSS color classes. Modify these in the component:

```jsx
// Dark mode colors
color={darkMode ? "bg-blue-600" : "bg-blue-300"}
color={darkMode ? "bg-purple-600" : "bg-purple-300"}
color={darkMode ? "bg-cyan-600" : "bg-cyan-300"}
color={darkMode ? "bg-indigo-600" : "bg-indigo-300"}
```

### Animation Speed

Adjust duration values in FloatingBlob components:

```jsx
duration={8}  // Slower
duration={4}  // Faster
```

### Particle Count

Modify the particles array length:

```jsx
const particles = Array.from({ length: 20 }, (_, i) => ({
  // Change 20 to desired count
}));
```

## Performance Optimization

- Uses `useCallback` for mouse event handlers
- Implements `pointer-events-none` for non-interactive layers
- Optimized animation timing with `easeInOut`
- Efficient re-rendering with proper dependencies

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## File Structure

```
src/
├── component/
│   ├── AnimatedBG.jsx          # Main component
│   ├── AnimatedBGExample.jsx   # Usage example
│   └── README_AnimatedBG.md     # This documentation
```

## Integration with LMS Pages

### Dashboard

```jsx
<AnimatedBG>
  <div className="p-8">
    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
    {/* Dashboard content */}
  </div>
</AnimatedBG>
```

### Course Pages

```jsx
<AnimatedBG>
  <div className="container mx-auto p-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      {/* Course content */}
    </div>
  </div>
</AnimatedBG>
```

### Login/Register

```jsx
<AnimatedBG>
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-96">
      {/* Auth form */}
    </div>
  </div>
</AnimatedBG>
```

## Tips for Best Results

1. **Content Styling**: Use `backdrop-blur-lg` and semi-transparent backgrounds for content
2. **Text Colors**: Use white/gray text for dark mode, dark colors for light mode
3. **Z-Index**: Content automatically gets `z-10`, adjust if needed
4. **Performance**: Avoid too many animated elements on one page

## Troubleshooting

### Animation Not Working
- Ensure `framer-motion` is installed
- Check browser console for errors
- Verify React 18+ is being used

### Performance Issues
- Reduce particle count
- Simplify blob animations
- Check for unnecessary re-renders

### Mobile Responsiveness
- Test on different screen sizes
- Adjust blob sizes for mobile if needed
- Consider reducing animations on mobile devices

## Support

For issues or feature requests, please check the component code and modify as needed for your specific use case.
