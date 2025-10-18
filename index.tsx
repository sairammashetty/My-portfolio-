
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import * as THREE from 'three';

// --- HOOKS ---
const { useState, useEffect, useRef, useCallback } = React;

// Safely get API_KEY to prevent crash in environments where `process` is not defined
const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : null;

// Fix: Added explicit types for the useOnScreen hook to ensure correct type inference for the returned ref and boolean.
const useOnScreen = (options: IntersectionObserverInit | undefined): [React.RefObject<any>, boolean] => {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIntersecting(true); }, options);
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [options]);
  return [ref, isIntersecting];
};

// --- UTILS ---
const fileToBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

// --- CONSTANTS ---
const loadData = (key: string, defaultValue: any) => {
  try {
    const savedData = localStorage.getItem(key);
    const parsed = savedData ? JSON.parse(savedData) : defaultValue;
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return {...defaultValue, ...parsed};
    }
    if (Array.isArray(parsed)) {
        return parsed.map(item => typeof item === 'object' && item !== null ? {...(defaultValue.find((d: { id: any; }) => d.id === item.id) || defaultValue[0] || { visible: true }), ...item} : item);
    }
    return parsed;
  } catch (error) { console.error(`Error loading ${key}:`, error); return defaultValue; }
};

const personalInfoDefault = { name: 'Sairam Mashetty', title: 'Associate Claims', summary: `As a detail-oriented Claims Associate, I specialize in ensuring insurance claims are handled accurately and efficiently. I'm skilled at investigating details, managing records, and navigating industry rules to support my team and deliver great results. I'm passionate about my work and always looking for ways to improve.`, email: 'sairammashetty@gmail.com', phone: '+91 9381094860', location: 'Hyderabad, Telangana, India.', linkedin: 'https://www.linkedin.com/in/sairam-mashetty', profileImageUrl: 'https://i.imgur.com/62GgIIL.png', showProfileImage: true, educationImageUrl: 'https://picsum.photos/seed/education/500/300', showEducationImage: true, contactIntro: "I'm open to new opportunities and collaborations. Feel free to reach out via email or phone.", cvUrl: 'https://www.africau.edu/images/default/sample.pdf', showCvButton: true, notificationMethod: 'email', notificationPhone: '' };
const educationDataDefault = { degree: 'Bachelor of Commerce (Computers)', institution: 'Sri Vijaya Sai Degree College, Telangana University', duration: '2018 - 2021', gpa: '8.6' };
const navLinksDefault = [{ name: 'About', href: '#about' }, { name: 'Experience', href: '#experience' }, { name: 'Skills', href: '#skills' }, { name: 'Awards', href: '#awards' }, { name: 'Contact', href: '#contact' }];
const sectionsDefault = [{ id: 'about', title: 'About', visible: true }, { id: 'experience', title: 'Experience', visible: true }, { id: 'skills', title: 'Skills', visible: true }, { id: 'awards', title: 'Awards', visible: true }, { id: 'projects', title: 'Projects', visible: false }, { id: 'certifications', title: 'Certifications', visible: true }, { id: 'articles', title: 'Articles', visible: true }, { id: 'contact', title: 'Contact', visible: true }];
const experienceDataDefault = [{ id: 1, date: '09/2022 - Present', title: 'Associate Claims (Accumulators)', company: 'Carelon Global Solutions', logoUrl: 'https://i.imgur.com/eQ7DNfR.png', showLogo: true, visible: true, description: ['Carefully checked member enrollment details like names, birthdays, and insurance to ensure everything was correct.', 'Investigated and denied claims that were not covered, providing clear reasons to maintain fair processing.', 'Reviewed financial details like deductibles to find and fix errors, such as duplicate or incorrect charges.', 'Made precise adjustments to claims to correct any mistakes and ensure complete accuracy.', 'Tracked patient expenses to prevent over-charges and help them get the most out of their insurance benefits.', 'Ensured all claim processing followed insurance policy limits and company guidelines.'] }];
const skillsDataDefault = [{ name: 'Claims Investigation', level: 95, visible: true }, { name: 'Policy Analysis', level: 90, visible: true }, { name: 'MS Office Suite', level: 92, visible: true }, { name: 'Regulatory Compliance', level: 88, visible: true }, { name: 'Data Accuracy', level: 98, visible: true }, { name: 'Clear Communication', level: 92, visible: true }, { name: 'Problem Solving', level: 90, visible: true }];
const awardsDataDefault = [{ id: 1, name: 'Impact Award', date: 'September 2024', description: 'Recognized with the Impact Award for consistently delivering outstanding performance and exceeding expectations.', visible: true }, { id: 2, name: 'Impact Award', date: 'January 2024', description: 'Honored for exceptional contributions and a proactive approach to resolving complex claim discrepancies.', visible: true }, { id: 3, name: 'Impact Award', date: 'March 2023', description: 'Awarded for meticulous investigation skills and a commitment to ensuring accuracy in claims processing.', visible: true }];
const articlesDataDefault = [
    { id: 1, title: "AI's Role in Revolutionizing Insurance Claims", description: "A deep dive by McKinsey & Company into how AI is streamlining claims processing, reducing fraud, and enhancing customer experiences.", imageUrl: 'https://picsum.photos/seed/claims-future/600/400', showImage: true, category: 'AI in Insurance', link: 'https://www.mckinsey.com/industries/financial-services/our-insights/the-future-at-hyper-scale-the-claims-organization-of-2030', visible: true },
    { id: 2, title: 'Top Health Industry Issues of 2024: Reinventing the System', description: "PwC's report on significant trends facing the healthcare industry, including workforce strategy, affordability, and new technologies.", imageUrl: 'https://picsum.photos/seed/healthcare-regs/600/400', showImage: true, category: 'Healthcare Trends', link: 'https://www.pwc.com/us/en/industries/health-industries/library/top-health-industry-issues.html', visible: true },
    { id: 3, title: 'The Imperative for Quality Data in Healthcare', description: 'An overview from HIMSS on why data integrity is foundational for improving patient outcomes and operational efficiency.', imageUrl: 'https://picsum.photos/seed/data-accuracy/600/400', showImage: true, category: 'Data & Analytics', link: 'https://www.himss.org/resources/importance-data-quality-healthcare', visible: true }
];
const projectsDataDefault: any[] = [];
const certificationsDataDefault: any[] = [];
const securityDataDefault = { recoveryMethod: 'phrase', recoveryPhrase: '', recoveryQuestion: '', recoveryAnswer: '' };
const aiFeaturesConfigDefault = { aiFeaturesEnabled: true, imageEditingEnabled: true, contentGenerationEnabled: true, showChatbot: true };
const securityQuestions = ["What was the name of your first pet?", "What is your mother's maiden name?", "What was the name of your elementary school?", "In what city were you born?", "What is your favorite book?"];


// --- ICONS ---
const LocationIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>);
const EmailIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>);
const PhoneIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z" /></svg>);
const LinkedInIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.94 0-1.62.63-1.62 1.93V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.38 1.02 3.38 3.56z"/></svg>);
const AwardIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>);
const MagicWandIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.71,9.29,19,7.58,16.42,5,18.13,3.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L15,3.58,12.42,1,10.71,2.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0L13.83,2.42l2,2L14.12,6.12a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0L17.24,5.83l2,2L17.58,9.54a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0L20.71,9.29ZM19.24,14.5a3.47,3.47,0,0,1-2.47.75,3.45,3.45,0,0,1-2.47-1,1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41,5.46,5.46,0,0,0,7.78,0,1,1,0,0,0-1.42-1.41ZM7.48,10.5a3.49,3.49,0,0,1,0-5,1,1,0,0,0-1.42-1.41,5.49,5.49,0,0,0,0,7.78,1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41A3.41,3.41,0,0,1,7.48,10.5ZM12,19.34a.84.84,0,0,1-.59-.24L8.5,16.19a3.25,3.25,0,0,1,0-4.6l.7-.71a1,1,0,0,0-1.41-1.41l-.71.71a5.25,5.25,0,0,0,0,7.42l2.92,2.91a.84.84,0,0,1-.59,1.43H3.84a1,1,0,0,0,0,2H8.54a2.83,2.83,0,0,0,2-4.82l.85-.85a1,1,0,1,0-1.41-1.41l-.85.85a.86.86,0,0,1-1.15.34.81.81,0,0,1-.6-.57,1,1,0,0,0-1-.78,1,1,0,0,0-1,.78.81.81,0,0,1-.6.57.86.86,0,0,1-1.15-.34L3,14.3a1,1,0,0,0-1.41,1.41L3,17.12a3.25,3.25,0,0,1,0,4.6l2.91,2.92a.84.84,0,0,1,.59.24.84.84,0,0,1,.59-.24l2.91-2.92a3.25,3.25,0,0,1,0-4.6l-.7-.71a1,1,0,0,0-1.41,1.41l.7.71a1.25,1.25,0,0,0,1.77,0l2.91-2.92a1.25,1.25,0,0,0,0-1.77L13.18,12.4a1,1,0,1,0-1.41,1.41l2.35,2.35a3.25,3.25,0,0,1,0,4.6Z"/></svg>);
const ChatIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>);
const CloseIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SendIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>);
const SunIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zm0-7c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1zm0 18c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1zm-8-9c-.55 0-1-.45-1-1H1c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1zm18 0c-.55 0-1-.45-1-1h-2c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1zM5.64 5.64c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 5.64zm12.72 12.72c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.41-1.41zM5.64 18.36c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.41-1.41zm12.72-12.72c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.41-1.41z"/></svg>);
const MoonIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" /></svg>);
const DownloadIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);

