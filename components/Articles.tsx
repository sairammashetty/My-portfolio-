import React from 'react';
import { articlesData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const Articles: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="articles" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Articles & <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Insights</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-slate-700 group transition-all duration-500 hover:-translate-y-2 hover:shadow-purple-500/20 fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <a href={article.link || '#'} target="_blank" rel="noopener noreferrer">
                <div className="overflow-hidden h-56">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-cyan-400 mb-2">{article.category}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                  <p className="text-slate-400">{article.description}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
