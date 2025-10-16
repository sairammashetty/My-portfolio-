import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickNav from './components/QuickNav';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Awards from './components/Awards';
import Articles from './components/Articles';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Admin from './components/Admin';
import { sections } from './constants';

const sectionComponentMap: { [key: string]: React.FC } = {
  about: About,
  experience: Experience,
  skills: Skills,
  awards: Awards,
  articles: Articles,
  projects: Projects,
  certifications: Certifications,
  contact: Contact,
};

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');
  const [visibleSections, setVisibleSections] = useState(sections.filter(s => s.visible));

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    
    // Listen for custom event from Admin panel to update sections without a page reload
    const handleSectionsUpdate = () => {
        const updatedSectionsRaw = localStorage.getItem('sectionsConfig');
        if (updatedSectionsRaw) {
            const updatedSections = JSON.parse(updatedSectionsRaw);
            setVisibleSections(updatedSections.filter((s: { visible: boolean; }) => s.visible));
        }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    window.addEventListener('sectionsUpdated', handleSectionsUpdate);
    
    // Initial check in case data is already in localStorage
    handleSectionsUpdate();


    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
      window.removeEventListener('sectionsUpdated', handleSectionsUpdate);
    };
  }, []);


  if (isAdminView) {
    return <Admin />;
  }

  return (
    <div className="bg-slate-900 text-slate-400">
      <Header />
      <main>
        <Hero />
        <QuickNav />
        {visibleSections.map(section => {
          const SectionComponent = sectionComponentMap[section.id];
          if (SectionComponent) {
            return <SectionComponent key={section.id} />;
          }
          return null;
        })}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;