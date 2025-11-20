import React from 'react';

interface LoadingSunflowerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSunflower: React.FC<LoadingSunflowerProps> = ({ text = "Carregando...", size = 'md' }) => {
  const dim = size === 'sm' ? 40 : size === 'lg' ? 120 : 80;
  const fontSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-sm rounded-xl">
      <div className="animate-spin-slow relative">
        <svg width={dim} height={dim} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Petals */}
          <g fill="#FBC02D">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse 
                key={`outer-${i}`}
                cx="50" cy="15" rx="6" ry="18" 
                transform={`rotate(${i * 30} 50 50)`} 
              />
            ))}
          </g>
          {/* Inner Petals */}
          <g fill="#FFEB3B">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse 
                key={`inner-${i}`}
                cx="50" cy="22" rx="4" ry="14" 
                transform={`rotate(${i * 30 + 15} 50 50)`} 
              />
            ))}
          </g>
          {/* Center */}
          <circle cx="50" cy="50" r="14" fill="#5D4037" />
          {/* Seeds Pattern */}
          <g fill="#8D6E63">
             <circle cx="46" cy="46" r="1.5" />
             <circle cx="54" cy="46" r="1.5" />
             <circle cx="46" cy="54" r="1.5" />
             <circle cx="54" cy="54" r="1.5" />
             <circle cx="50" cy="50" r="2" fill="#4E342E" />
          </g>
        </svg>
      </div>
      {text && (
        <p className={`mt-4 font-serif ${fontSize} uppercase tracking-widest text-stone-800 font-bold animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};