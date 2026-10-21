import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { PortfolioProject } from '../types';
import { initialProjects } from '../data/defaultData';
import { WorkflowVisualizer } from '../components/common/WorkflowVisualizer';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  FolderGit2,
  ExternalLink,
  Play,
  Cpu,
  Target,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const { isBookmarked, toggleBookmark } = useSite();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      setLoading(true);

      try {
        const docRef = doc(db, 'portfolioProjects', id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProject(snap.data() as PortfolioProject);
        } else {
          // Fallback to initialProjects
          const found = initialProjects.find((p) => p.id === id);
          if (found) {
            setProject(found);
          } else {
            setProject(null);
          }
        }
      } catch {
        const found = initialProjects.find((p) => p.id === id);
        setProject(found || null);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  useEffect(() => {
    async function fetchRelated() {
      if (!project) return;
      try {
        const q = query(
          collection(db, 'portfolioProjects'),
          where('category', '==', project.category),
          where('isPublished', '==', true),
          limit(3)
        );
        const snap = await getDocs(q);
        const list: PortfolioProject[] = [];
        snap.forEach((d) => {
          if (d.id !== project.id) list.push(d.data() as PortfolioProject);
        });
        setRelatedProjects(list);
      } catch {
        const list = initialProjects.filter(
          (p) => p.category === project.category && p.id !== project.id
        );
        setRelatedProjects(list.slice(0, 2));
      }
    }
    fetchRelated();
  }, [project]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Cpu className="w-10 h-10 text-[#00D5FF] animate-pulse mx-auto mb-4" />
        <p className="text-sm text-[#A0AEC0]">Loading project architecture...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-[#F5F7FA] mb-2">Project Not Found</h2>
        <p className="text-xs text-[#A0AEC0] mb-6">
          The requested portfolio project does not exist or may have been unlisted.
        </p>
        <Link
          to="/portfolio"
          className="px-4 py-2 rounded-lg bg-[#00D5FF] text-[#070B12] text-xs font-bold"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(project.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#A0AEC0] hover:text-[#00D5FF] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center space-x-2">
          {currentUser && (
            <button
              onClick={() => toggleBookmark(project)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 text-xs font-medium text-[#F5F7FA] transition"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#00D5FF]" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-[#A0AEC0]" />
                  <span>Bookmark</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111B2A] border border-white/10 hover:border-white/30 text-xs font-medium text-[#A0AEC0] hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D5FF] bg-[#00D5FF]/10 px-3 py-1 rounded-md">
            {project.category}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded ${
              project.status === 'Completed' || project.status === 'Published'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}
          >
            Status: {project.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F7FA] tracking-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-[#A0AEC0] leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#111B2A] text-[#F5F7FA] border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-3 pt-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold flex items-center space-x-2 hover:shadow-lg hover:shadow-[#00D5FF]/20 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demonstration</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#111B2A] border border-white/10 hover:border-white/30 text-xs font-bold text-[#F5F7FA] flex items-center space-x-2 transition"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>View Repository</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#111B2A] border border-red-500/30 text-xs font-bold text-red-400 flex items-center space-x-2 hover:bg-red-500/10 transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Watch Video Walkthrough</span>
            </a>
          )}
        </div>
      </div>

      {/* Project Thumbnail Image (if provided) */}
      {project.thumbnailUrl && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0D1420]">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Interactive Workflow Visualizer */}
      <section>
        <WorkflowVisualizer
          steps={project.workflowSteps}
          title={`${project.title} — Pipeline Breakdown`}
        />
      </section>

      {/* Core Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Objectives */}
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-[#00D5FF]">
            <Target className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">Project Objectives</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.objectives}
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-yellow-400">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">Problem Statement</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.problemStatement}
          </p>
        </div>
      </div>

      {/* Proposed Solution & Workflow Overview */}
      <div className="space-y-6">
        <div className="bg-[#111B2A] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-[#00D5FF]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-lg font-bold text-[#F5F7FA]">Proposed Solution & Architecture</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.proposedSolution}
          </p>
        </div>

        <div className="bg-[#111B2A] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-[#3B82F6]">
            <Cpu className="w-5 h-5" />
            <h3 className="text-lg font-bold text-[#F5F7FA]">Workflow Overview</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.workflowOverview}
          </p>
        </div>
      </div>

      {/* Technical Implementation & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-[#00D5FF]">
            <Wrench className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">Technical Implementation</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.technicalImplementation}
          </p>
        </div>

        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">Challenges & Lessons Learned</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {project.challenges}
          </p>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="pt-8 border-t border-white/10 space-y-6">
          <h3 className="text-xl font-bold text-[#F5F7FA]">Related Automations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                className="bg-[#111B2A] rounded-xl p-5 border border-white/5 hover:border-[#00D5FF]/30 transition"
              >
                <span className="text-[10px] font-bold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded">
                  {rel.category}
                </span>
                <h4 className="text-sm font-bold text-[#F5F7FA] mt-2 mb-1">
                  <Link to={`/portfolio/${rel.id}`} className="hover:text-[#00D5FF] transition">
                    {rel.title}
                  </Link>
                </h4>
                <p className="text-xs text-[#A0AEC0] line-clamp-2 leading-relaxed">
                  {rel.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-[#0D1420] via-[#111B2A] to-[#0D1420] rounded-2xl p-8 border border-[#00D5FF]/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-[#F5F7FA]">
          Want a Similar System Built for Your Organization?
        </h3>
        <p className="text-xs sm:text-sm text-[#A0AEC0] max-w-xl mx-auto">
          I will design, configure, and deploy an automated pipeline tailored precisely to your software and team workflows.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-lg transition"
        >
          <span>Request Custom Automation</span>
        </Link>
      </div>
    </div>
  );
};
