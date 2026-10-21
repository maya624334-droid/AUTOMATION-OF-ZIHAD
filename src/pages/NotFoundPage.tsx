import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#111B2A] border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#00D5FF]/10 text-[#00D5FF] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#F5F7FA]">404</h1>
        <h2 className="text-lg font-bold text-[#F5F7FA]">Pipeline Path Not Found</h2>
        <p className="text-xs text-[#A0AEC0] leading-relaxed">
          The requested URL does not exist or may have been moved. Let’s guide you back to our primary
          automation catalog.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
