import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSite } from '../context/SiteContext';
import { AboutSection } from '../types';
import { initialAboutSections } from '../data/defaultData';
import {
  User,
  Compass,
  Lightbulb,
  BookOpen,
  FolderGit2,
  Cpu,
  Wrench,
  CheckCircle2,
  Target,
  Eye,
  HeartHandshake,
  Hammer,
  Send,
  Globe,
  ArrowRight,
} from 'lucide-react';

const sectionIcons: Record<string, React.ElementType> = {
  intro: User,
  'who-i-am': Compass,
  'journey-ai': Lightbulb,
  'why-interested': BookOpen,
  'learning-journey': FolderGit2,
  'current-projects': Cpu,
  'technical-interests': Wrench,
  'skills-overview': CheckCircle2,
  'approach-to-problems': Target,
  'professional-goals': Eye,
  'future-vision': HeartHandshake,
  'work-philosophy': Hammer,
  'what-building-now': Cpu,
  'contact-collaboration': Send,
};

export const AboutPage: React.FC = () => {
  const { language, setLanguage, settings } = useSite();
  const [sections, setSections] = useState<AboutSection[]>(initialAboutSections);
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');

  useEffect(() => {
    async function fetchSections() {
      try {
        const q = query(
          collection(db, 'aboutSections'),
          where('isPublished', '==', true)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: AboutSection[] = [];
          snap.forEach((d) => list.push(d.data() as AboutSection));
          list.sort((a, b) => a.order - b.order);
          setSections(list);
        } else {
          setSections(initialAboutSections);
        }
      } catch {
        setSections(initialAboutSections);
      }
    }
    fetchSections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-3">
            <span>Identity & Engineering Philosophy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight">
            About Zihad Autivex
          </h1>
          <p className="text-sm sm:text-base text-[#A0AEC0] mt-2 max-w-2xl">
            {language === 'en'
              ? 'AI Automation Specialist dedicated to building resilient workflows, integrating APIs, and streamlining enterprise operations.'
              : 'এআই অটোমেশন বিশেষজ্ঞ—যিনি নির্ভরযোগ্য ওয়ার্কফ্লো এবং বুদ্ধিমান সিস্টেম তৈরির মাধ্যমে ব্যবসায়িক কার্যক্রম গতিশীল করেন।'}
          </p>
        </div>

        {/* Language switch button */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#111B2A] border border-[#00D5FF]/30 text-xs font-bold text-[#F5F7FA] hover:border-[#00D5FF] transition self-start md:self-auto"
        >
          <Globe className="w-4 h-4 text-[#00D5FF]" />
          <span>Language: {language === 'en' ? 'English (Switch to বাংলা)' : 'বাংলা (Switch to English)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table of contents sidebar on desktop */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-28 h-fit space-y-2 bg-[#0D1420] p-4 rounded-2xl border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#00D5FF] px-3 py-2">
            Section Navigation
          </h3>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {sections.map((sec) => {
              const Icon = sectionIcons[sec.id] || User;
              const isSelected = activeSectionId === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isSelected
                      ? 'bg-[#111B2A] text-[#00D5FF] border border-[#00D5FF]/30 font-bold'
                      : 'text-[#A0AEC0] hover:text-[#F5F7FA] hover:bg-[#111B2A]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </a>
              );
            })}
          </div>
        </aside>

        {/* Content sections */}
        <main className="lg:col-span-8 space-y-8">
          {sections.map((sec, idx) => {
            const Icon = sectionIcons[sec.id] || User;
            const content = language === 'bn' && sec.contentBn ? sec.contentBn : sec.contentEn;

            return (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/30 rounded-2xl p-6 sm:p-8 transition-all relative overflow-hidden"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#0D1420] border border-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D5FF]">
                      0{idx + 1}
                    </span>
                    <h2 className="text-xl font-bold text-[#F5F7FA]">{sec.title}</h2>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </section>
            );
          })}

          {/* Bottom CTA */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0D1420] to-[#111B2A] border border-[#00D5FF]/20 text-center">
            <h3 className="text-xl font-bold text-[#F5F7FA] mb-2">
              Have a Project or Specific Automation in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-[#A0AEC0] mb-6 max-w-xl mx-auto">
              I collaborate with businesses and development teams worldwide to engineer reliable AI solutions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#00D5FF]/20 transition"
            >
              <span>Get in Touch for Collaboration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};
