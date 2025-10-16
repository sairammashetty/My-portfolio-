import React from 'react';
import { personalInfo } from '../constants';
import LinkedInIcon from './icons/LinkedInIcon';
import EmailIcon from './icons/EmailIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-slate-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_#00d4ff] rounded-full p-2">
                <LinkedInIcon className="w-6 h-6" />
            </a>
            <a href={`mailto:${personalInfo.email}`} className="text-slate-500 hover:text-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_#00d4ff] rounded-full p-2">
                <EmailIcon className="w-6 h-6" />
            </a>
            </div>
        </div>
        <div className="text-center mt-6">
            <a href="#admin" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">Admin Panel</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
