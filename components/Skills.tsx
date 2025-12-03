
import React, { useEffect, useState } from 'react';
import { skillsData } from '../constants';
import { useOnScreen } from '../hooks/useOnScreen';

const SkillCircle: React.FC<{ skill: typeof skillsData[0], isVisible: boolean }> = ({ skill, isVisible }) => {
  const [progress, setProgress] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setProgress(skill.level), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.level]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-slate-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="text-cyan-400"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {progress}%
        </span>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-300">{skill.name}</p>
    </div>
  );
};

const Skills: React.FC = () => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="skills" className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
          Professional <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Skills</span>
        </h2>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 justify-center">
          {skillsData.map((skill, index) => (
            <SkillCircle key={index} skill={skill} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