// --- COMPONENTS ---

// Fix: Added types for component props.
const ThreeJSBackground = React.memo(({ type, className, id = '' }: {type: 'crystal' | 'dodecahedron' | 'sphere', className: string, id?: string}) => {
    // Fix: Added explicit type for the ref.
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const mountNode = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountNode.appendChild(renderer.domElement);
        
        let mainObject: THREE.Mesh;
        const mouse = new THREE.Vector2();

        // Scene setup based on type
        if (type === 'crystal') {
            const geometry = new THREE.IcosahedronGeometry(2, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0x3a005f, metalness: 0.9, roughness: 0.1, wireframe: true });
            mainObject = new THREE.Mesh(geometry, material);
            scene.add(mainObject);
            const light1 = new THREE.PointLight(0x00f6ff, 2); light1.position.set(5, 5, 5); scene.add(light1);
            const light2 = new THREE.PointLight(0xd400ff, 2); light2.position.set(-5, -5, -5); scene.add(light2);
            camera.position.z = 5;
        } else if (type === 'dodecahedron') {
            const geometry = new THREE.DodecahedronGeometry(2, 0);
            const material = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.2, metalness: 0.9, flatShading: true });
            mainObject = new THREE.Mesh(geometry, material);
            scene.add(mainObject);
            const light1 = new THREE.DirectionalLight(0xffffff, 1); light1.position.set(5, 5, 5); scene.add(light1);
            const light2 = new THREE.PointLight(0x00f6ff, 1); light2.position.set(-5, -5, -5); scene.add(light2);
            camera.position.z = 6;
        } else if (type === 'sphere') {
            const geometry = new THREE.SphereGeometry(2, 64, 64);
            const material = new THREE.MeshPhysicalMaterial({ color: 0x00f6ff, transmission: 1, roughness: 0.1, thickness: 1.5, ior: 1.8 });
            mainObject = new THREE.Mesh(geometry, material);
            scene.add(mainObject);
            const light1 = new THREE.PointLight(0xffffff, 2); light1.position.set(10, 10, 10); scene.add(light1);
            const light2 = new THREE.PointLight(0xd400ff, 1); light2.position.set(-10, -5, -5); scene.add(light2);
            camera.position.z = 5;
        }

        const onMouseMove = (event: MouseEvent) => {
            const rect = mountNode.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);
        
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            if (mainObject) {
              if (type === 'crystal' || type === 'dodecahedron') {
                  mainObject.rotation.x = elapsedTime * 0.1; mainObject.rotation.y = elapsedTime * 0.1;
                  camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
                  camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.02;
              } else if (type === 'sphere') {
                   mainObject.rotation.y = elapsedTime * 0.08;
                   camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.02;
                   camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.02;
              }
            }

            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mountNode) {
                mountNode.removeChild(renderer.domElement);
            }
        };
    }, [type]);

    return <div ref={mountRef} className={className} id={id} />;
});

const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => (
  <button
    onClick={toggleTheme}
    className={`relative w-16 h-8 rounded-full flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-bg-primary ring-accent-primary ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-cyan-500/50'}`}
    aria-label="Toggle theme"
  >
    <span className={`absolute left-1 transition-transform duration-300 ease-in-out transform ${ theme === 'dark' ? 'translate-x-0' : 'translate-x-8' } w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden`}>
       <SunIcon className={`w-4 h-4 text-yellow-500 transition-all duration-300 transform absolute ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
       <MoonIcon className={`w-4 h-4 text-slate-800 transition-all duration-300 transform absolute ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
    </span>
  </button>
);

const Header = ({ personalInfo, navLinks, theme, toggleTheme }: { personalInfo: any, navLinks: any[], theme: string, toggleTheme: () => void }) => {
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-glass backdrop-blur-lg border-b border-border-color' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold bg-gradient-accent text-gradient font-heading">
          {personalInfo.name.split(' ')[0][0]}{personalInfo.name.split(' ')[1][0]}
        </a>
        <div className="hidden md:flex items-center">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`relative text-lg font-medium text-text-primary/80 hover:text-text-primary transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-accent-primary' : ''}`}>
                  {link.name}
                  <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-accent-primary transform transition-transform duration-300 ${activeSection === link.href.substring(1) ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </a>
              </li>
            ))}
          </ul>
           <div className="ml-8">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
           </div>
        </div>
      </nav>
    </header>
  );
};

const Hero = ({ personalInfo }: { personalInfo: any }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.3 });
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      <ThreeJSBackground type="crystal" className="absolute top-0 left-0 w-full h-full" id="hero-canvas" />
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-purple-900/50 opacity-50"></div>
      <div ref={ref} className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 items-center gap-16">
        <div className={`text-center md:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-accent-primary font-semibold text-lg">Hello, I'm</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white my-3 font-heading">
            {personalInfo.name}
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold bg-gradient-accent text-gradient mb-8">
            {personalInfo.title}
          </h2>
          <div className="flex justify-center md:justify-start gap-4 flex-wrap">
             <a href="#contact" className="btn-accent hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-cyan-300/50 font-medium rounded-lg text-base px-6 py-3 text-center transition-all duration-300 transform hover:scale-105 glow-on-hover">
              Get In Touch
            </a>
            {personalInfo.showCvButton && personalInfo.cvUrl && (
               <a href={personalInfo.cvUrl} download="Sairam_Mashetty_CV.pdf" target="_blank" rel="noopener noreferrer" className="text-white bg-transparent border-2 border-accent-secondary hover:bg-accent-secondary/20 focus:ring-4 focus:outline-none focus:ring-purple-300/50 font-medium rounded-lg text-base px-6 py-3 text-center transition-all duration-300 flex items-center gap-2">
                  <DownloadIcon className="w-5 h-5"/> Download CV
               </a>
            )}
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white bg-transparent border-2 border-accent-primary hover:bg-accent-primary/20 focus:ring-4 focus:outline-none focus:ring-cyan-300/50 font-medium rounded-lg text-base px-6 py-3 text-center transition-all duration-300 flex items-center gap-2">
              <LinkedInIcon className="w-5 h-5"/> LinkedIn
            </a>
          </div>
        </div>
        <div className="relative hidden md:flex justify-center items-center h-[500px]">
          {personalInfo.showProfileImage && (
            <div className="relative group animate-float">
              <div className="absolute -inset-1 bg-gradient-accent rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img src={personalInfo.profileImageUrl} alt="Sairam Mashetty" className="relative w-72 h-72 lg:w-80 lg:w-80 rounded-full object-cover border-4 border-bg-secondary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Section: React.FC<{id: string; title: string; titleAccent: string; children: React.ReactNode;}> = ({ id, title, titleAccent, children }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <section id={id} className="py-24 bg-bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref} className={`fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl font-extrabold text-center mb-16 text-white font-heading">
            {title} <span className="bg-gradient-accent text-gradient">{titleAccent}</span>
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
};

