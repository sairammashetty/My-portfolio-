
import React from 'react';
import { personalInfo } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';
import LinkedInIcon from './icons/LinkedInIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';
import DownloadIcon from './icons/DownloadIcon';

const Hero: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.3 });

  const infoCards = [
    { icon: <LocationIcon className="w-5 h-5 text-cyan-300"/>, text: personalInfo.location, delay: 1 },
    { icon: <EmailIcon className="w-5 h-5 text-cyan-300"/>, text: personalInfo.email, delay: 2 },
    { icon: <PhoneIcon className="w-5 h-5 text-cyan-300"/>, text: personalInfo.phone, delay: 3 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-20 lg:pt-0">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40 animate-gradient"></div>
      
      {/* Dot Grid Pattern for technical look */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-30"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={ref} className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
        
        {/* Left side: Text content */}
        <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] group hover:bg-slate-800/80 transition-all cursor-default">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-300 font-bold text-xs tracking-widest uppercase">Portfolio</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
            {personalInfo.name.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
            ))}
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-slate-300">
            I am a <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text font-bold">{personalInfo.title}</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
             <a href="#contact" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/50 hover:-translate-y-1">
              Contact Me
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </a>
            
            {/* Download Resume Button - Always visible in layout, functional if URL present */}
            {personalInfo.resumeUrl ? (
              <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 backdrop-blur-md shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                <DownloadIcon className="w-5 h-5 mr-2 -ml-1 text-cyan-400 transition-transform group-hover:-translate-y-1 group-hover:text-white" />
                Download Resume
              </a>
            ) : (
                <button disabled className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-500 transition-all duration-300 bg-white/5 border border-white/5 rounded-xl cursor-not-allowed">
                    <DownloadIcon className="w-5 h-5 mr-2 -ml-1 text-slate-600" />
                    Resume Available Soon
                </button>
            )}
          </div>

          <div className="mt-12 flex justify-center lg:justify-start gap-6">
             <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
                <LinkedInIcon className="w-6 h-6"/>
             </a>
             <a href={`mailto:${personalInfo.email}`} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
                <EmailIcon className="w-6 h-6"/>
             </a>
          </div>
        </div>

        {/* Right side: Image and floating cards */}
        <div className="relative flex justify-center items-center h-[500px] lg:h-[600px]">
          {/* Main Profile Circle */}
          <div className="relative group animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse-glow"></div>
            <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-[6px] border-slate-800/80 bg-slate-800 shadow-2xl">
                 <img 
                  src={personalInfo.profileImageUrl} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
            </div>
          </div>
          
          {/* Glassmorphism Floating Cards */}
          {infoCards.map(card => (
            <div 
              key={card.text}
              className={`absolute hidden md:flex items-center gap-4 py-4 px-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-float animate-float-delay-${card.delay}
              ${card.delay === 1 ? 'top-[10%] left-0 lg:-left-4' : ''}
              ${card.delay === 2 ? 'bottom-[15%] left-0 lg:-left-8' : ''}
              ${card.delay === 3 ? 'top-[45%] right-0 lg:-right-16' : ''}
              hover:bg-slate-800/60 hover:border-cyan-500/40 transition-all duration-300 cursor-default hover:scale-105 group
              `}
            >
              <div className="p-2.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                {card.icon}
              </div>
              <span className="text-sm text-slate-200 font-medium whitespace-nowrap">{card.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
