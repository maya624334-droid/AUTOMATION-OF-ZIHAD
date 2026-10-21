import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { useSite } from '../context/SiteContext';
import { ContactMessage } from '../types';
import {
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillService = searchParams.get('service');
  const { settings } = useSite();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('n8n Workflow Automation');
  const [budgetRange, setBudgetRange] = useState<string>('$500 - $1,500');
  const [message, setMessage] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'Email' | 'WhatsApp' | 'Telegram' | 'LinkedIn'>('Email');
  const [honeypot, setHoneypot] = useState<string>(''); // Anti-bot honeypot field

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (prefillService) {
      setProjectType(prefillService);
      setMessage(`Hi Zihad, I am interested in discussing your ${prefillService} service.\n\nProject Scope:\nTimeline:`);
    }
  }, [prefillService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Spam honeypot trap
    if (honeypot) {
      // Silently pretend success to deceive bot scrapers
      setSuccessId('MSG-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      return;
    }

    // Basic validation
    if (!fullName.trim() || fullName.length > 150) {
      setError('Please provide your full name (up to 150 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@') || email.length > 150) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 15) {
      setError('Please provide a brief description of your project (at least 15 characters).');
      return;
    }

    try {
      setLoading(true);
      const timestamp = Date.now();
      const messageId = `msg_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;

      const newMsg: ContactMessage = {
        id: messageId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        projectType,
        budgetRange,
        message: message.trim(),
        preferredContact,
        status: 'New',
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'contactMessages', messageId), newMsg);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contactMessages/${messageId}`);
      }

      setSuccessId(messageId);
      setFullName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-4">
          <Send className="w-3.5 h-3.5" />
          <span>Project Inquiry & Hire Me</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight mb-4">
          Let’s Build Your Automation
        </h1>
        <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
          Tell me about your current processes, challenges, and goals. I will review your requirements
          and reply within 24 hours with an actionable automation plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-8 bg-[#111B2A] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          {successId ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F7FA]">Message Received!</h3>
              <p className="text-xs sm:text-sm text-[#A0AEC0] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Your inquiry has been securely registered with reference:
              </p>
              <div className="inline-block px-3 py-1 rounded bg-[#0D1420] text-xs font-mono font-bold text-[#00D5FF]">
                {successId}
              </div>
              <p className="text-xs text-[#A0AEC0]">
                I will review your specifications and contact you via your preferred method shortly.
              </p>
              <button
                onClick={() => setSuccessId(null)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#00D5FF] text-[#070B12] text-xs font-bold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Spam Honeypot - hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <label>Do not fill this out if human</label>
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    Full Name <span className="text-[#00D5FF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/50 focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    Email Address <span className="text-[#00D5FF]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/50 focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="n8n Workflow Automation">n8n Workflow Automation</option>
                    <option value="AI Agent Development">AI Agent Development</option>
                    <option value="OpenAI / Gemini API Integration">OpenAI / Gemini API Integration</option>
                    <option value="WhatsApp / Messenger Bot">WhatsApp / Messenger Bot</option>
                    <option value="Lead Generation Automation">Lead Generation Automation</option>
                    <option value="Google Sheets & CRM Sync">Google Sheets & CRM Sync</option>
                    <option value="Customer Support Bot">Customer Support Bot</option>
                    <option value="Custom Workflow Engineering">Custom Workflow Engineering</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    Estimated Budget (Optional)
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="Under $500">&lt; $500 (Small Automation / Fix)</option>
                    <option value="$500 - $1,500">$500 - $1,500 (Multi-step Pipeline)</option>
                    <option value="$1,500 - $3,000">$1,500 - $3,000 (Complex Architecture)</option>
                    <option value="$3,000+">$3,000+ (Full Enterprise Automation)</option>
                    <option value="Undecided">Undecided / Discuss Later</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Email', 'WhatsApp', 'Telegram', 'LinkedIn'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPreferredContact(method)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        preferredContact === method
                          ? 'bg-[#00D5FF] text-[#070B12] border-[#00D5FF]'
                          : 'bg-[#0D1420] text-[#A0AEC0] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  Project Description & Requirements <span className="text-[#00D5FF]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your current manual process, the platforms you want connected (e.g. n8n, HubSpot, Sheets), and desired turnaround..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/50 focus:outline-none focus:border-[#00D5FF] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-[#00D5FF]/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Communication SLA
            </h3>
            <div className="space-y-3 text-xs text-[#A0AEC0]">
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#00D5FF] shrink-0 mt-0.5" />
                <span>Response time within 24 hours on all technical inquiries.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>Strict non-disclosure: your business data & credentials remain confidential.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MessageSquare className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <span>Direct technical communication with Zihad without middleman account managers.</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0D1420] border border-white/5 rounded-2xl p-6 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D5FF]">
              Direct Contact Email
            </span>
            <p className="text-xs text-[#F5F7FA] font-medium">
              {settings.contactEmail || 'zihadfree22@gmail.com'}
            </p>
            <p className="text-[11px] text-[#A0AEC0]">
              Feel free to send workflow diagrams, export files, or loom video links directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
