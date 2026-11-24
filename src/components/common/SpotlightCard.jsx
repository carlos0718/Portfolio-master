import React, { useRef } from 'react';

/**
 * Tactile Bento Surface with lightweight CSS pointer-tracking spotlight.
 */
export function SpotlightCard({ children, className = '', as: Component = 'div', ...props }) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Component
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`bento-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
