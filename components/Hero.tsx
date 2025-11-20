
import React from 'react';

interface HeroProps {
  image: string;
  title: string;
  subtitle: string;
}

export const Hero: React.FC<HeroProps> = ({ image, title, subtitle }) => {
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-110"
        style={{
          backgroundImage: `url("${image}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <span className="text-white/90 uppercase tracking-[0.4em] text-xs md:text-sm mb-4 font-bold drop-shadow-md bg-bahia-orange/90 px-6 py-2 rounded-full backdrop-blur-sm shadow-lg">
          Salvador • Bahia • Brasil
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-2xl shadow-black">
          {title}
        </h1>
        <p className="text-white font-medium text-lg md:text-xl max-w-2xl mb-8 drop-shadow-lg opacity-95 italic font-serif bg-black/10 p-2 rounded-lg backdrop-blur-[2px]">
          {subtitle}
        </p>
        <button className="bg-white text-bahia-orange px-10 py-4 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-sunflower-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
          Ver Coleção
        </button>
      </div>
    </div>
  );
};