const About = ({ personalInfo, educationData }: { personalInfo: any, educationData: any }) => {
    const [summaryRef, isSummaryVisible] = useOnScreen({ threshold: 0.3 });
    const [educationRef, isEducationVisible] = useOnScreen({ threshold: 0.3 });
    return (
      <Section id="about" title="About" titleAccent="Me">
        <ThreeJSBackground type="dodecahedron" className="section-3d-bg" />
        <p ref={summaryRef} className={`max-w-3xl mx-auto text-center text-text-secondary text-lg mb-16 fade-in-up ${isSummaryVisible ? 'visible' : ''}`}>
          {personalInfo.summary}
        </p>
        <div ref={educationRef} className={`max-w-4xl mx-auto bg-bg-glass backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/20 border border-border-color fade-in-up ${isEducationVisible ? 'visible' : ''}`} style={{transitionDelay: '200ms'}}>
            <div className={`grid ${personalInfo.showEducationImage ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8 items-center`}>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
                    <p className="text-lg font-semibold text-accent-primary">{educationData.degree}</p>
                    <p className="text-text-primary">{educationData.institution}</p>
                    <p className="text-text-secondary mt-2">{educationData.duration}</p>
                    <p className="text-text-secondary mt-1">GPA: {educationData.gpa}</p>
                </div>
                {personalInfo.showEducationImage && (
                   <div>
                      <img src={personalInfo.educationImageUrl} alt="Education" className="rounded-lg shadow-lg border-2 border-border-color" />
                  </div>
                )}
            </div>
        </div>
      </Section>
    );
};

