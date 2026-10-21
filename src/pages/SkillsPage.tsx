import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SkillItem } from '../types';
import { initialSkills } from '../data/defaultData';
import {
  Wrench,
  Search,
  ExternalLink,
  Cpu,
  Zap,
  Network,
  Sparkles,
  Bot,
  Link as LinkIcon,
  Code,
  Terminal,
  Layout,
  Server,
  FileSpreadsheet,
  Database,
  MessageSquare,
  Send,
  MessageCircle,
  Users,
  TrendingUp,
  Box,
  HardDrive,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Zap,
  Network,
  Sparkles,
  Bot,
  Link: LinkIcon,
  Code,
  Terminal,
  Layout,
  Server,
  FileSpreadsheet,
  Database,
  MessageSquare,
  Send,
  MessageCircle,
  Users,
  TrendingUp,
  Box,
  HardDrive,
};

const CATEGORIES = [
  'All',
  'Automation Platforms',
  'AI Models and APIs',
  'n8n and Workflow Tools',
  'Programming and Web Development',
  'Databases and Spreadsheets',
  'Messaging Integrations',
  'CRM and Business Tools',
  'Hosting and Deployment',
];

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadSkills() {
      try {
        const snap = await getDocs(collection(db, 'skills'));
        if (!snap.empty) {
          const list: SkillItem[] = [];
          snap.forEach((d) => list.push(d.data() as SkillItem));
          list.sort((a, b) => a.order - b.order);
          setSkills(list);
        } else {
          setSkills(initialSkills);
        }
      } catch {
        setSkills(initialSkills);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-4">
          <Wrench className="w-3.5 h-3.5" />
          <span>Core Competencies & Technology Stack</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight mb-4">
          Skills & Technologies
        </h1>
        <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
          Authentic documentation of technologies, tools, and platforms actively utilized across
          my automation projects.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#0D1420] border border-white/10 rounded-2xl p-6 mb-10 space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies, tools, or frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111B2A] border border-white/10 rounded-xl text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/60 focus:outline-none focus:border-[#00D5FF]"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#00D5FF] text-[#070B12]'
                  : 'bg-[#111B2A] text-[#A0AEC0] hover:text-[#F5F7FA] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => {
          const Icon = (skill.icon && iconMap[skill.icon]) || Wrench;

          return (
            <div
              key={skill.id}
              className="bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/30 rounded-2xl p-6 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1420] border border-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-[#00D5FF]">
                      {skill.proficiencyLabel}
                    </span>
                    <span className="text-[9px] text-[#A0AEC0] font-medium">
                      {skill.learningStatus}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">
                  {skill.category}
                </div>
                <h3 className="text-base font-bold text-[#F5F7FA] mb-2">{skill.name}</h3>
                <p className="text-xs text-[#A0AEC0] leading-relaxed mb-4">{skill.description}</p>
              </div>

              {skill.docsUrl && (
                <div className="pt-3 border-t border-white/5 flex justify-end">
                  <a
                    href={skill.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-[#00D5FF] hover:underline"
                  >
                    <span>Official Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
