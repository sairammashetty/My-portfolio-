import React from 'react';
import { certificationsData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const Certifications: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  if (!certificationsData || certificationsData.length === 0) {
    return (
       <section id="certifications" className="py-24 bg-slate-800/30">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-center mb-4 text-white">
                Licenses & <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Certifications</span>
            </h2>
            <p className="text-slate-400 text-lg">No certifications have been added yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Licenses & <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Certifications</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 p-6 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 group transition-all duration-500 hover:-translate-y-2 hover:shadow-cyan-500/20 fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
                <div className="flex items-start gap-4">
                    {cert.imageUrl && <img src={cert.imageUrl} alt={cert.name} className="w-16 h-16 object-contain"/>}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                        <p className="text-slate-300 font-semibold">{cert.issuer}</p>
                        <p className="text-sm text-slate-400 mt-1">Issued: {cert.date}</p>
                        {cert.credentialUrl && (
                             <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-2 inline-block">
                                Show Credential &rarr;
                            </a>
                        )}
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;