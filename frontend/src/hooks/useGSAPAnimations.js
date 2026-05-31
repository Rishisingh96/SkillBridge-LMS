import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations
 * Provides reusable animation patterns for the LMS
 */
export const useGSAPAnimations = () => {
  /**
   * Fade and slide up animation on scroll
   * @param {string} selector - CSS selector for elements to animate
   * @param {Object} options - Animation options
   */
  const fadeSlideUp = (selector, options = {}) => {
    const {
      duration = 0.8,
      delay = 0,
      stagger = 0,
      y = 50,
      x = 0,
      trigger = null,
      start = "top 80%",
      toggleActions = "play none none reverse",
    } = options;

    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: y,
        x: x,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power2.out",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: start,
          toggleActions: toggleActions,
        } : {
          trigger: selector,
          start: start,
          toggleActions: toggleActions,
        },
      }
    );
  };

  /**
   * Stagger animation for cards
   * @param {string} selector - CSS selector for card elements
   * @param {Object} options - Animation options
   */
  const staggerCards = (selector, options = {}) => {
    const {
      duration = 0.6,
      stagger = 0.15,
      y = 40,
      trigger = null,
      start = "top 85%",
    } = options;

    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: y,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: duration,
        stagger: stagger,
        ease: "back.out(1.2)",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: start,
          toggleActions: "play none none reverse",
        } : {
          trigger: selector,
          start: start,
          toggleActions: "play none none reverse",
        },
      }
    );
  };

  /**
   * Counter animation for statistics
   * @param {string} selector - CSS selector for counter elements
   * @param {Object} options - Animation options
   */
  const animateCounter = (selector, options = {}) => {
    const {
      duration = 2,
      trigger = null,
      start = "top 85%",
    } = options;

    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el) => {
      const text = el.textContent;
      const hasK = text.includes("K");
      const hasPercent = text.includes("%");
      const hasPlus = text.includes("+");
      
      const numValue = parseFloat(text.replace(/[^0-9.]/g, ""));
      
      gsap.fromTo(
        el,
        {
          innerText: 0,
        },
        {
          innerText: numValue,
          duration: duration,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: trigger ? {
            trigger: trigger,
            start: start,
            once: true,
          } : {
            trigger: el,
            start: start,
            once: true,
          },
          onUpdate: function() {
            let current = parseFloat(this.targets()[0].innerText);
            if (hasK) {
              el.textContent = Math.floor(current) + "K" + (hasPlus ? "+" : "");
            } else if (hasPercent) {
              el.textContent = Math.floor(current) + "%";
            } else {
              el.textContent = Math.floor(current) + (hasPlus ? "+" : "");
            }
          },
        }
      );
    });
  };

  /**
   * Scale animation on scroll
   * @param {string} selector - CSS selector for elements
   * @param {Object} options - Animation options
   */
  const scaleIn = (selector, options = {}) => {
    const {
      duration = 0.8,
      scale = 0.8,
      trigger = null,
      start = "top 85%",
    } = options;

    gsap.fromTo(
      selector,
      {
        opacity: 0,
        scale: scale,
      },
      {
        opacity: 1,
        scale: 1,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: start,
          toggleActions: "play none none reverse",
        } : {
          trigger: selector,
          start: start,
          toggleActions: "play none none reverse",
        },
      }
    );
  };

  /**
   * Horizontal slide animation
   * @param {string} selector - CSS selector for elements
   * @param {Object} options - Animation options
   */
  const slideIn = (selector, options = {}) => {
    const {
      duration = 0.8,
      x = 100,
      direction = "left",
      trigger = null,
      start = "top 85%",
    } = options;

    const startX = direction === "left" ? x : -x;

    gsap.fromTo(
      selector,
      {
        opacity: 0,
        x: startX,
      },
      {
        opacity: 1,
        x: 0,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: start,
          toggleActions: "play none none reverse",
        } : {
          trigger: selector,
          start: start,
          toggleActions: "play none none reverse",
        },
      }
    );
  };

  /**
   * Cleanup ScrollTrigger instances
   */
  const cleanup = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };

  return {
    fadeSlideUp,
    staggerCards,
    animateCounter,
    scaleIn,
    slideIn,
    cleanup,
  };
};
