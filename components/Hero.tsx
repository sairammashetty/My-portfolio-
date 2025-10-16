import React from 'react';
import { personalInfo } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';
import LinkedInIcon from './icons/LinkedInIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';

const Hero: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.3 });

  const infoCards = [
    { icon: <LocationIcon className="w-6 h-6 text-cyan-300"/>, text: personalInfo.location, delay: 1 },
    { icon: <EmailIcon className="w-6 h-6 text-cyan-300"/>, text: personalInfo.email, delay: 2 },
    { icon: <PhoneIcon className="w-6 h-6 text-cyan-300"/>, text: personalInfo.phone, delay: 3 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/50 animate-gradient"></div>
      
      {/* Floating particles/shapes could go here */}
      
      <div ref={ref} className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 items-center gap-16">
        {/* Left side: Text content */}
        <div className={`text-center md:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-cyan-400 font-semibold text-lg">Hello, I'm</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white my-3 typing-effect-container">
            <span className="typing-effect">{personalInfo.name}</span>
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient mb-8">
            {personalInfo.title}
          </h2>
          <div className="flex justify-center md:justify-start gap-4">
             <a href="#contact" className="text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-base px-6 py-3 text-center transition-all duration-300 transform hover:scale-105">
              Get In Touch
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white bg-transparent border-2 border-cyan-400 hover:bg-cyan-400/20 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-base px-6 py-3 text-center transition-all duration-300 flex items-center gap-2">
              <LinkedInIcon className="w-5 h-5"/> LinkedIn
            </a>
          </div>
        </div>

        {/* Right side: Image and floating cards */}
        <div className="relative hidden md:flex justify-center items-center h-[500px]">
          {/* Profile Picture */}
          <div className="relative group animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
            <img 
              src={personalInfo.profileImageUrl} 
              alt="Sairam Mashetty"
              className="relative w-72 h-72 lg:w-80 lg:w-80 rounded-full object-cover border-4 border-slate-800"
            />
          </div>
          
          {/* Floating Info Cards */}
          {infoCards.map(card => (
            <div 
              key={card.text}
              className={`absolute flex items-center gap-3 p-3 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl animate-float animate-float-delay-${card.delay}
              ${card.delay === 1 ? 'top-10 left-0' : ''}
              ${card.delay === 2 ? 'bottom-20 -left-10' : ''}
              ${card.delay === 3 ? 'top-1/2 -right-10' : ''}
              `}
            >
              {card.icon}
              <span className="text-sm text-white font-medium whitespace-nowrap">{card.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
