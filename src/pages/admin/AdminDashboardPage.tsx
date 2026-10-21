import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import {
  initialProjects,
  initialServices,
  initialSkills,
  initialAboutSections,
  initialSiteSettings,
} from '../../data/defaultData';
import {
  FolderKanban,
  Bot,
  User,
  Wrench,
  Inbox,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    servicesCount: 0,
    skillsCount: 0,
    aboutCount: 0,
    messagesCount: 0,
    newMessagesCount: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Projects
      const projSnap = await getDocs(collection(db, 'portfolioProjects'));
      let pubCount = 0;
      let draftCount = 0;
      projSnap.forEach((d) => {
        const data = d.data();
        if (data.isPublished) pubCount++;
        else draftCount++;
      });

      // Services
      const servSnap = await getDocs(collection(db, 'services'));

      // Skills
      const skillSnap = await getDocs(collection(db, 'skills'));

      // About
      const aboutSnap = await getDocs(collection(db, 'aboutSections'));

      // Messages
      const msgSnap = await getDocs(collection(db, 'contactMessages'));
      let newMsg = 0;
      msgSnap.forEach((d) => {
        if (d.data().status === 'New') newMsg++;
      });

      setStats({
        totalProjects: projSnap.size,
        publishedProjects: pubCount,
        draftProjects: draftCount,
        servicesCount: servSnap.size,
        skillsCount: skillSnap.size,
        aboutCount: aboutSnap.size,
        messagesCount: msgSnap.size,
        newMessagesCount: newMsg,
      });
    } catch (e) {
      console.warn('Error fetching admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will seed/sync initial projects, 16 services, 14 about sections, skills, and site settings to Firestore. Continue?')) {
      return;
    }

    try {
      setSeeding(true);
      setSeedError(null);
      setSeedSuccess(null);

      // 1. Seed Site Settings
      await setDoc(doc(db, 'siteSettings', 'main'), initialSiteSettings);

      // 2. Seed Portfolio Projects
      for (const p of initialProjects) {
        await setDoc(doc(db, 'portfolioProjects', p.id), p);
      }

      // 3. Seed Services
      for (const s of initialServices) {
        await setDoc(doc(db, 'services', s.id), s);
      }

      // 4. Seed About Sections
      for (const a of initialAboutSections) {
        await setDoc(doc(db, 'aboutSections', a.id), a);
      }

      // 5. Seed Skills
      for (const sk of initialSkills) {
        await setDoc(doc(db, 'skills', sk.id), sk);
      }

      setSeedSuccess('Successfully seeded all initial database collections into Cloud Firestore!');
      await fetchStats();
    } catch (err: any) {
      setSeedError(err.message || 'Failed to seed database.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
            Administrator Overview
          </h1>
          <p className="text-xs text-[#A0AEC0] mt-1">
            Real-time management metrics, database operations, and live content counters.
          </p>
        </div>

        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {seeding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Seeding Collections...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Seed Initial Firestore Data</span>
            </>
          )}
        </button>
      </div>

      {seedSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {seedError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{seedError}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Projects */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-[#00D5FF]">
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-[#A0AEC0]">Projects</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
            {loading ? '...' : stats.totalProjects}
          </div>
          <p className="text-[11px] text-[#A0AEC0]">
            {stats.publishedProjects} Published • {stats.draftProjects} Drafts
          </p>
        </div>

        {/* Services */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-[#3B82F6]">
            <Bot className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-[#A0AEC0]">Services</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
            {loading ? '...' : stats.servicesCount}
          </div>
          <p className="text-[11px] text-[#A0AEC0]">Active AI Automation Services</p>
        </div>

        {/* Skills */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-yellow-400">
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-[#A0AEC0]">Tech Stack</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
            {loading ? '...' : stats.skillsCount}
          </div>
          <p className="text-[11px] text-[#A0AEC0]">Categorized Technologies</p>
        </div>

        {/* Contact Messages */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-green-400">
            <Inbox className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-[#A0AEC0]">Inquiries</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">
            {loading ? '...' : stats.messagesCount}
          </div>
          <p className="text-[11px] text-green-400 font-semibold">
            {stats.newMessagesCount} New Submissions
          </p>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            Content Administration
          </h3>
          <div className="space-y-2">
            <Link
              to="/admin/portfolio"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <FolderKanban className="w-4 h-4 text-[#00D5FF]" />
                <span>Manage Portfolio Projects</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>

            <Link
              to="/admin/services"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <Bot className="w-4 h-4 text-[#3B82F6]" />
                <span>Manage AI Services & FAQs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>

            <Link
              to="/admin/about"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <User className="w-4 h-4 text-[#00D5FF]" />
                <span>Edit 14 About Me Sections</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>

            <Link
              to="/admin/skills"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <Wrench className="w-4 h-4 text-yellow-400" />
                <span>Manage Skills & Categories</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>
          </div>
        </div>

        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            Site Ops & Communication
          </h3>
          <div className="space-y-2">
            <Link
              to="/admin/messages"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <Inbox className="w-4 h-4 text-green-400" />
                <span>Contact Inbox ({stats.newMessagesCount} New)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>

            <Link
              to="/admin/media"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-[#00D5FF]" />
                <span>Upload Logo & Media to Storage</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0D1420] hover:bg-[#152238] border border-white/5 transition text-xs font-semibold text-[#F5F7FA]"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#3B82F6]" />
                <span>Brand Identity, Social Links & Settings</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
