
import React from 'react';
import { articlesData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const Articles: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  const getSafeLink = (link?: string) => {
    if (!link || link.trim() === '' || link === '#') return null;
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    return `https://${link}`;
  };

  return (
    <section id="articles" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Articles & <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Insights</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article, index) => {
            const safeLink = getSafeLink(article.link);
            const isClickable = safeLink !== null;

            return (
              <div
                key={index}
                className={`flex flex-col bg-slate-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-slate-700 group transition-all duration-500 hover:-translate-y-2 hover:shadow-cyan-500/10 fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <a 
                    href={isClickable ? safeLink : undefined} 
                    target={isClickable ? "_blank" : undefined} 
                    rel={isClickable ? "noopener noreferrer" : undefined}
                    className={`block flex-grow ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={(e) => !isClickable && e.preventDefault()}
                >
                  <div className="overflow-hidden h-56 relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    {isClickable && (
                        <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-cyan-400 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col h-[calc(100%-14rem)] bg-slate-800/40 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-900/20 px-2 py-1 rounded">{article.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-cyan-300 transition-colors">{article.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{article.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-700/50">
                        {isClickable ? (
                            <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors inline-flex items-center">
                                Read Article 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500 italic">Coming Soon</span>
                        )}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Articles;
