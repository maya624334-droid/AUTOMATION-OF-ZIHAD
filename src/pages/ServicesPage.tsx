import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ServiceItem } from '../types';
import { initialServices } from '../data/defaultData';
import {
  Cpu,
  Bot,
  Zap,
  Network,
  Sparkles,
  ArrowRight,
  Search,
  MessageSquare,
  Target,
  Mail,
  FileSpreadsheet,
  Users,
  LifeBuoy,
  ShoppingBag,
  Briefcase,
  Wrench,
  GitPullRequest,
  Share2,
  Filter,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Bot,
  Zap,
  Network,
  Sparkles,
  MessageSquare,
  Target,
  Mail,
  FileSpreadsheet,
  Users,
  LifeBuoy,
  ShoppingBag,
  Briefcase,
  Wrench,
  GitPullRequest,
  Share2,
  Filter,
};

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFeatured, setFilterFeatured] = useState<boolean>(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const q = query(collection(db, 'services'), where('isPublished', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: ServiceItem[] = [];
          snap.forEach((d) => list.push(d.data() as ServiceItem));
          list.sort((a, b) => a.order - b.order);
          setServices(list);
        } else {
          setServices(initialServices);
        }
      } catch {
        setServices(initialServices);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        searchQuery === '' ||
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.integrations.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFeatured = !filterFeatured || srv.isFeatured;

      return matchesSearch && matchesFeatured;
    });
  }, [services, searchQuery, filterFeatured]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] font-semibold mb-4">
          <Bot className="w-3.5 h-3.5" />
          <span>Full-Spectrum Business Automation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight mb-4">
          AI Automation Services
        </h1>
        <p className="text-sm sm:text-base text-[#A0AEC0] leading-relaxed">
          From self-hosted n8n workflows and autonomous AI agents to WhatsApp customer bots and
          enterprise CRM sync, explore production-grade solutions engineered to eliminate manual
          overhead.
        </p>
      </div>

      {/* Search and Quick Filters */}
      <div className="bg-[#0D1420] border border-white/10 rounded-2xl p-4 sm:p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services or integrations (e.g., n8n, WhatsApp, CRM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111B2A] border border-white/10 rounded-xl text-xs text-[#F5F7FA] placeholder-[#A0AEC0]/60 focus:outline-none focus:border-[#00D5FF]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterFeatured(!filterFeatured)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              filterFeatured
                ? 'bg-[#00D5FF] text-[#070B12] border-[#00D5FF]'
                : 'bg-[#111B2A] text-[#A0AEC0] hover:text-white border-white/10'
            }`}
          >
            {filterFeatured ? 'Showing Featured Services' : 'Filter: Featured Only'}
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = iconMap[service.icon] || Bot;

          return (
            <div
              key={service.id}
              className="bg-[#111B2A] border border-white/10 hover:border-[#00D5FF]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#00D5FF]/10 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0D1420] border border-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 group-hover:text-[#00D5FF] transition-colors leading-snug">
                  <Link to={`/services/${service.slug}`}>{service.title}</Link>
                </h3>

                <p className="text-xs text-[#A0AEC0] line-clamp-3 leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.integrations.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0D1420] text-[#A0AEC0] border border-white/5"
                    >
                      {item}
                    </span>
                  ))}
                  {service.integrations.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0D1420] text-[#A0AEC0]">
                      +{service.integrations.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00D5FF] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inspect Solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="text-[11px] font-semibold text-[#A0AEC0] hover:text-white"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
