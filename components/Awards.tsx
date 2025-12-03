import React from 'react';
import { awardsData } from '../constants';
import AwardIcon from './icons/AwardIcon';
import { useOnScreen } from '../hooks/useOnScreen';

const Awards: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="awards" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Achievements & <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-gradient">Awards</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {awardsData.map((award, index) => (
            <div 
              key={index} 
              className={`group fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{ perspective: '1000px', transitionDelay: `${index * 200}ms` }}
            >
              <div className={`bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/20 transition-all duration-500 hover:shadow-yellow-400/20 hover:-translate-y-2 hover:rotate-x-6 hover:-rotate-y-6`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 mb-4">
                    <AwardIcon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{award.name}</h3>
                    <p className="text-amber-300 font-semibold mt-1">{award.date}</p>
                    <p className="text-slate-400 mt-3">{award.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
