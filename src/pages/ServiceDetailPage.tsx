import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ServiceItem } from '../types';
import { initialServices } from '../data/defaultData';
import { WorkflowVisualizer } from '../components/common/WorkflowVisualizer';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadService() {
      if (!slug) return;
      setLoading(true);

      try {
        const q = query(
          collection(db, 'services'),
          where('slug', '==', slug),
          where('isPublished', '==', true)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          setService(snap.docs[0].data() as ServiceItem);
        } else {
          const fallback = initialServices.find((s) => s.slug === slug);
          setService(fallback || null);
        }
      } catch {
        const fallback = initialServices.find((s) => s.slug === slug);
        setService(fallback || null);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Bot className="w-10 h-10 text-[#00D5FF] animate-pulse mx-auto mb-4" />
        <p className="text-sm text-[#A0AEC0]">Loading service architecture...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-[#F5F7FA] mb-2">Service Not Found</h2>
        <p className="text-xs text-[#A0AEC0] mb-6">
          The requested AI automation service does not exist or is currently unavailable.
        </p>
        <Link
          to="/services"
          className="px-4 py-2 rounded-lg bg-[#00D5FF] text-[#070B12] text-xs font-bold"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#A0AEC0] hover:text-[#00D5FF] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous AI Automation Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F7FA] tracking-tight">
          {service.title}
        </h1>

        <p className="text-base sm:text-lg text-[#A0AEC0] leading-relaxed max-w-3xl">
          {service.overview || service.shortDescription}
        </p>

        {/* CTA Banner */}
        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            to={`/contact?service=${encodeURIComponent(service.title)}`}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#00D5FF]/20 transition flex items-center space-x-2"
          >
            <span>Inquire About This Service</span>
            <Send className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/portfolio"
            className="px-6 py-3 rounded-xl bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 text-xs font-semibold text-[#F5F7FA] transition flex items-center space-x-2"
          >
            <span>Related Case Studies</span>
          </Link>
        </div>
      </div>

      {/* Workflow Visualizer */}
      <section>
        <WorkflowVisualizer
          steps={service.workflowSteps}
          title={`${service.title} — Execution Architecture`}
        />
      </section>

      {/* Business Problem vs Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">The Business Problem</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {service.businessProblem}
          </p>
        </div>

        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-[#00D5FF]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FA]">The Proposed Solution</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
            {service.proposedSolution}
          </p>
        </div>
      </div>

      {/* Workflow Description */}
      <div className="bg-[#111B2A] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-3">
        <div className="flex items-center space-x-2 text-[#3B82F6]">
          <Layers className="w-5 h-5" />
          <h3 className="text-lg font-bold text-[#F5F7FA]">Operational Workflow Breakdown</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed whitespace-pre-line">
          {service.workflowDescription}
        </p>
      </div>

      {/* Supported Integrations & Expected Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Supported Integrations */}
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-[#F5F7FA] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00D5FF]" />
            <span>Supported Integrations</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {service.integrations.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-lg bg-[#0D1420] text-xs font-semibold text-[#F5F7FA] border border-white/5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Expected Benefits */}
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-[#F5F7FA] flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Key Business Benefits</span>
          </h3>
          <ul className="space-y-2">
            {service.expectedBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-[#A0AEC0]">
                <span className="text-[#00D5FF] font-bold">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example Use Cases (if provided) */}
      {service.exampleUseCases && service.exampleUseCases.length > 0 && (
        <div className="bg-[#111B2A] rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-[#F5F7FA]">Real-World Use Cases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {service.exampleUseCases.map((useCase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0D1420] border border-white/5 text-xs text-[#A0AEC0] leading-relaxed"
              >
                <span className="block font-bold text-[#00D5FF] mb-1">Scenario 0{idx + 1}</span>
                {useCase}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="bg-[#111B2A] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D1420] border border-white/5 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#F5F7FA] hover:text-[#00D5FF]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#A0AEC0] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#A0AEC0] leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-[#0D1420] via-[#111B2A] to-[#0D1420] rounded-2xl p-8 border border-[#00D5FF]/30 text-center space-y-4">
        <h3 className="text-2xl font-bold text-[#F5F7FA]">
          Integrate {service.title} into Your Operations
        </h3>
        <p className="text-xs sm:text-sm text-[#A0AEC0] max-w-xl mx-auto">
          Contact me to schedule a technical discovery call or submit your specific process requirements.
        </p>
        <Link
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-[#00D5FF]/20 transition"
        >
          <span>Get Started on This Service</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
