import { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  className,
  loading = 'lazy',
  placeholder = 'blur',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        {...props}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <picture ref={imgRef}>
      {webpSrc && (
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
