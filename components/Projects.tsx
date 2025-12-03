import React from 'react';
import { projectsData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const Projects: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

  if (!projectsData || projectsData.length === 0) {
    return (
       <section id="projects" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-center mb-4 text-white">
                Featured <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Projects</span>
            </h2>
            <p className="text-slate-400 text-lg">No projects have been added yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Featured <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Projects</span>
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-slate-700 group transition-all duration-500 hover:-translate-y-2 hover:shadow-purple-500/20 fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
                <div className="overflow-hidden h-56 relative">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="py-2 px-4 bg-cyan-500 rounded-md text-white font-semibold hover:bg-cyan-400 transition-colors">Live View</a>}
                        {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="py-2 px-4 bg-slate-700 rounded-md text-white font-semibold hover:bg-slate-600 transition-colors">Source Code</a>}
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold bg-slate-700 text-cyan-300 py-1 px-3 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;