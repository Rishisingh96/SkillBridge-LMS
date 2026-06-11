import React, { useEffect } from 'react';

const GoogleAnalytics = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    return () => {
      // Cleanup on unmount
      const scripts = document.head.querySelectorAll(`script[src*="googletagmanager.com"]`);
      scripts.forEach((s) => s.remove());
    };
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics;
