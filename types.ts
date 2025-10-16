export interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  logoUrl?: string;
  description: string[];
}

export interface SkillItem {
  name: string;
  level: number; // Percentage from 0 to 100
}

export interface AwardItem {
  name: string;
  date: string;
  description: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface ArticleItem {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    link?: string;
}

export interface ProjectItem {
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    liveUrl?: string;
    sourceUrl?: string;
}

export interface CertificationItem {
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
    imageUrl?: string;
}

export interface SectionConfig {
    id: string;
    title: string;
    visible: boolean;
}