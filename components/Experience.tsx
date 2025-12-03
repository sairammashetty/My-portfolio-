
import React from 'react';
import { experienceData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const ExperienceCard: React.FC<{ item: typeof experienceData[0]; index: number; isVisible: boolean }> = ({ item, index, isVisible }) => {
  return (
    <div className="relative pl-12 md:pl-16 pb-16 group last:pb-0">
      {/* Timeline Dot & Line */}
      <div className="absolute left-0 top-1 w-[2px] bg-gradient-to-b from-slate-700 via-slate-800 to-transparent h-full group-hover:via-cyan-500/50 transition-colors duration-500"></div>
      <div className="absolute left-[-9px] top-1 z-10">
        <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-600 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500"></div>
      </div>

      {/* Card Content */}
      <div 
        className={`transform transition-all duration-700
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group-hover:-translate-y-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
             <div className="flex items-center">
                {item.logoUrl && (
                  <img src={item.logoUrl} alt={`${item.company} logo`} className="w-12 h-12 rounded-lg mr-4 shadow-md object-contain bg-white p-1" />
                )}
                <div>
                    <h3 className="font-bold text-white text-2xl tracking-tight">{item.title}</h3>
                    <h4 className="font-semibold text-lg text-cyan-400 flex items-center mt-1">
                        {item.company}
                    </h4>
                </div>
             </div>
             <div className="self-start md:self-center inline-block px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-slate-300 text-sm font-semibold whitespace-nowrap shadow-inner">
                {item.date}
             </div>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-slate-700/50 via-slate-700/10 to-transparent my-6"></div>
          
          <ul className="space-y-4">
            {item.description.map((point, i) => (
                <li key={i} className="flex items-start text-slate-300 leading-relaxed text-base group/item">
                    <span className="mr-4 mt-2.5 w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover/item:bg-cyan-400 transition-colors flex-shrink-0"></span>
                    <span className="group-hover/item:text-slate-200 transition-colors">{point}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="experience" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-white tracking-tight">
          Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Experience</span>
        </h2>
        <div ref={ref} className="relative max-w-4xl mx-auto">
          {experienceData.map((item, index) => (
            <ExperienceCard key={index} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
