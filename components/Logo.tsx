import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 240 180" 
        className="w-32 h-24 md:w-40 md:h-28"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sunflower Beach Logo"
      >
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&display=swap');
          </style>
        </defs>

        {/* Text S */}
        <text 
          x="20" 
          y="130" 
          fontFamily="'Cormorant Garamond', serif" 
          fontSize="140" 
          fontWeight="500" 
          fill="#B8860B"
        >
          S
        </text>

        {/* Text B */}
        <text 
          x="140" 
          y="130" 
          fontFamily="'Cormorant Garamond', serif" 
          fontSize="140" 
          fontWeight="500" 
          fill="#B8860B"
        >
          B
        </text>

        {/* Sunflower Group - Centered between S and B */}
        <g transform="translate(120, 85)">
          {/* Stem and Leaf */}
          <path 
            d="M0,25 Q-5,55 -20,65 M0,40 Q-15,40 -25,30" 
            stroke="#B8860B" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
          />
           {/* Leaf Shape fill */}
          <path 
            d="M0,40 Q-15,40 -25,30 Q-15,20 0,35" 
            fill="#B8860B" 
            opacity="0.8"
          />

          {/* Petals */}
          <g fill="#FCD34D" stroke="#B8860B" strokeWidth="0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <ellipse 
                key={i}
                cx="0" 
                cy="-22" 
                rx="4" 
                ry="14" 
                transform={`rotate(${i * 20})`} 
              />
            ))}
            {/* Inner layer petals */}
            {Array.from({ length: 18 }).map((_, i) => (
              <ellipse 
                key={`in-${i}`}
                cx="0" 
                cy="-12" 
                rx="3" 
                ry="10" 
                transform={`rotate(${i * 20 + 10})`} 
              />
            ))}
          </g>

          {/* Center Seeds */}
          <circle cx="0" cy="0" r="12" fill="#B8860B" />
          <circle cx="0" cy="0" r="10" fill="#8D6E63" opacity="0.5" />
          
          {/* Detail dots in center */}
          <g fill="#FFD54F">
             <circle cx="-4" cy="-4" r="1" />
             <circle cx="4" cy="-4" r="1" />
             <circle cx="-4" cy="4" r="1" />
             <circle cx="4" cy="4" r="1" />
             <circle cx="0" cy="0" r="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};
