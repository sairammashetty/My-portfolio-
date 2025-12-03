
import {
  ExperienceItem,
  SkillItem,
  AwardItem,
  NavItem,
  ArticleItem,
  ProjectItem,
  CertificationItem,
  SectionConfig
} from './types';

// --- LOCAL STORAGE HELPER ---
const loadData = (key: string, defaultValue: any) => {
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (key === 'sectionsConfig' && Array.isArray(parsedData) && parsedData.length === 0) {
        return defaultValue;
      }
      return parsedData;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
  }
  return defaultValue;
};


// --- PERSONAL & EDUCATION INFO ---
export const personalInfo = loadData('personalInfo', {
  name: 'Sairam Mashetty',
  title: 'Associate Claims',
  summary: `An experienced Claims Associate with a dedication to efficiently managing and processing insurance claims. Skilled in navigating complex claims systems and maintaining precise records, I am committed to ongoing learning and staying abreast of industry regulations. I am eager to leverage my expertise to help the team achieve its objectives and drive success.`,
  email: 'sairammashetty@gmail.com',
  phone: '+91 9381094860',
  location: 'Hyderabad, Telangana, India.',
  linkedin: 'https://www.linkedin.com/in/sairam-mashetty',
  profileImageUrl: 'https://i.imgur.com/62GgIIL.png',
  resumeUrl: '', // User must update this in Admin Panel
});

export const educationData = loadData('educationData', {
    degree: 'Bachelor of Commerce (Computers)',
    institution: 'Sri Vijaya Sai Degree College, Telangana University',
    duration: '2018 - 2021',
    gpa: '8.6'
});


// --- NAVIGATION & SECTION VISIBILITY ---
export const navLinks: NavItem[] = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Awards', href: '#awards' },
  { name: 'Contact', href: '#contact' },
];

export const sections: SectionConfig[] = loadData('sectionsConfig', [
    { id: 'about', title: 'About', visible: true },
    { id: 'experience', title: 'Experience', visible: true },
    { id: 'skills', title: 'Skills', visible: true },
    { id: 'awards', title: 'Awards', visible: true },
    { id: 'projects', title: 'Projects', visible: false },
    { id: 'certifications', title: 'Certifications', visible: true },
    { id: 'articles', title: 'Articles', visible: true },
    { id: 'contact', title: 'Contact', visible: true },
]);


// --- PORTFOLIO CONTENT ---
export const experienceData: ExperienceItem[] = loadData('experienceData', [
  {
    date: '09/2022 - Present',
    title: 'Associate Claims (Accumulators)',
    company: 'Carelon Global Solutions',
    logoUrl: 'https://i.imgur.com/eQ7DNfR.png',
    description: [
      'Conducted thorough investigations into member enrollments to verify accuracy of details like names, DOB, and insurance types.',
      'Identified and investigated claims lacking coverage, denying them with appropriate documentation to ensure only valid claims were processed.',
      'Analyzed deductible and out-of-pocket buckets to identify and investigate discrepancies, including duplicate claims and invalid transactions.',
      'Performed detailed statistical and supplemental adjustments to claims, correcting inaccuracies and ensuring precise claim processing.',
      'Tracked patient healthcare expenses against deductibles and out-of-pocket maximums, adjusting over-applied claims.',
      'Monitored insurance coverage limits to ensure patients utilized the maximum benefits available in their plans.',
    ],
  },
]);

export const skillsData: SkillItem[] = loadData('skillsData', [
  { name: 'Claims Processing', level: 95 },
  { name: 'MS Office', level: 90 },
  { name: 'Medical Terminology', level: 85 },
  { name: 'Regulatory Compliance', level: 88 },
  { name: 'Attention to Detail', level: 98 },
  { name: 'Communication', level: 92 },
  { name: 'Time Management', level: 90 },
]);

export const awardsData: AwardItem[] = loadData('awardsData', [
  {
    name: 'Impact Award',
    date: 'September 2024',
    description: 'Recognized with the Impact Award for consistently delivering outstanding performance and exceeding expectations.',
  },
  {
    name: 'Impact Award',
    date: 'January 2024',
    description: 'Honored for exceptional contributions and a proactive approach to resolving complex claim discrepancies.',
  },
  {
    name: 'Impact Award',
    date: 'March 2023',
    description: 'Awarded for meticulous investigation skills and a commitment to ensuring accuracy in claims processing.',
  },
]);

// Real, active links for Articles
export const articlesData: ArticleItem[] = loadData('articlesData', [
    {
        title: 'The Future of Claims Processing',
        description: 'How automation and AI are transforming the insurance claims landscape to improve efficiency and accuracy.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        category: 'Insurtech',
        link: 'https://www.mckinsey.com/industries/financial-services/our-insights/claims-2030-dream-or-reality',
    },
    {
        title: 'HIPAA Compliance Essentials',
        description: 'Key considerations for healthcare professionals regarding patient data privacy and regulatory compliance.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        category: 'Compliance',
        link: 'https://www.hhs.gov/hipaa/for-professionals/index.html',
    },
    {
        title: 'Mastering Medical Terminology',
        description: 'Why precise language matters in healthcare and insurance claims, and how to improve your vocabulary.',
        imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
        category: 'Education',
        link: 'https://www.coursera.org/articles/medical-terminology',
    }
]);

export const projectsData: ProjectItem[] = loadData('projectsData', []);

export const certificationsData: CertificationItem[] = loadData('certificationsData', []);
