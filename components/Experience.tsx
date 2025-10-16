import React from 'react';
import { experienceData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const ExperienceCard: React.FC<{ item: typeof experienceData[0]; index: number; isVisible: boolean }> = ({ item, index, isVisible }) => {
  const isOdd = index % 2 !== 0;

  return (
    <div className="relative pl-12 md:pl-16 pb-12">
      {/* Timeline Dot & Line */}
      <div className="absolute left-0 top-1 w-px bg-slate-700 h-full"></div>
      <div className="absolute left-[-9px] top-1 z-10">
        <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-cyan-500"></div>
      </div>

      {/* Card Content */}
      <div 
        className={`transform transition-all duration-700
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-2xl shadow-black/20 group hover:border-cyan-500/50">
          <div className="flex items-center mb-3">
            {item.logoUrl && (
              <img src={item.logoUrl} alt={`${item.company} logo`} className="w-8 h-8 rounded-full mr-3" />
            )}
            <div>
              <p className="text-sm text-cyan-400">{item.date}</p>
              <h3 className="font-bold text-white text-xl">{item.title}</h3>
            </div>
          </div>
          <h4 className="mb-4 font-semibold text-slate-300">{item.company}</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-400 marker:text-cyan-400">
            {item.description.map((point, i) => <li key={i}>{point}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="experience" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Work <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Experience</span>
        </h2>
        <div ref={ref} className="relative max-w-3xl mx-auto">
          {experienceData.map((item, index) => (
            <ExperienceCard key={index} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;