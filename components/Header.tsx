
import React, { useState, useEffect } from 'react';
import { navLinks, personalInfo } from '../constants';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.getAttribute('id') || '';
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/50 backdrop-blur-lg shadow-2xl shadow-cyan-500/10' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">
          {personalInfo.name.split(' ')[0][0]}{personalInfo.name.split(' ')[1][0]}
        </a>
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={`relative text-lg font-medium text-white/80 hover:text-white transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-cyan-400' : ''}`}>
                {link.name}
                <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === link.href.substring(1) ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
