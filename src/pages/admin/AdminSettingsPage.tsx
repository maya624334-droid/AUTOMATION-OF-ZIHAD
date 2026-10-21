import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { SiteSettings } from '../../types';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Sparkles,
  Mail,
  Sliders,
  Globe,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update website settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-[#F5F7FA]">Website Settings & Identity</h1>
        <p className="text-xs text-[#A0AEC0] mt-1">
          Customize brand name, subtitles, hero texts, social link visibility, and contact parameters.
        </p>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Website settings updated and saved to Firestore.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Brand & Titles */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#00D5FF]" />
            <span>Brand Identity & Header Titles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F5F7FA] font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            <div>
              <label className="block text-[#F5F7FA] font-semibold mb-1">Brand Subtitle</label>
              <input
                type="text"
                required
                value={formData.brandSubtitle}
                onChange={(e) => setFormData({ ...formData, brandSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5F7FA] font-semibold mb-1">
              Professional Title / Role
            </label>
            <input
              type="text"
              required
              value={formData.professionalTitle}
              onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
            />
          </div>

          <div>
            <label className="block text-[#F5F7FA] font-semibold mb-1">Official Contact Email</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
            />
          </div>
        </div>

        {/* Homepage Content */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#3B82F6]" />
            <span>Homepage Hero Copy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F5F7FA] font-semibold mb-1">Hero Main Headline</label>
              <input
                type="text"
                required
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            <div>
              <label className="block text-[#F5F7FA] font-semibold mb-1">Hero Subtitle</label>
              <input
                type="text"
                required
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5F7FA] font-semibold mb-1">
              Hero Introduction Paragraph
            </label>
            <textarea
              rows={4}
              required
              value={formData.heroIntro}
              onChange={(e) => setFormData({ ...formData, heroIntro: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF] resize-none"
            />
          </div>
        </div>

        {/* Social Links & Visibility */}
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider flex items-center space-x-2">
            <Linkedin className="w-4 h-4 text-[#00D5FF]" />
            <span>Social Profiles & LinkedIn Integration</span>
          </h2>
          <p className="text-[11px] text-[#A0AEC0]">
            LinkedIn is optional initially. Leave empty or uncheck the toggle to hide it until you create your profile.
          </p>

          <div className="space-y-4">
            {/* LinkedIn */}
            <div className="p-3 rounded-xl bg-[#0D1420] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-[#F5F7FA]">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn Profile URL</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showLinkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, showLinkedin: e.target.checked })
                    }
                    className="rounded bg-[#111B2A] text-[#00D5FF]"
                  />
                  <span className="text-[#A0AEC0] text-[11px]">Show on public website</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="https://linkedin.com/in/zihad..."
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            {/* GitHub */}
            <div className="p-3 rounded-xl bg-[#0D1420] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-[#F5F7FA]">
                  <Github className="w-4 h-4 text-white" />
                  <span>GitHub Profile / Org URL</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showGithub}
                    onChange={(e) =>
                      setFormData({ ...formData, showGithub: e.target.checked })
                    }
                    className="rounded bg-[#111B2A] text-[#00D5FF]"
                  />
                  <span className="text-[#A0AEC0] text-[11px]">Show on public website</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            {/* Fiverr */}
            <div className="p-3 rounded-xl bg-[#0D1420] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-[#F5F7FA]">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>Fiverr Gig / Seller URL</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showFiverr}
                    onChange={(e) =>
                      setFormData({ ...formData, showFiverr: e.target.checked })
                    }
                    className="rounded bg-[#111B2A] text-[#00D5FF]"
                  />
                  <span className="text-[#A0AEC0] text-[11px]">Show on public website</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="https://fiverr.com/..."
                value={formData.fiverrUrl}
                onChange={(e) => setFormData({ ...formData, fiverrUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            {/* YouTube */}
            <div className="p-3 rounded-xl bg-[#0D1420] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-[#F5F7FA]">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>YouTube Channel URL</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showYoutube}
                    onChange={(e) =>
                      setFormData({ ...formData, showYoutube: e.target.checked })
                    }
                    className="rounded bg-[#111B2A] text-[#00D5FF]"
                  />
                  <span className="text-[#A0AEC0] text-[11px]">Show on public website</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="https://youtube.com/@..."
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            {/* Facebook */}
            <div className="p-3 rounded-xl bg-[#0D1420] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-[#F5F7FA]">
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <span>Facebook Page / Profile URL</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showFacebook}
                    onChange={(e) =>
                      setFormData({ ...formData, showFacebook: e.target.checked })
                    }
                    className="rounded bg-[#111B2A] text-[#00D5FF]"
                  />
                  <span className="text-[#A0AEC0] text-[11px]">Show on public website</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="https://facebook.com/..."
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
