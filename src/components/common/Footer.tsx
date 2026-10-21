import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import {
  Cpu,
  Mail,
  Github,
  Linkedin,
  Youtube,
  Facebook,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSite();

  const socialItems = [
    {
      name: 'LinkedIn',
      url: settings.linkedinUrl,
      show: settings.showLinkedin && !!settings.linkedinUrl,
      icon: Linkedin,
    },
    {
      name: 'GitHub',
      url: settings.githubUrl,
      show: settings.showGithub && !!settings.githubUrl,
      icon: Github,
    },
    {
      name: 'YouTube',
      url: settings.youtubeUrl,
      show: settings.showYoutube && !!settings.youtubeUrl,
      icon: Youtube,
    },
    {
      name: 'Facebook',
      url: settings.facebookUrl,
      show: settings.showFacebook && !!settings.facebookUrl,
      icon: Facebook,
    },
    {
      name: 'Fiverr',
      url: settings.fiverrUrl,
      show: settings.showFiverr && !!settings.fiverrUrl,
      icon: Sparkles,
    },
  ];

  const visibleSocials = socialItems.filter((s) => s.show);

  return (
    <footer className="bg-[#070B12] border-t border-[#00D5FF]/15 text-[#A0AEC0] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#00D5FF]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              {settings.footerLogoUrl || settings.logoUrl ? (
                <img
                  src={settings.footerLogoUrl || settings.logoUrl}
                  alt={settings.brandName}
                  className="h-9 w-auto object-contain rounded"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] flex items-center justify-center text-[#070B12]">
                  <Cpu className="w-5 h-5 stroke-[2.2]" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#F5F7FA]">
                  {settings.brandName || 'ZIHAD AUTIVEX'}
                </span>
                <span className="text-[9px] tracking-wider text-[#00D5FF] uppercase font-semibold">
                  {settings.brandSubtitle || 'AI AUTOMATION SERVICE'}
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#A0AEC0] leading-relaxed">
              Professional AI automation specialist helping businesses eliminate manual work,
              integrate intelligent workflows, and scale operations with robust digital systems.
            </p>
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex items-center space-x-2 text-xs text-[#00D5FF] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.contactEmail}</span>
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#00D5FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00D5FF] transition-colors">
                  About Me & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-[#00D5FF] transition-colors">
                  Portfolio Projects
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#00D5FF] transition-colors">
                  Automation Services
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-[#00D5FF] transition-colors">
                  Skills & Technology Stack
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00D5FF] transition-colors">
                  Hire Me / Project Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA] mb-4">
              Key Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/n8n-workflow-automation" className="hover:text-[#00D5FF] transition-colors">
                  n8n Workflow Automation
                </Link>
              </li>
              <li>
                <Link to="/services/ai-agent-development" className="hover:text-[#00D5FF] transition-colors">
                  Autonomous AI Agents
                </Link>
              </li>
              <li>
                <Link to="/services/whatsapp-automation" className="hover:text-[#00D5FF] transition-colors">
                  WhatsApp & Messenger Bots
                </Link>
              </li>
              <li>
                <Link to="/services/lead-generation-automation" className="hover:text-[#00D5FF] transition-colors">
                  Automated Lead Qualification
                </Link>
              </li>
              <li>
                <Link to="/services/google-sheets-automation" className="hover:text-[#00D5FF] transition-colors">
                  Google Sheets & CRM Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA] mb-4">
              Connect & Portal
            </h4>
            {visibleSocials.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {visibleSocials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#111B2A] border border-white/10 text-[#A0AEC0] hover:text-[#00D5FF] hover:border-[#00D5FF]/40 transition"
                      title={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#A0AEC0]/70 mb-4">
                Social profiles are being updated. Connect directly via the contact form or email.
              </p>
            )}

            <div className="space-y-2 pt-2 border-t border-white/5">
              <Link
                to="/admin"
                className="inline-flex items-center space-x-1.5 text-xs text-[#A0AEC0] hover:text-[#00D5FF] transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D5FF]" />
                <span>Admin Management</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </Link>
              <div>
                <Link
                  to="/profiles"
                  className="text-xs text-[#A0AEC0] hover:text-[#00D5FF] transition"
                >
                  Verified Professional Profiles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A0AEC0]/70 gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName || 'ZIHAD AUTIVEX'}. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>AI Automation Specialist</span>
            <span>•</span>
            <span>Built with Google AI Studio & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
