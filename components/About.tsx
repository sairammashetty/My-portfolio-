
import React from 'react';
import { personalInfo, educationData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const About: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="about" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl font-extrabold text-center mb-4 text-white">
                About <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Me</span>
            </h2>
            <p className="max-w-3xl mx-auto text-center text-slate-400 text-lg mb-16">
                {personalInfo.summary}
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/20 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div ref={ref} className={`fade-in-up ${isVisible ? 'visible' : ''}`}>
                    <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
                    <p className="text-lg font-semibold text-cyan-400">{educationData.degree}</p>
                    <p className="text-slate-300">{educationData.institution}</p>
                    <p className="text-slate-400 mt-2">{educationData.duration}</p>
                    <p className="text-slate-400 mt-1">GPA: {educationData.gpa}</p>
                </div>
                 <div ref={ref} className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{transitionDelay: '200ms'}}>
                    <img src="https://picsum.photos/seed/education/500/300" alt="Education" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
