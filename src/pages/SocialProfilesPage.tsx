import React from 'react';
import { useSite } from '../context/SiteContext';
import {
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Mail,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export const SocialProfilesPage: React.FC = () => {
  const { settings } = useSite();

  const profiles = [
    {
      name: 'LinkedIn',
      category: 'Professional Network',
      description: 'Career updates, professional network, and AI automation insights.',
      url: settings.linkedinUrl,
      show: settings.showLinkedin && !!settings.linkedinUrl,
      icon: Linkedin,
      color: 'text-blue-400',
    },
    {
      name: 'GitHub',
      category: 'Code & Architecture',
      description: 'Open-source automation modules, workflow blueprints, and repositories.',
      url: settings.githubUrl,
      show: settings.showGithub && !!settings.githubUrl,
      icon: Github,
      color: 'text-white',
    },
    {
      name: 'Fiverr',
      category: 'Freelance Services',
      description: 'Official client order placement for automation gigs and bespoke workflow builds.',
      url: settings.fiverrUrl,
      show: settings.showFiverr && !!settings.fiverrUrl,
      icon: Sparkles,
      color: 'text-green-400',
    },
    {
      name: 'YouTube',
      category: 'Video Demonstrations',
      description: 'Video tutorials, step-by-step n8n walkthroughs, and system demos.',
      url: settings.youtubeUrl,
      show: settings.showYoutube && !!settings.youtubeUrl,
      icon: Youtube,
      color: 'text-red-400',
    },
    {
      name: 'Facebook',
      category: 'Community & Updates',
      description: 'Direct messaging and social community discussions.',
      url: settings.facebookUrl,
      show: settings.showFacebook && !!settings.facebookUrl,
      icon: Facebook,
      color: 'text-blue-500',
    },
  ];

  const activeProfiles = profiles.filter((p) => p.show);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>Verified Channels</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight mb-3">
          Professional Profiles & Networks
        </h1>
        <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed">
          Official digital channels where you can connect, review source repositories, or inspect
          service deliveries for ZIHAD AUTIVEX.
        </p>
      </div>

      {activeProfiles.length === 0 ? (
        <div className="bg-[#111B2A] rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <p className="text-xs text-[#A0AEC0] mb-4">
            Professional profiles are currently being curated. Reach out directly via email or our
            contact form.
          </p>
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] text-xs font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>Email: {settings.contactEmail}</span>
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {activeProfiles.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#00D5FF]/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0D1420] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${p.color}`} />
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#00D5FF] transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D5FF]">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-1 group-hover:text-[#00D5FF] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#A0AEC0] leading-relaxed mb-4">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center space-x-2 text-xs font-semibold text-[#00D5FF]">
                  <span>Open {p.name} Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Verified notice */}
      <div className="p-4 rounded-xl bg-[#0D1420] border border-white/5 flex items-center space-x-3 text-xs text-[#A0AEC0] max-w-2xl mx-auto">
        <ShieldCheck className="w-5 h-5 text-[#00D5FF] shrink-0" />
        <p>
          External profile links are managed and verified through the Zihad Autivex administrative
          portal. Third-party branding belongs to their respective owners.
        </p>
      </div>
    </div>
  );
};
