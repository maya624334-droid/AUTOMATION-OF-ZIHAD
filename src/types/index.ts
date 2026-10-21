export interface SiteSettings {
  id?: string;
  brandName: string;
  brandSubtitle: string;
  professionalTitle: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroIntro: string;
  logoUrl?: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  linkedinUrl: string;
  githubUrl: string;
  fiverrUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  showLinkedin: boolean;
  showGithub: boolean;
  showFiverr: boolean;
  showYoutube: boolean;
  showFacebook: boolean;
  accentColor?: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  status: 'Concept' | 'In Progress' | 'Completed' | 'Published';
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  technologies: string[];
  thumbnailUrl?: string;
  objectives: string;
  problemStatement: string;
  proposedSolution: string;
  workflowOverview: string;
  workflowSteps?: { title: string; description: string; tool?: string }[];
  technicalImplementation: string;
  challenges: string;
  demoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  businessProblem: string;
  proposedSolution: string;
  workflowDescription: string;
  workflowSteps?: { title: string; description: string; tool?: string }[];
  integrations: string[];
  expectedBenefits: string[];
  exampleUseCases?: string[];
  faqs?: { question: string; answer: string }[];
  icon: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Automation Platforms' | 'AI Models and APIs' | 'n8n and Workflow Tools' | 'Programming and Web Development' | 'Databases and Spreadsheets' | 'Messaging Integrations' | 'CRM and Business Tools' | 'Hosting and Deployment';
  description: string;
  learningStatus: 'Actively Learning' | 'Proficient' | 'Production Ready' | 'Exploring';
  proficiencyLabel: string;
  icon?: string;
  docsUrl?: string;
  relatedProjects?: string[];
  order: number;
}

export interface AboutSection {
  id: string;
  title: string;
  contentEn: string;
  contentBn?: string;
  order: number;
  isPublished: boolean;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  projectType: string;
  budgetRange?: string;
  message: string;
  preferredContact: 'Email' | 'WhatsApp' | 'Telegram' | 'LinkedIn';
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  projectCategory?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface MediaAsset {
  name: string;
  path: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}
