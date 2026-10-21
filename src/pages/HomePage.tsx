import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSite } from '../context/SiteContext';
import { PortfolioProject, ServiceItem, SkillItem } from '../types';
import { initialProjects, initialServices, initialSkills } from '../data/defaultData';
import {
  ArrowRight,
  Cpu,
  Bot,
  Zap,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  Terminal,
  Linkedin,
  Github,
  Mail,
  FolderGit2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings } = useSite();
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);

  useEffect(() => {
    // Load published services from Firestore, fallback to initialServices
    async function fetchContent() {
      try {
        const servQ = query(collection(db, 'services'), where('isPublished', '==', true), limit(6));
        const servSnap = await getDocs(servQ);
        if (!servSnap.empty) {
          const list: ServiceItem[] = [];
          servSnap.forEach((d) => list.push(d.data() as ServiceItem));
          setFeaturedServices(list);
        } else {
          setFeaturedServices(initialServices.filter((s) => s.isFeatured).slice(0, 6));
        }
      } catch {
        setFeaturedServices(initialServices.filter((s) => s.isFeatured).slice(0, 6));
      }

      try {
        const projQ = query(collection(db, 'portfolioProjects'), where('isPublished', '==', true), limit(4));
        const projSnap = await getDocs(projQ);
        if (!projSnap.empty) {
          const list: PortfolioProject[] = [];
          projSnap.forEach((d) => list.push(d.data() as PortfolioProject));
          setFeaturedProjects(list);
        } else {
          setFeaturedProjects(initialProjects.filter((p) => p.isFeatured).slice(0, 4));
        }
      } catch {
        setFeaturedProjects(initialProjects.filter((p) => p.isFeatured).slice(0, 4));
      }

      try {
        const skillSnap = await getDocs(collection(db, 'skills'));
        if (!skillSnap.empty) {
          const list: SkillItem[] = [];
          skillSnap.forEach((d) => list.push(d.data() as SkillItem));
          setSkillsList(list.slice(0, 8));
        } else {
          setSkillsList(initialSkills.slice(0, 8));
        }
      } catch {
        setSkillsList(initialSkills.slice(0, 8));
      }
    }

    fetchContent();
  }, []);

  const milestones = [
    {
      year: 'Phase 1',
      title: 'Foundation in Logic & Web APIs',
      desc: 'Mastered programming fundamentals, HTTP webhooks, RESTful API structures, and data manipulation.',
    },
    {
      year: 'Phase 2',
      title: 'Workflow Orchestration with n8n',
      desc: 'Specialized in building complex self-hosted n8n pipelines, error trapping, and data normalization across services.',
    },
    {
      year: 'Phase 3',
      title: 'AI Integration & Agentic Systems',
      desc: 'Incorporated LLMs (OpenAI, Gemini), structured JSON extraction, and autonomous agent loops into operational workflows.',
    },
    {
      year: 'Current',
      title: 'Full Business Automation Architecture',
      desc: 'Designing end-to-end multi-platform automated pipelines that reduce manual human overhead by up to 90%.',
    },
  ];

  const whyWorkWithMe = [
    {
      title: 'Practical Business ROI',
      desc: 'No frivolous hype. I build automations designed strictly to save measurable work hours, eliminate data entry errors, and accelerate response times.',
      icon: CheckCircle,
    },
    {
      title: 'Resilient Error Handling',
      desc: 'Workflows fail when third-party APIs glitch. I engineer multi-tier retries, fallback routes, and real-time failure alerts so pipelines never silently break.',
      icon: ShieldAlert,
    },
    {
      title: 'Scalable Architecture',
      desc: 'Whether cloud-hosted or self-hosted in Docker, systems are architected to handle spikes in traffic without choking or ballooning SaaS subscription costs.',
      icon: Layers,
    },
    {
      title: 'Direct, Transparent Engineering',
      desc: 'Clear communication, thoroughly documented nodes, structured JSON schemas, and clean handovers so your team is never left in the dark.',
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00D5FF]/15 to-[#3B82F6]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-24 left-10 w-72 h-72 bg-[#00D5FF]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00D5FF] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#00D5FF]">
              {settings.professionalTitle || 'AI AUTOMATION SPECIALIST'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7FA] mb-6">
            <span className="block text-gradient">
              {settings.heroHeadline || 'BUILD. AUTOMATE. CREATE.'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium text-[#00D5FF] tracking-wide mb-6">
            {settings.heroSubtitle || 'AI Automation | Intelligent Workflows | Business Solutions'}
          </p>

          {/* Introduction */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#A0AEC0] leading-relaxed mb-10">
            {settings.heroIntro ||
              'I am building my skills and projects in AI automation, workflow development, API integration, and intelligent business systems. My goal is to develop practical automation solutions that help businesses reduce repetitive work and improve their processes.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/portfolio"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] hover:shadow-xl hover:shadow-[#00D5FF]/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Explore My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-[#111B2A] hover:bg-[#152238] text-[#F5F7FA] border border-[#00D5FF]/30 hover:border-[#00D5FF] transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Services</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-white/5 hover:bg-white/10 text-[#00D5FF] border border-white/10 transition-all flex items-center justify-center space-x-2"
            >
              <span>Contact Me</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Short Introduction About Me */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1420] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
                Behind The Systems
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
                Meet Zihad — Engineering Practical AI Workflows
              </h2>
              <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
                Rather than treating AI as a mere toy or novelty chatbot, I construct systematic,
                resilient backend pipelines that connect real-world business tools. From autonomous
                lead qualification and omnichannel WhatsApp routers to intelligent document data
                extractors, my work is centered on verifiable operational efficiency.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-[#111B2A] text-xs font-medium text-[#00D5FF] border border-[#00D5FF]/20">
                  ⚡ n8n Architecture
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111B2A] text-xs font-medium text-[#00D5FF] border border-[#00D5FF]/20">
                  🤖 Agentic AI Loops
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111B2A] text-xs font-medium text-[#00D5FF] border border-[#00D5FF]/20">
                  🔗 Webhooks & APIs
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111B2A] text-xs font-medium text-[#00D5FF] border border-[#00D5FF]/20">
                  📊 Google Sheets & CRM Sync
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#111B2A] rounded-2xl border border-white/5 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] flex items-center justify-center text-[#070B12] mb-4 shadow-lg shadow-[#00D5FF]/20">
                <Cpu className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7FA]">Zihad Autivex</h3>
              <p className="text-xs text-[#00D5FF] font-medium mb-4">AI Automation Specialist</p>
              <Link
                to="/about"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F5F7FA] hover:text-[#00D5FF] transition"
              >
                <span>Read Full Biography & Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured AI Automation Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
              Services Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-[#F5F7FA] mt-1">
              Featured AI Automation Services
            </h2>
            <p className="text-sm text-[#A0AEC0] mt-2 max-w-xl">
              Turn tedious, repetitive manual tasks into autonomous, 24/7 background workflows tailored to your stack.
            </p>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold text-[#00D5FF] hover:underline"
          >
            <span>View All 16 Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#00D5FF]/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0D1420] border border-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 group-hover:text-[#00D5FF] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[#A0AEC0] leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.integrations.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0D1420] text-[#A0AEC0] border border-white/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00D5FF] group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Portfolio Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
              Portfolio Systems
            </span>
            <h2 className="text-3xl font-extrabold text-[#F5F7FA] mt-1">
              Featured Portfolio Work
            </h2>
            <p className="text-sm text-[#A0AEC0] mt-2 max-w-xl">
              Real-world pipelines with detailed workflow architectures, diagrams, and implementation logic.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold text-[#00D5FF] hover:underline"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D5FF] bg-[#00D5FF]/10 px-2.5 py-1 rounded-md">
                    {project.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      project.status === 'Completed' || project.status === 'Published'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#F5F7FA] mb-2 hover:text-[#00D5FF] transition">
                  <Link to={`/portfolio/${project.id}`}>{project.title}</Link>
                </h3>

                <p className="text-xs text-[#A0AEC0] leading-relaxed mb-4">
                  {project.shortDescription}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0D1420] text-[#A0AEC0]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Link
                  to={`/portfolio/${project.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00D5FF] hover:underline"
                >
                  <span>View Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A0AEC0] hover:text-white transition"
                    title="Source Repository"
                  >
                    <FolderGit2 className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills and Technologies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1420] border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
              Technical Stack
            </span>
            <h2 className="text-3xl font-extrabold text-[#F5F7FA] mt-1">
              Skills & Technologies
            </h2>
            <p className="text-xs sm:text-sm text-[#A0AEC0] mt-2">
              Curated tools and platforms used to design, run, and scale production automation workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skillsList.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#111B2A] border border-white/5 hover:border-[#00D5FF]/30 rounded-xl p-4 transition-all"
              >
                <div className="text-[10px] font-semibold text-[#00D5FF] mb-1">
                  {skill.proficiencyLabel}
                </div>
                <h4 className="text-sm font-bold text-[#F5F7FA] mb-1">{skill.name}</h4>
                <p className="text-[11px] text-[#A0AEC0] line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/skills"
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#00D5FF] hover:underline"
            >
              <span>Explore All Skill Categories & Competencies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Professional Journey Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
            Milestones
          </span>
          <h2 className="text-3xl font-extrabold text-[#F5F7FA] mt-1">
            My Professional Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#A0AEC0] mt-2">
            The steady technical progression from API experimentation to enterprise-grade workflow architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-[#00D5FF]/10 text-[#00D5FF] mb-3">
                {m.year}
              </div>
              <h4 className="text-base font-bold text-[#F5F7FA] mb-2">{m.title}</h4>
              <p className="text-xs text-[#A0AEC0] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Why Work With Me */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
            Core Philosophy
          </span>
          <h2 className="text-3xl font-extrabold text-[#F5F7FA] mt-1">
            Why Work With Me
          </h2>
          <p className="text-xs sm:text-sm text-[#A0AEC0] mt-2">
            Every automation project is executed with production-grade engineering principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyWorkWithMe.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 hover:border-[#00D5FF]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0D1420] text-[#00D5FF] flex items-center justify-center mb-4 border border-[#00D5FF]/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#F5F7FA] mb-2">{item.title}</h4>
                <p className="text-xs text-[#A0AEC0] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. LinkedIn & Professional Profiles (only rendered if links exist and enabled) */}
      {(settings.showLinkedin && settings.linkedinUrl) ||
      (settings.showGithub && settings.githubUrl) ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0D1420] border border-white/10 rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D5FF]">
              Verified Network
            </span>
            <h3 className="text-2xl font-bold text-[#F5F7FA] mt-1 mb-3">
              Professional Profiles & Social Presence
            </h3>
            <p className="text-xs text-[#A0AEC0] mb-6">
              Connect with me on official platforms or review code repositories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {settings.showLinkedin && settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#111B2A] border border-[#00D5FF]/30 hover:border-[#00D5FF] text-xs font-bold text-[#F5F7FA] flex items-center space-x-2 transition"
                >
                  <Linkedin className="w-4 h-4 text-[#00D5FF]" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-[#A0AEC0]" />
                </a>
              )}
              {settings.showGithub && settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#111B2A] border border-white/10 hover:border-white/30 text-xs font-bold text-[#F5F7FA] flex items-center space-x-2 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repositories</span>
                  <ExternalLink className="w-3 h-3 text-[#A0AEC0]" />
                </a>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* 9. Contact / Collaboration CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#111B2A] via-[#0D1420] to-[#111B2A] border border-[#00D5FF]/30 p-8 sm:p-14 overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D5FF]/10 blur-[100px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] mb-4">
            Ready to Automate Your Critical Business Workflows?
          </h2>
          <p className="text-sm sm:text-base text-[#A0AEC0] max-w-2xl mx-auto mb-8 leading-relaxed">
            Let’s discuss your current manual bottlenecks and architect a customized, dependable AI automation pipeline for your team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] hover:shadow-xl hover:shadow-[#00D5FF]/30 transition-all transform hover:-translate-y-0.5"
            >
              Start a Project Inquiry
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-[#111B2A] text-[#F5F7FA] border border-white/10 hover:border-[#00D5FF]/40 transition"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
