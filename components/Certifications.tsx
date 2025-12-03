
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
            <p className="text-slate-400 text-lg">No certifications have been added yet.</p>
        </div>
      </section>
    );
  }

  const getSafeLink = (link?: string) => {
    if (!link) return '#';
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    return `https://${link}`;
  };

  return (
    <section id="certifications" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Licenses & <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Certifications</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, index) => {
             const safeCredentialUrl = getSafeLink(cert.credentialUrl);
             const hasCredential = cert.credentialUrl && cert.credentialUrl.trim().length > 0;
             
             return (
                <div
                key={index}
                className={`bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-black/20 border border-slate-700 group transition-all duration-500 hover:-translate-y-2 hover:shadow-cyan-500/20 hover:border-cyan-500/30 fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                            {cert.imageUrl ? (
                                <img src={cert.imageUrl} alt={cert.name} className="w-16 h-16 object-contain bg-white rounded-lg p-1 shadow-md flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">{cert.name}</h3>
                                <p className="text-slate-300 font-medium text-sm mt-1">{cert.issuer}</p>
                                <p className="text-xs text-slate-500 mt-2 bg-slate-900/50 inline-block px-2 py-0.5 rounded border border-slate-700/50">Issued: {cert.date}</p>
                            </div>
                        </div>
                        
                        {hasCredential ? (
                            <div className="mt-auto pt-4 border-t border-slate-700/50">
                                <a 
                                    href={safeCredentialUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center justify-center w-full py-3 px-4 bg-slate-700/50 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-slate-600 hover:border-cyan-500 rounded-lg transition-all duration-300 font-semibold text-sm group-hover:shadow-lg"
                                >
                                    <span>View Certificate</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                             <div className="mt-auto pt-4 border-t border-slate-700/50">
                                <span className="block w-full text-center py-3 px-4 text-slate-500 text-sm font-medium cursor-not-allowed">
                                    No Link Available
                                </span>
                             </div>
                        )}
                    </div>
                </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
