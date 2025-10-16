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
// This function attempts to load data from localStorage, falling back to the default if it doesn't exist.
const loadData = (key: string, defaultValue: any) => {
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData);
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
  profileImageUrl: 'https://i.imgur.com/62GgIIL.png', // A professional-looking placeholder
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
    { id: 'projects', title: 'Projects', visible: false }, // Initially hidden
    { id: 'certifications', title: 'Certifications', visible: false }, // Initially hidden
    { id: 'articles', title: 'Articles', visible: true },
    { id: 'contact', title: 'Contact', visible: true },
]);


// --- PORTFOLIO CONTENT ---
export const experienceData: ExperienceItem[] = loadData('experienceData', [
  {
    date: '09/2022 - Present',
    title: 'Associate Claims (Accumulators)',
    company: 'Carelon Global Solutions',
    logoUrl: 'https://i.imgur.com/eQ7DNfR.png', // Placeholder logo
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

// Note: Articles, Projects, and Certifications have placeholder data as they were not on the resume.
// This content can be easily updated in the Admin Panel.
export const articlesData: ArticleItem[] = loadData('articlesData', [
    {
        title: 'The Future of Claims Processing',
        description: 'An insight into how AI and automation are revolutionizing the insurance claims industry.',
        imageUrl: 'https://picsum.photos/seed/claims-future/600/400',
        category: 'Insurtech',
        link: '#',
    },
    {
        title: 'Navigating Regulatory Changes in Healthcare',
        description: 'A breakdown of recent regulatory updates and their impact on claims associates.',
        imageUrl: 'https://picsum.photos/seed/healthcare-regs/600/400',
        category: 'Compliance',
        link: '#',
    },
    {
        title: 'Data Accuracy: The Cornerstone of Insurance',
        description: 'Exploring the critical importance of data integrity in preventing claim denials and ensuring customer satisfaction.',
        imageUrl: 'https://picsum.photos/seed/data-accuracy/600/400',
        category: 'Best Practices',
        link: '#',
    }
]);

export const projectsData: ProjectItem[] = loadData('projectsData', []);

export const certificationsData: CertificationItem[] = loadData('certificationsData', []);
