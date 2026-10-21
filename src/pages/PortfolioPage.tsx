import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { PortfolioProject } from '../types';
import { initialProjects } from '../data/defaultData';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  FolderGit2,
  ArrowRight,
  ExternalLink,
  Layers,
  Cpu,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'AI Automation',
  'n8n Workflow Automation',
  'AI Agents',
  'API Integration',
  'WhatsApp and Messenger Automation',
  'Lead Generation',
  'Customer Support Automation',
  'Business Process Automation',
  'Website Development',
  'Experimental Projects',
];

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { bookmarks, toggleBookmark, isBookmarked } = useSite();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(
          collection(db, 'portfolioProjects'),
          where('isPublished', '==', true)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: PortfolioProject[] = [];
          snap.forEach((d) => list.push(d.data() as PortfolioProject));
          list.sort((a, b) => a.order - b.order);
          setProjects(list);
        } else {
          setProjects(initialProjects);
        }
      } catch {
        setProjects(initialProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All' || project.status === selectedStatus;
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Production & Tested Implementations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight mb-4">
          Portfolio & AI Automation Work
        </h1>
        <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
          Explore actual workflows, automated lead engines, WhatsApp bots, and data pipelines.
          Click any project to inspect its step-by-step architecture and problem-solution breakdown.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0D1420] border border-white/10 rounded-2xl p-6 mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword, tool, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111B2A] border border-white/10 rounded-xl text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/60 focus:outline-none focus:border-[#00D5FF]"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-[#A0AEC0] whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Published">Published</option>
              <option value="In Progress">In Progress</option>
              <option value="Concept">Concept</option>
            </select>
          </div>
        </div>

        {/* Categories scroll / tabs */}
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

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#111B2A] rounded-2xl p-12 text-center border border-white/5 max-w-md mx-auto">
          <Cpu className="w-12 h-12 text-[#A0AEC0] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#F5F7FA] mb-1">No Projects Found</h3>
          <p className="text-xs text-[#A0AEC0] mb-4">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 rounded-lg bg-[#00D5FF] text-[#070B12] text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const bookmarked = isBookmarked(project.id);
            return (
              <div
                key={project.id}
                className="group bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#00D5FF]/10 relative"
              >
                <div>
                  {/* Thumbnail / Placeholder */}
                  <div className="w-full h-40 rounded-xl bg-[#0D1420] border border-white/5 mb-4 overflow-hidden relative flex items-center justify-center">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#00D5FF]/10 text-[#00D5FF] flex items-center justify-center mb-2">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-[#00D5FF] tracking-wider uppercase">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Bookmark action if logged in */}
                    {currentUser && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(project);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-[#070B12]/80 backdrop-blur-md text-[#A0AEC0] hover:text-[#00D5FF] transition border border-white/10"
                        title={bookmarked ? 'Remove Bookmark' : 'Bookmark Project'}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-[#00D5FF]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Header badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        project.status === 'Completed' || project.status === 'Published'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F5F7FA] mb-2 group-hover:text-[#00D5FF] transition-colors leading-snug">
                    <Link to={`/portfolio/${project.id}`}>{project.title}</Link>
                  </h3>

                  <p className="text-xs text-[#A0AEC0] line-clamp-3 leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>
                </div>

                <div>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0D1420] text-[#A0AEC0]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#0D1420] text-[#A0AEC0]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00D5FF] hover:translate-x-1 transition-transform"
                    >
                      <span>View Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A0AEC0] hover:text-[#F5F7FA] transition"
                        title="GitHub Repository"
                      >
                        <FolderGit2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