const Experience = ({ experienceData }: { experienceData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <Section id="experience" title="Work" titleAccent="Experience">
      <div ref={ref} className="relative max-w-3xl mx-auto">
        {experienceData.filter(item => item.visible ?? true).map((item, index) => (
          <div key={item.id} className="relative pl-12 md:pl-16 pb-12">
            <div className="absolute left-0 top-1 w-px bg-slate-700 h-full"></div>
            <div className="absolute left-[-9px] top-1 z-10"><div className="w-5 h-5 rounded-full bg-bg-secondary border-2 border-accent-primary"></div></div>
            <div className={`transform transition-all duration-700 fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="p-6 rounded-2xl bg-bg-glass backdrop-blur-md border border-border-color shadow-2xl shadow-black/20 group hover:border-accent-primary/50">
                <div className="flex items-center mb-3">
                  {item.showLogo && item.logoUrl && (<img src={item.logoUrl} alt={`${item.company} logo`} className="w-8 h-8 rounded-full mr-3" />)}
                  <div>
                    <p className="text-sm text-accent-primary font-semibold">{item.date}</p>
                    <h3 className="font-bold text-white text-xl">{item.title}</h3>
                  </div>
                </div>
                <h4 className="mb-4 font-semibold text-text-primary">{item.company}</h4>
                <ul className="list-disc list-inside space-y-2 text-text-secondary marker:text-accent-primary">
                  {item.description.map((point: string, i: number) => <li key={i}>{point}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const SkillCircle: React.FC<{level: number; name: string; isVisible: boolean; index: number;}> = ({ level, name, isVisible, index }) => {
  const [progress, setProgress] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setProgress(level), 200 + index * 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, level, index]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle className="skill-circle-track" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
          <circle className="text-accent-primary" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" style={{ transition: 'stroke-dashoffset 1.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{progress}%</span>
      </div>
      <p className="mt-4 text-lg font-semibold text-text-primary text-center">{name}</p>
    </div>
  );
};

const Skills = ({ skillsData }: { skillsData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <Section id="skills" title="Professional" titleAccent="Skills">
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 justify-center">
        {skillsData.filter(item => item.visible ?? true).map((skill, index) => (
          <SkillCircle key={index} level={skill.level} name={skill.name} isVisible={isVisible} index={index} />
        ))}
      </div>
    </Section>
  );
};

const Awards = ({ awardsData }: { awardsData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <Section id="awards" title="Achievements &" titleAccent="Awards">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {awardsData.filter(item => item.visible ?? true).map((award, index) => (
          <div key={award.id} className={`group fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 200}ms` }}>
            <div className={`bg-bg-glass backdrop-blur-md p-8 rounded-2xl border border-border-color shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-accent-secondary/30 hover:-translate-y-2 glow-on-hover`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 mb-4">
                  <AwardIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{award.name}</h3>
                  <p className="text-amber-300 font-semibold mt-1">{award.date}</p>
                  <p className="text-text-secondary mt-3">{award.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Articles = ({ articlesData }: { articlesData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <Section id="articles" title="Articles &" titleAccent="Insights">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesData.filter(item => item.visible ?? true).map((article, index) => (
          <div key={article.id} className={`bg-bg-glass backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-border-color group transition-all duration-500 hover:-translate-y-2 hover:shadow-accent-primary/20 fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.showImage && article.imageUrl && <div className="overflow-hidden h-56"><img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>}
              <div className="p-6">
                <p className="text-sm text-accent-primary font-semibold mb-2">{article.category}</p>
                <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                <p className="text-text-secondary">{article.description}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Projects = ({ projectsData }: { projectsData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  if (!projectsData || projectsData.filter(p => p.visible ?? true).length === 0) return null;
  return (
    <Section id="projects" title="Featured" titleAccent="Projects">
       <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.filter(item => item.visible ?? true).map((project: any, index: number) => (
          <div key={project.id} className={`bg-bg-glass backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-border-color group transition-all duration-500 hover:-translate-y-2 hover:shadow-accent-primary/20 fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="overflow-hidden h-56 relative">
                {project.showImage && project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="py-2 px-4 bg-accent-primary text-black font-semibold rounded-md hover:opacity-80 transition-opacity">Live View</a>}
                      {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="py-2 px-4 bg-slate-700 rounded-md text-white font-semibold hover:bg-slate-600 transition-colors">Source</a>}
                 </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-text-secondary mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (<span key={tag} className="text-xs font-semibold bg-slate-700 text-accent-primary py-1 px-3 rounded-full">{tag}</span>))}
                </div>
              </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Certifications = ({ certificationsData }: { certificationsData: any[] }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  if (!certificationsData || certificationsData.filter(c => c.visible ?? true).length === 0) return null;
  return (
    <Section id="certifications" title="Licenses &" titleAccent="Certifications">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificationsData.filter(item => item.visible ?? true).map((cert: any, index: number) => (
          <div key={cert.id} className={`bg-bg-glass backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-black/20 border border-border-color group transition-all duration-500 hover:-translate-y-2 hover:shadow-accent-primary/20 fade-in-up flex flex-col ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="flex items-start gap-4 flex-grow">
                  {cert.showImage && cert.imageUrl && <img src={cert.imageUrl} alt={cert.name} className="w-16 h-16 object-contain flex-shrink-0"/>}
                  <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                      <p className="text-text-primary font-semibold">{cert.issuer}</p>
                      <p className="text-sm text-text-secondary mt-1">Issued: {cert.date}</p>
                  </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-color flex flex-wrap gap-3">
                 {cert.certificatePdfUrl && (<a href={cert.certificatePdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center btn-accent hover:bg-gradient-to-l font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 transform hover:scale-105">View Certificate</a>)}
                 {cert.credentialUrl && (<a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-white bg-transparent border-2 border-accent-secondary hover:bg-accent-secondary/20 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300">Verify Credential</a>)}
              </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Contact = ({ personalInfo }: { personalInfo: any }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  const [formStatus, setFormStatus] = useState({ status: 'idle', message: '' }); // idle, submitting, success, error
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all fields.");
      return;
    }

    setFormStatus({ status: 'submitting', message: '' });

    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    
    // Using a timeout to allow the mailto link to open before showing the success message
    setTimeout(() => {
        setFormStatus({ 
            status: 'success', 
            message: 'Your default email client has been opened. Please complete and send the message from there. Thank you!' 
        });
    }, 500);
    
    window.location.href = mailtoLink;
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setFormStatus({ status: 'idle', message: '' });
  };

  return (
    <Section id="contact" title="Contact" titleAccent="Me">
      <ThreeJSBackground type="sphere" className="section-3d-bg" />
      <div ref={ref} className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-12 fade-in-up ${isVisible ? 'visible' : ''}`}>
        <div className="flex flex-col justify-center space-y-8">
          <h3 className="text-3xl font-bold text-white font-heading">Let's Connect</h3>
          <p className="text-text-secondary">{personalInfo.contactIntro}</p>
          <div className="space-y-4">
            <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-4 group"><EmailIcon className="w-6 h-6 text-accent-primary group-hover:scale-110 transition-transform"/><span className="text-text-primary group-hover:text-white transition-colors">{personalInfo.email}</span></a>
             <a href={`tel:${personalInfo.phone}`} className="flex items-center space-x-4 group"><PhoneIcon className="w-6 h-6 text-accent-primary group-hover:scale-110 transition-transform"/><span className="text-text-primary group-hover:text-white transition-colors">{personalInfo.phone}</span></a>
             <div className="flex items-center space-x-4"><LocationIcon className="w-6 h-6 text-accent-primary"/><span className="text-text-primary">{personalInfo.location}</span></div>
          </div>
        </div>
        <>
            {formStatus.status === 'idle' || formStatus.status === 'submitting' ? (
               <form onSubmit={handleSubmit}>
                  <div className="relative z-0 w-full mb-6 group">
                     <input type="text" name="name" id="floating_name" value={formData.name} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-accent-primary peer" placeholder=" " required />
                     <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                     <input type="email" name="email" id="floating_email" value={formData.email} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-accent-primary peer" placeholder=" " required />
                     <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                     <textarea name="message" id="floating_message" value={formData.message} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-accent-primary peer min-h-[100px]" placeholder=" " required></textarea>
                     <label htmlFor="floating_message" className="peer-focus:font-medium absolute text-sm text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Your Message</label>
                  </div>
                  <button type="submit" disabled={formStatus.status === 'submitting'} className="btn-accent hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-cyan-300/50 font-bold rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed">
                     {formStatus.status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
               </form>
            ) : formStatus.status === 'success' ? (
               <div className="text-center bg-green-500/10 border border-green-500 text-green-300 p-8 rounded-lg flex flex-col items-center justify-center h-full">
                  <h3 className="text-2xl font-bold mb-4 text-white">Action Required</h3>
                  <p>{formStatus.message}</p>
                  <button onClick={resetForm} className="mt-6 bg-accent-primary text-black font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity">Send Another Message</button>
               </div>
            ) : ( // error
               <div className="text-center bg-red-500/10 border border-red-500 text-red-300 p-8 rounded-lg flex flex-col items-center justify-center h-full">
                  <h3 className="text-2xl font-bold mb-4 text-white">Something went wrong!</h3>
                  <p>{formStatus.message}</p>
                  <button onClick={resetForm} className="mt-6 bg-accent-primary text-black font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity">Try Again</button>
               </div>
            )}
        </>
      </div>
    </Section>
  );
};

const Footer = ({ personalInfo }: { personalInfo: any }) => (
  <footer className="bg-bg-primary border-t border-border-color">
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-text-secondary mb-4 md:mb-0">&copy; {new Date().getFullYear()} {personalInfo.name}. All Rights Reserved.</p>
        <div className="flex space-x-6">
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
          <a href={`mailto:${personalInfo.email}`} className="text-text-secondary hover:text-accent-primary transition-colors"><EmailIcon className="w-6 h-6" /></a>
        </div>
      </div>
      <div className="text-center mt-6"> <a href="#admin" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">Admin Panel</a> </div>
    </div>
  </footer>
);

const Chatbot = ({ portfolioData }: { portfolioData: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: API_KEY ? "Hello! I'm Sairam's AI assistant. Ask me anything about his skills, experience, or the US healthcare industry." : "Hello! I am Sairam's AI assistant, currently in offline mode. For my full capabilities, the site owner needs to configure the Gemini API." }]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!API_KEY) { console.warn("API_KEY not set. AI Chatbot running in offline mode."); return; }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const context = `Name: ${portfolioData.personalInfo.name}; Title: ${portfolioData.personalInfo.title}; Summary: ${portfolioData.personalInfo.summary}; Contact Email: ${portfolioData.personalInfo.email}; Contact Phone: ${portfolioData.personalInfo.phone}; LinkedIn: ${portfolioData.personalInfo.linkedin}; Experience: ${portfolioData.experienceData.map((job: any) => `${job.title} at ${job.company}: ${job.description.join('. ')}`).join('; ')}; Skills: ${portfolioData.skillsData.map((skill: any) => `${skill.name}`).join(', ')};`;
    const systemInstruction = `You are a professional AI assistant for Sairam Mashetty's portfolio. Answer questions about Sairam's background using ONLY the specific context provided. You are also an expert on the US healthcare and insurance claims industry and can answer general questions on these topics. Be friendly, concise, and professional. CONTEXT ABOUT SAIRAM: ${context}`;
    setChat(ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction } }));
  }, [portfolioData]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput = (e.currentTarget.elements.namedItem('message') as HTMLInputElement).value.trim();
    if (!userInput || isLoading) return;
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setIsLoading(true);
    e.currentTarget.reset();
    
    if (!chat) { // API_KEY is not available, run in offline mode
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: "I'm currently running in offline mode. The portfolio owner needs to configure my connection to the Gemini API to enable my full capabilities." }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await chat.sendMessage({ message: userInput });
      setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <div className={`transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="w-80 h-[28rem] bg-bg-glass backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-border-color">
          <header className="flex items-center justify-between p-4 bg-slate-900/50 rounded-t-2xl border-b border-border-color">
            <h3 className="font-bold text-white">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white"><CloseIcon className="w-6 h-6"/></button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0"></div>}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm transition-transform duration-200 hover:scale-105 ${msg.sender === 'user' ? 'bg-accent-secondary text-white rounded-br-none' : 'bg-slate-700 text-text-primary rounded-bl-none'}`}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (<div className="flex items-end gap-2"><div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0"></div><div className="p-3 rounded-2xl bg-slate-700 rounded-bl-none"><div className="flex items-center space-x-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span></div></div></div>)}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border-color flex items-center gap-2">
            <input name="message" type="text" placeholder={API_KEY ? "Ask a question..." : "Ask (offline mode)"} className="w-full bg-slate-700 border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm disabled:cursor-not-allowed" disabled={isLoading} />
            <button type="submit" className="p-2 rounded-full bg-accent-primary text-black hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isLoading}><SendIcon className="w-5 h-5"/></button>
          </form>
        </div>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className={`absolute bottom-0 right-0 p-4 rounded-full bg-gradient-accent text-black shadow-2xl shadow-accent-primary/30 transition-all duration-300 transform hover:scale-110 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} aria-label="Toggle AI Chat">
        <ChatIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

const Admin = () => {
    // --- AUTH & RECOVERY ---
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [recoveryMode, setRecoveryMode] = useState(false);
    const [recoveryAttempt, setRecoveryAttempt] = useState('');
    const [securityData, setSecurityData] = useState(() => loadData('securityData', securityDataDefault));

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') { setIsLoggedIn(true); setError(''); } 
        else { setError('Invalid password'); }
    };
    const handleLogout = () => { setIsLoggedIn(false); setPassword(''); window.location.hash = ''; };

    const handleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        const { recoveryMethod, recoveryPhrase, recoveryQuestion, recoveryAnswer } = securityData;
        let isSuccess = false;
        if (recoveryMethod === 'phrase' && recoveryPhrase && recoveryAttempt === recoveryPhrase) {
          isSuccess = true;
        } else if (recoveryMethod === 'question' && recoveryQuestion && recoveryAnswer && recoveryAttempt.toLowerCase() === recoveryAnswer.toLowerCase()) {
          isSuccess = true;
        }
        
        if(isSuccess) {
            alert(`Password reset successfully. The password is now "admin123". Please log in and change it if desired.`);
            setRecoveryMode(false); setRecoveryAttempt(''); setError('');
        } else {
            setError('Incorrect recovery information.');
        }
    };

    // --- DATA MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('sections');
    const [personalInfo, setPersonalInfo] = useState(() => loadData('personalInfo', personalInfoDefault));
    const [educationData, setEducationData] = useState(() => loadData('educationData', educationDataDefault));
    const [experienceData, setExperienceData] = useState<any[]>(() => loadData('experienceData', experienceDataDefault));
    const [skillsData, setSkillsData] = useState<any[]>(() => loadData('skillsData', skillsDataDefault));
    const [awardsData, setAwardsData] = useState<any[]>(() => loadData('awardsData', awardsDataDefault));
    const [articlesData, setArticlesData] = useState<any[]>(() => loadData('articlesData', articlesDataDefault));
    const [projectsData, setProjectsData] = useState<any[]>(() => loadData('projectsData', projectsDataDefault));
    const [certificationsData, setCertificationsData] = useState<any[]>(() => loadData('certificationsData', certificationsDataDefault));
    const [sections, setSections] = useState<any[]>(() => loadData('sectionsConfig', sectionsDefault));
    const [aiFeaturesConfig, setAiFeaturesConfig] = useState(() => loadData('aiFeaturesConfig', aiFeaturesConfigDefault));

    // --- AI MODAL STATE ---
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiImageData, setAiImageData] = useState<{currentImage: string, onSave: (newImage: string) => void} | null>(null);

    const openAiModal = (currentImage: string | undefined, onSave: (newImage: string) => void) => {
      if (!currentImage) return;
      setAiImageData({ currentImage, onSave });
      setIsAiModalOpen(true);
    };

    // --- GEMINI AI INTEGRATION ---
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingKey, setGeneratingKey] = useState<string | null>(null);
    const handleGenerateAI = async (key: string, promptText: string, currentValue: string, updaterFn: (newText: string) => void) => {
        if (isGenerating || !API_KEY) { return; }
        setIsGenerating(true); setGeneratingKey(key);
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `${promptText}:\n\n"${currentValue}"` });
            updaterFn(response.text.trim().replace(/^"|"$/g, ''));
        } catch (err) { console.error("AI Error:", err); alert("Error generating content."); } 
        finally { setIsGenerating(false); setGeneratingKey(null); }
    };

    const saveData = (key: string, data: any) => { localStorage.setItem(key, JSON.stringify(data)); alert(`${key.replace(/Data|Config/g, '')} saved!`); };
    const handleItemChange = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number, field: string, value: any) => { setter(prev => prev.map((item, i) => i === index ? {...item, [field]: value} : item)); };
    const handleAddItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, newItem: any) => setter(prev => [...prev, {...newItem, id: Date.now(), visible: true }]);
    const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));
    
    const AIGenerateButton = ({ fieldKey, prompt, currentValue, onGenerated }: { fieldKey: string; prompt: string; currentValue: string; onGenerated: (newText: string) => void; }) => (<button type="button" onClick={() => handleGenerateAI(fieldKey, prompt, currentValue, onGenerated)} disabled={isGenerating || !aiFeaturesConfig.aiFeaturesEnabled || !aiFeaturesConfig.contentGenerationEnabled} className="ml-2 p-2 btn-admin btn-admin-accent rounded-md flex items-center text-sm disabled:opacity-50"><MagicWandIcon className="w-4 h-4 mr-2" />{isGenerating && generatingKey === fieldKey ? '...' : 'Enhance'}</button>);
    
    const renderInput = (label: string, value: any, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, type = "text", props = {}) => (<div className="mb-4"><label className="block admin-label text-sm font-bold mb-2">{label}</label><input type={type} value={value} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 admin-input admin-text leading-tight focus:outline-none focus:shadow-outline focus:border-accent-primary" {...props}/></div>);
    const renderTextarea = (label: string, value: any, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, aiOptions: any = null) => (<div className="mb-4"><div className="flex justify-between items-center mb-2"><label className="block admin-label text-sm font-bold">{label}</label>{aiOptions && <AIGenerateButton {...aiOptions} />}</div><textarea value={value} onChange={onChange} rows={5} className="shadow appearance-none border rounded w-full py-2 px-3 admin-input admin-text leading-tight focus:outline-none focus:shadow-outline focus:border-accent-primary min-h-[120px]"/></div>);
    
    const ToggleSwitch: React.FC<{ label?: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; size?: 'sm' | 'md', className?: string }> = ({ label, checked, onChange, size = 'md', className = '' }) => (<div className={`flex items-center justify-between my-2 ${size === 'md' ? 'py-2' : ''} ${className}`}><span className="admin-label font-bold">{label}</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" /><div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-secondary"></div></label></div>);
    const RadioGroup = ({ label, name, options, value, onChange }: {label: string; name: string; options: {value: string; label: string}[]; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => (<div className="mb-4"><label className="block admin-label text-sm font-bold mb-2">{label}</label><div className="flex gap-4">{options.map(opt => (<label key={opt.value} className="flex items-center"><input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} className="w-4 h-4 text-accent-secondary bg-slate-600 border-slate-500 focus:ring-accent-secondary focus:ring-2" /> <span className="ml-2 admin-text">{opt.label}</span></label>))}</div></div>);
    
    const ImageInput = ({ label, imageUrl, onUrlChange, onFileChange, onAiEdit, showImageToggle, isImageShown, onImageToggleChange }: {label: string; imageUrl: string | undefined; onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onAiEdit: () => void; showImageToggle: boolean; isImageShown: boolean; onImageToggleChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
      return (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
              <label className="block admin-label text-sm font-bold">{label}</label>
              {showImageToggle && (
                  <div className="flex items-center">
                      <span className="text-xs mr-2 admin-label">Show Image</span>
                      <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={isImageShown} onChange={onImageToggleChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-secondary"></div></label>
                  </div>
              )}
          </div>
          <div className="flex items-center gap-4">
            {imageUrl && <img src={imageUrl} alt="preview" className="w-20 h-20 rounded-md object-cover bg-slate-800" />}
            <div className="flex-1">
              <input type="text" value={imageUrl || ''} onChange={onUrlChange} placeholder="Paste image URL" className="shadow appearance-none border rounded w-full py-2 px-3 admin-input admin-text leading-tight focus:outline-none focus:shadow-outline focus:border-accent-primary mb-2"/>
              <div className="flex items-center gap-2">
                <label className="flex-1 text-center cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                  Upload File
                  <input type="file" accept="image/*" className="hidden" onChange={onFileChange}/>
                </label>
                <button type="button" onClick={onAiEdit} disabled={!aiFeaturesConfig.aiFeaturesEnabled || !aiFeaturesConfig.imageEditingEnabled} className="p-2 bg-gradient-accent rounded-md text-black disabled:opacity-50 flex items-center text-sm"><MagicWandIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const AIImageEditModal = ({ isOpen, onClose, imageData, onSave }: {isOpen: boolean; onClose: () => void; imageData: {currentImage: string, onSave: (newImage: string) => void} | null; onSave: (newImage: string) => void}) => {
      const [prompt, setPrompt] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [editedImage, setEditedImage] = useState<string | null>(null);
      
      useEffect(() => {
          if(isOpen && imageData) {
              setEditedImage(imageData.currentImage);
              setPrompt('');
          }
      }, [isOpen, imageData]);

      const handleGenerate = async () => {
        if (!prompt || !API_KEY || !editedImage) return; 
        setIsLoading(true);
        try {
          const ai = new GoogleGenAI({ apiKey: API_KEY });
          const [header, base64Data] = editedImage.split(',');
          const mimeType = header.match(/:(.*?);/)![1];
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
            config: { responseModalities: [Modality.IMAGE] },
          });
          
          const newImagePart = response.candidates[0].content.parts.find(p => p.inlineData);
          if (newImagePart && newImagePart.inlineData) {
            const newBase64 = newImagePart.inlineData.data;
            const newMimeType = newImagePart.inlineData.mimeType;
            setEditedImage(`data:${newMimeType};base64,${newBase64}`);
          }
        } catch (err) {
          console.error("AI Image Edit Error:", err);
          alert("Failed to edit image with AI. Check console for details.");
        } finally {
          setIsLoading(false);
        }
      };
      
      const handleSave = () => { if (editedImage) onSave(editedImage); onClose(); };

      if (!isOpen || !imageData) return null;
      return (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
          <div className="bg-bg-secondary w-full max-w-2xl rounded-lg border border-border-color p-6 shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><CloseIcon className="w-6 h-6"/></button>
            <h2 className="text-2xl font-bold mb-4 font-heading text-white">Edit Image with AI</h2>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square bg-slate-800 rounded-md flex items-center justify-center">
                  <img src={editedImage!} alt="Image to edit" className="max-w-full max-h-full rounded-md object-contain"/>
                  {isLoading && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><div className="loader-shape !w-12 !h-12"></div></div>}
              </div>
              <div className="flex flex-col h-full">
                  {renderTextarea("Edit Prompt", prompt, e => setPrompt(e.target.value))}
                  <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full btn-admin btn-admin-primary flex items-center justify-center gap-2">
                      <MagicWandIcon className="w-5 h-5"/>
                      {isLoading ? 'Generating...' : 'Generate Image'}
                  </button>
                  <p className="text-xs text-slate-400 mt-2 text-center">Describe the changes you want to make.</p>
                  <div className="mt-auto pt-4 flex gap-4">
                     <button onClick={onClose} className="flex-1 btn-admin btn-admin-secondary">Cancel</button>
                     <button onClick={handleSave} className="flex-1 btn-admin btn-admin-accent">Save Image</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      );
    };


    if (!isLoggedIn) {
      return (
          <div className="min-h-screen bg-bg-primary flex items-center justify-center">
              <div className="max-w-sm w-full bg-bg-secondary p-8 rounded-2xl shadow-2xl shadow-black/30 border border-border-color">
                  <h2 className="text-3xl font-bold text-center text-white mb-8 font-heading">{recoveryMode ? "Password Recovery" : "Admin Login"}</h2>
                  {recoveryMode ? (
                       <form onSubmit={handleRecovery}>
                          {securityData.recoveryMethod === 'question' && <p className="text-slate-300 mb-2 text-sm">Q: {securityData.recoveryQuestion}</p>}
                          {renderInput(securityData.recoveryMethod === 'phrase' ? 'Recovery Phrase' : 'Your Answer', recoveryAttempt, (e) => setRecoveryAttempt(e.target.value))}
                          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                          <button className="btn-accent hover:bg-gradient-to-l font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300" type="submit">Reset Password</button>
                          <button type="button" onClick={() => { setRecoveryMode(false); setError(''); }} className="text-center w-full mt-4 text-sm text-text-secondary hover:text-white">Back to Login</button>
                       </form>
                  ) : (
                       <form onSubmit={handleLogin}>
                          {renderInput("Password", password, (e) => setPassword(e.target.value), "password")}
                          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                          <button className="btn-accent hover:bg-gradient-to-l font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300" type="submit">Sign In</button>
                          <button type="button" onClick={() => { setRecoveryMode(true); setError(''); }} className="text-center w-full mt-4 text-sm text-text-secondary hover:text-white">Forgot Password?</button>
                      </form>
                  )}
              </div>
          </div>
      );
    }
    
    const tabs = [ { id: 'sections', label: 'Manage Sections' }, { id: 'personal', label: 'Personal Info' }, { id: 'experience', label: 'Experience' }, { id: 'skills', label: 'Skills' }, { id: 'awards', label: 'Awards' }, { id: 'projects', label: 'Projects' }, { id: 'certifications', label: 'Certifications' }, { id: 'articles', label: 'Articles' }, { id: 'settings', label: 'Settings' }];
    return (
      <>
        <AIImageEditModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} imageData={aiImageData} onSave={aiImageData?.onSave as (newImage: string) => void} />
        <div className="min-h-screen admin-panel admin-text flex">
            <aside className="w-64 admin-sidebar p-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-8 text-center bg-gradient-accent text-gradient font-heading">Admin Panel</h1>
                <nav className="flex flex-col space-y-2">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-2 rounded-md text-left transition-colors ${activeTab === tab.id ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-slate-700'}`}>{tab.label}</button>))}</nav>
                <div className="mt-auto">
                     <button onClick={() => window.location.hash = ''} className="w-full btn-admin btn-admin-secondary mb-2">View Portfolio</button>
                    <button onClick={handleLogout} className="w-full btn-admin btn-admin-danger">Logout</button>
                </div>
            </aside>
            <main className="flex-grow p-8 overflow-y-auto">
              {!API_KEY && aiFeaturesConfig.aiFeaturesEnabled && (
                <div className="bg-amber-500/10 border border-amber-500 text-amber-300 p-4 rounded-lg mb-6 text-sm">
                    <p className="font-bold">AI Features Disabled</p>
                    <p>To enable AI-powered content generation and image editing, please set your <code className="bg-black/30 px-1 rounded-sm">API_KEY</code> in the deployment environment variables of your hosting provider (e.g., Netlify, Vercel). You can turn off this message in Settings.</p>
                </div>
              )}
              {activeTab === 'sections' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-2 font-heading admin-text">Manage Page Sections</h2>
                      <p className="text-slate-400 mb-6">Use the toggles to show or hide sections on your portfolio.</p>
                      <div className="admin-card p-6 rounded-lg">
                          {sections.map(section => (
                              <ToggleSwitch
                                  key={section.id}
                                  label={section.title}
                                  checked={section.visible}
                                  onChange={() => setSections(prev => prev.map(s => s.id === section.id ? {...s, visible: !s.visible} : s))}
                                  className="border-b border-t border-border-color"
                              />
                          ))}
                      </div>
                      <button onClick={() => saveData('sectionsConfig', sections)} className="mt-6 btn-admin btn-admin-primary">Save Section Visibility</button>
                  </div>
              )}
              {activeTab === 'personal' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Personal & Education Info</h2>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="admin-card p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 text-accent-primary">Personal Details</h3>
                            {renderInput("Name", personalInfo.name, e => setPersonalInfo({...personalInfo, name: e.target.value}))}
                            {renderInput("Title", personalInfo.title, e => setPersonalInfo({...personalInfo, title: e.target.value}))}
                            {renderInput("Email", personalInfo.email, e => setPersonalInfo({...personalInfo, email: e.target.value}), "email")}
                            {renderInput("Phone", personalInfo.phone, e => setPersonalInfo({...personalInfo, phone: e.target.value}), "tel")}
                            {renderInput("Location", personalInfo.location, e => setPersonalInfo({...personalInfo, location: e.target.value}))}
                            {renderInput("LinkedIn URL", personalInfo.linkedin, e => setPersonalInfo({...personalInfo, linkedin: e.target.value}), "url")}
                            <ImageInput label="Profile Image" imageUrl={personalInfo.profileImageUrl} onUrlChange={e => setPersonalInfo({...personalInfo, profileImageUrl: e.target.value})} onFileChange={async e => setPersonalInfo({...personalInfo, profileImageUrl: await fileToBase64(e.target.files![0]) as string})} onAiEdit={() => openAiModal(personalInfo.profileImageUrl, (newImg) => setPersonalInfo({...personalInfo, profileImageUrl: newImg}))} showImageToggle={true} isImageShown={!!personalInfo.showProfileImage} onImageToggleChange={e => setPersonalInfo({...personalInfo, showProfileImage: e.target.checked})} />
                            {renderInput("CV URL", personalInfo.cvUrl, e => setPersonalInfo({...personalInfo, cvUrl: e.target.value}))}
                            <ToggleSwitch label="Show CV Download Button" checked={!!personalInfo.showCvButton} onChange={e => setPersonalInfo({...personalInfo, showCvButton: e.target.checked})} />
                            {renderTextarea("Summary", personalInfo.summary, e => setPersonalInfo({...personalInfo, summary: e.target.value}), { fieldKey: 'summary', prompt: "Rewrite this summary for a Claims Associate's portfolio.", currentValue: personalInfo.summary, onGenerated: (newText: string) => setPersonalInfo({...personalInfo, summary: newText})})}
                            {renderTextarea("Contact Intro", personalInfo.contactIntro, e => setPersonalInfo({...personalInfo, contactIntro: e.target.value}), { fieldKey: 'contactIntro', prompt: "Rewrite this contact section intro text.", currentValue: personalInfo.contactIntro, onGenerated: (newText: string) => setPersonalInfo({...personalInfo, contactIntro: newText})})}
                            
                            <div className="mt-6 pt-6 border-t border-border-color">
                              <h3 className="text-xl font-semibold mb-4 text-accent-primary">Contact Form Notifications</h3>
                              <RadioGroup
                                label="Receive notifications via:"
                                name="notificationMethod"
                                value={personalInfo.notificationMethod || 'email'}
                                onChange={e => setPersonalInfo({...personalInfo, notificationMethod: e.target.value})}
                                options={[{label: 'Email (via mailto:)', value: 'email'}]}
                              />
                            </div>
                            
                            <button onClick={() => saveData('personalInfo', personalInfo)} className="mt-4 btn-admin btn-admin-primary">Save Personal</button>
                        </div>
                        <div className="admin-card p-6 rounded-lg">
                          <h3 className="text-xl font-semibold mb-4 text-accent-primary">Education</h3>
                          {renderInput("Degree", educationData.degree, e => setEducationData({...educationData, degree: e.target.value}))}
                          {renderInput("Institution", educationData.institution, e => setEducationData({...educationData, institution: e.target.value}))}
                          {renderInput("Duration", educationData.duration, e => setEducationData({...educationData, duration: e.target.value}))}
                          {renderInput("GPA", educationData.gpa, e => setEducationData({...educationData, gpa: e.target.value}))}
                          <ImageInput label="Education Image" imageUrl={personalInfo.educationImageUrl} onUrlChange={e => setPersonalInfo({...personalInfo, educationImageUrl: e.target.value})} onFileChange={async e => setPersonalInfo({...personalInfo, educationImageUrl: await fileToBase64(e.target.files![0]) as string})} onAiEdit={() => openAiModal(personalInfo.educationImageUrl, (newImg) => setPersonalInfo({...personalInfo, educationImageUrl: newImg}))} showImageToggle={true} isImageShown={!!personalInfo.showEducationImage} onImageToggleChange={e => setPersonalInfo({...personalInfo, showEducationImage: e.target.checked})} />
                          <button onClick={() => { saveData('educationData', educationData); saveData('personalInfo', personalInfo); }} className="mt-4 btn-admin btn-admin-primary">Save Education</button>
                        </div>
                      </div>
                  </div>
              )}
              {activeTab === 'experience' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Experience</h2>
                      <div className="space-y-6">
                          {experienceData.map((item, index) => (
                              <div key={item.id || index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Item #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setExperienceData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setExperienceData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  {renderInput(`Date`, item.date, e => handleItemChange(setExperienceData, index, 'date', e.target.value))}
                                  {renderInput(`Title`, item.title, e => handleItemChange(setExperienceData, index, 'title', e.target.value))}
                                  {renderInput(`Company`, item.company, e => handleItemChange(setExperienceData, index, 'company', e.target.value))}
                                  <ImageInput label="Company Logo" imageUrl={item.logoUrl} onUrlChange={e => handleItemChange(setExperienceData, index, 'logoUrl', e.target.value)} onFileChange={async e => handleItemChange(setExperienceData, index, 'logoUrl', await fileToBase64(e.target.files![0]) as string)} onAiEdit={() => openAiModal(item.logoUrl, (newImg) => handleItemChange(setExperienceData, index, 'logoUrl', newImg))} showImageToggle={true} isImageShown={!!item.showLogo} onImageToggleChange={e => handleItemChange(setExperienceData, index, 'showLogo', e.target.checked)} />
                                  {renderTextarea(`Description (one point per line)`, Array.isArray(item.description) ? item.description.join('\n') : '', e => handleItemChange(setExperienceData, index, 'description', e.target.value.split('\n')))}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setExperienceData, { date: '', title: '', company: '', logoUrl: '', showLogo: true, description: [] })} className="mt-6 btn-admin btn-admin-success">Add Experience</button>
                      <button onClick={() => saveData('experienceData', experienceData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Experience</button>
                  </div>
              )}
               {activeTab === 'skills' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Skills</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {skillsData.map((item, index) => (
                              <div key={index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Skill #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setSkillsData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setSkillsData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  {renderInput(`Name`, item.name, e => handleItemChange(setSkillsData, index, 'name', e.target.value))}
                                  {renderInput(`Level (0-100)`, item.level, e => handleItemChange(setSkillsData, index, 'level', e.target.value), 'number', {min: 0, max: 100})}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setSkillsData, { name: '', level: 80 })} className="mt-6 btn-admin btn-admin-success">Add Skill</button>
                      <button onClick={() => saveData('skillsData', skillsData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Skills</button>
                  </div>
              )}
              {activeTab === 'awards' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Awards</h2>
                      <div className="space-y-6">
                          {awardsData.map((item, index) => (
                              <div key={item.id || index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Award #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setAwardsData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setAwardsData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  {renderInput(`Name`, item.name, e => handleItemChange(setAwardsData, index, 'name', e.target.value))}
                                  {renderInput(`Date`, item.date, e => handleItemChange(setAwardsData, index, 'date', e.target.value))}
                                  {renderTextarea(`Description`, item.description, e => handleItemChange(setAwardsData, index, 'description', e.target.value))}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setAwardsData, { name: '', date: '', description: '' })} className="mt-6 btn-admin btn-admin-success">Add Award</button>
                      <button onClick={() => saveData('awardsData', awardsData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Awards</button>
                  </div>
              )}
              {activeTab === 'projects' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Projects</h2>
                      <div className="space-y-6">
                          {projectsData.map((item, index) => (
                              <div key={item.id || index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Project #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setProjectsData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setProjectsData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  {renderInput(`Title`, item.title, e => handleItemChange(setProjectsData, index, 'title', e.target.value))}
                                  <ImageInput label="Project Image" imageUrl={item.imageUrl} onUrlChange={e => handleItemChange(setProjectsData, index, 'imageUrl', e.target.value)} onFileChange={async e => handleItemChange(setProjectsData, index, 'imageUrl', await fileToBase64(e.target.files![0]) as string)} onAiEdit={() => openAiModal(item.imageUrl, (newImg) => handleItemChange(setProjectsData, index, 'imageUrl', newImg))} showImageToggle={true} isImageShown={!!item.showImage} onImageToggleChange={e => handleItemChange(setProjectsData, index, 'showImage', e.target.checked)} />
                                  {renderInput(`Live URL`, item.liveUrl, e => handleItemChange(setProjectsData, index, 'liveUrl', e.target.value))}
                                  {renderInput(`Source URL`, item.sourceUrl, e => handleItemChange(setProjectsData, index, 'sourceUrl', e.target.value))}
                                  {renderTextarea(`Description`, item.description, e => handleItemChange(setProjectsData, index, 'description', e.target.value))}
                                  {renderInput(`Tags (comma separated)`, Array.isArray(item.tags) ? item.tags.join(', ') : '', e => handleItemChange(setProjectsData, index, 'tags', e.target.value.split(',').map(t=>t.trim())))}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setProjectsData, { title: '', imageUrl: 'https://picsum.photos/seed/new-project/600/400', showImage: true, description: '', tags: [], liveUrl: '', sourceUrl: '' })} className="mt-6 btn-admin btn-admin-success">Add Project</button>
                      <button onClick={() => saveData('projectsData', projectsData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Projects</button>
                  </div>
              )}
              {activeTab === 'certifications' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Certifications</h2>
                       <div className="space-y-6">
                          {certificationsData.map((item, index) => (
                              <div key={item.id || index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Certification #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setCertificationsData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setCertificationsData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  {renderInput(`Name`, item.name, e => handleItemChange(setCertificationsData, index, 'name', e.target.value))}
                                  {renderInput(`Issuer`, item.issuer, e => handleItemChange(setCertificationsData, index, 'issuer', e.target.value))}
                                  {renderInput(`Date`, item.date, e => handleItemChange(setCertificationsData, index, 'date', e.target.value))}
                                  {renderInput(`Credential URL`, item.credentialUrl, e => handleItemChange(setCertificationsData, index, 'credentialUrl', e.target.value))}
                                  <ImageInput label="Certification/Logo Image" imageUrl={item.imageUrl} onUrlChange={e => handleItemChange(setCertificationsData, index, 'imageUrl', e.target.value)} onFileChange={async e => handleItemChange(setCertificationsData, index, 'imageUrl', await fileToBase64(e.target.files![0]) as string)} onAiEdit={() => openAiModal(item.imageUrl, (newImg) => handleItemChange(setCertificationsData, index, 'imageUrl', newImg))} showImageToggle={true} isImageShown={!!item.showImage} onImageToggleChange={e => handleItemChange(setCertificationsData, index, 'showImage', e.target.checked)} />
                                  <div className="mb-4">
                                      <label className="block admin-label text-sm font-bold mb-2">Certificate PDF</label>
                                      <div className="flex items-center gap-4">
                                          <label className="flex-1 text-center cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                                              {item.certificatePdfUrl ? 'Replace PDF' : 'Upload PDF'}
                                              <input type="file" accept=".pdf" className="hidden" onChange={async e => {
                                                  if (e.target.files && e.target.files[0]) {
                                                      handleItemChange(setCertificationsData, index, 'certificatePdfUrl', await fileToBase64(e.target.files[0]) as string)
                                                  }
                                              }}/>
                                          </label>
                                          {item.certificatePdfUrl && <a href={item.certificatePdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-primary hover:underline">View Current</a>}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setCertificationsData, { name: '', issuer: '', date: '', credentialUrl: '', certificatePdfUrl: '', imageUrl: '', showImage: true })} className="mt-6 btn-admin btn-admin-success">Add Certification</button>
                      <button onClick={() => saveData('certificationsData', certificationsData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Certifications</button>
                  </div>
              )}
              {activeTab === 'articles' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 font-heading admin-text">Edit Articles</h2>
                       <div className="space-y-6">
                          {articlesData.map((item, index) => (
                              <div key={item.id || index} className="admin-card p-6 rounded-lg relative">
                                  <div className="admin-card-header pb-2 mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-accent-primary">Article #{index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                      <ToggleSwitch checked={!!item.visible} onChange={e => handleItemChange(setArticlesData, index, 'visible', e.target.checked)} size="sm" />
                                      <button onClick={() => handleRemoveItem(setArticlesData, index)} className="btn-admin-close"><CloseIcon className="w-6 h-6" /></button>
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                      <div className="flex justify-between items-center mb-2">
                                          <label className="block admin-label text-sm font-bold">Title</label>
                                          <AIGenerateButton fieldKey={`article_title_${index}`} prompt="Rewrite this title for an article about technology and insurance." currentValue={item.title} onGenerated={(newText) => handleItemChange(setArticlesData, index, 'title', newText)} />
                                      </div>
                                      <input type="text" value={item.title} onChange={e => handleItemChange(setArticlesData, index, 'title', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 admin-input admin-text leading-tight focus:outline-none focus:shadow-outline focus:border-accent-primary" />
                                  </div>
                                  {renderInput(`Category`, item.category, e => handleItemChange(setArticlesData, index, 'category', e.target.value))}
                                  <ImageInput label="Article Image" imageUrl={item.imageUrl} onUrlChange={e => handleItemChange(setArticlesData, index, 'imageUrl', e.target.value)} onFileChange={async e => handleItemChange(setArticlesData, index, 'imageUrl', await fileToBase64(e.target.files![0]) as string)} onAiEdit={() => openAiModal(item.imageUrl, (newImg) => handleItemChange(setArticlesData, index, 'imageUrl', newImg))} showImageToggle={true} isImageShown={!!item.showImage} onImageToggleChange={e => handleItemChange(setArticlesData, index, 'showImage', e.target.checked)} />
                                  {renderInput(`Link`, item.link, e => handleItemChange(setArticlesData, index, 'link', e.target.value))}
                                  {renderTextarea(`Description`, item.description, e => handleItemChange(setArticlesData, index, 'description', e.target.value), { fieldKey: `article_desc_${index}`, prompt: "Rewrite this article description to be more engaging.", currentValue: item.description, onGenerated: (newText: string) => handleItemChange(setArticlesData, index, 'description', newText) })}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => handleAddItem(setArticlesData, { title: '', description: '', imageUrl: 'https://picsum.photos/seed/new-article/600/400', showImage: true, category: '', link: '#' })} className="mt-6 btn-admin btn-admin-success">Add Article</button>
                      <button onClick={() => saveData('articlesData', articlesData)} className="mt-6 ml-4 btn-admin btn-admin-primary">Save Articles</button>
                  </div>
              )}
              {activeTab === 'settings' && (
                  <div>
                      <h2 className="text-3xl font-bold mb-2 font-heading admin-text">Settings</h2>
                      <p className="text-slate-400 mb-6">Manage your password recovery method and AI feature preferences.</p>
                      <div className="admin-card p-6 rounded-lg mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-accent-primary">Password Recovery</h3>
                        <RadioGroup
                          label="Recovery Method"
                          name="recoveryMethod"
                          value={securityData.recoveryMethod || 'phrase'}
                          onChange={e => setSecurityData(prev => ({ ...prev, recoveryMethod: e.target.value }))}
                          options={[{label: 'Secret Phrase', value: 'phrase'}, {label: 'Security Question', value: 'question'}]}
                        />
                        {securityData.recoveryMethod === 'phrase' ? (
                          <>
                            {renderInput("Recovery Phrase", securityData.recoveryPhrase, e => setSecurityData({...securityData, recoveryPhrase: e.target.value}))}
                            <p className="text-xs text-amber-400 mt-2">Enter a secret phrase only you know.</p>
                          </>
                        ) : (
                          <>
                            <div className="mb-4">
                              <label className="block admin-label text-sm font-bold mb-2">Security Question</label>
                              <select value={securityData.recoveryQuestion} onChange={e => setSecurityData({...securityData, recoveryQuestion: e.target.value})} className="shadow appearance-none border rounded w-full py-2 px-3 admin-input admin-text leading-tight focus:outline-none focus:shadow-outline focus:border-accent-primary">
                                <option value="">-- Select a Question --</option>
                                {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                              </select>
                            </div>
                            {renderInput("Your Answer", securityData.recoveryAnswer, e => setSecurityData({...securityData, recoveryAnswer: e.target.value}))}
                          </>
                        )}
                        <button onClick={() => saveData('securityData', securityData)} className="mt-6 btn-admin btn-admin-primary">Save Recovery Settings</button>
                      </div>

                      <div className="admin-card p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-accent-primary">AI Features</h3>
                        <ToggleSwitch
                          label="Enable All AI Features"
                          checked={!!aiFeaturesConfig.aiFeaturesEnabled}
                          onChange={e => setAiFeaturesConfig(prev => ({ ...prev, aiFeaturesEnabled: e.target.checked }))}
                          className="border-b border-t border-border-color"
                        />
                        {aiFeaturesConfig.aiFeaturesEnabled && (
                            <div className="pl-6 pt-2">
                                <ToggleSwitch
                                  label="Enable Chatbot"
                                  checked={!!aiFeaturesConfig.showChatbot}
                                  onChange={e => setAiFeaturesConfig(prev => ({ ...prev, showChatbot: e.target.checked }))}
                                   className="border-b border-border-color"
                                />
                                <ToggleSwitch
                                  label="Enable AI Content Generation"
                                  checked={!!aiFeaturesConfig.contentGenerationEnabled}
                                  onChange={e => setAiFeaturesConfig(prev => ({ ...prev, contentGenerationEnabled: e.target.checked }))}
                                   className="border-b border-border-color"
                                />
                                <ToggleSwitch
                                  label="Enable AI Image Editing"
                                  checked={!!aiFeaturesConfig.imageEditingEnabled}
                                  onChange={e => setAiFeaturesConfig(prev => ({ ...prev, imageEditingEnabled: e.target.checked }))}
                                   className="border-b border-border-color"
                                />
                            </div>
                        )}
                        <button onClick={() => saveData('aiFeaturesConfig', aiFeaturesConfig)} className="mt-6 btn-admin btn-admin-primary">Save AI Settings</button>
                      </div>
                  </div>
              )}
            </main>
        </div>
      </>
    );
};

const App = () => {
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Load all data into state
  const [personalInfo] = useState(() => loadData('personalInfo', personalInfoDefault));
  const [educationData] = useState(() => loadData('educationData', educationDataDefault));
  const [experienceData] = useState<any[]>(() => loadData('experienceData', experienceDataDefault));
  const [skillsData] = useState<any[]>(() => loadData('skillsData', skillsDataDefault));
  const [awardsData] = useState<any[]>(() => loadData('awardsData', awardsDataDefault));
  const [articlesData] = useState<any[]>(() => loadData('articlesData', articlesDataDefault));
  const [projectsData] = useState<any[]>(() => loadData('projectsData', projectsDataDefault));
  const [certificationsData] = useState<any[]>(() => loadData('certificationsData', certificationsDataDefault));
  const [sections] = useState<any[]>(() => loadData('sectionsConfig', sectionsDefault));
  const [aiFeaturesConfig] = useState(() => loadData('aiFeaturesConfig', aiFeaturesConfigDefault));

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light-theme scroll-smooth' : 'scroll-smooth';
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Initial check

    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('loaded');
      }
    }, 1000);

    return () => window.removeEventListener('hashchange', handleHashChange, false);
  }, []);

  if (isAdminView) {
    return <Admin />;
  }

  const visibleSections = new Set(sections.filter(s => s.visible).map(s => s.id));

  return (
    <>
      <Header personalInfo={personalInfo} navLinks={navLinksDefault} theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero personalInfo={personalInfo} />
        {visibleSections.has('about') && <About personalInfo={personalInfo} educationData={educationData} />}
        {visibleSections.has('experience') && <Experience experienceData={experienceData} />}
        {visibleSections.has('skills') && <Skills skillsData={skillsData} />}
        {visibleSections.has('awards') && <Awards awardsData={awardsData} />}
        {visibleSections.has('projects') && <Projects projectsData={projectsData} />}
        {visibleSections.has('certifications') && <Certifications certificationsData={certificationsData} />}
        {visibleSections.has('articles') && <Articles articlesData={articlesData} />}
        {visibleSections.has('contact') && <Contact personalInfo={personalInfo} />}
      </main>
      <Footer personalInfo={personalInfo} />
      {aiFeaturesConfig.aiFeaturesEnabled && aiFeaturesConfig.showChatbot && <Chatbot portfolioData={{ personalInfo, experienceData, skillsData }} />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
