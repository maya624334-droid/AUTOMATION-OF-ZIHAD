import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, Zap, Activity } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  tool?: string;
}

interface WorkflowVisualizerProps {
  steps?: Step[];
  title?: string;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  steps = [
    { title: 'Inbound Event Trigger', description: 'Webhook catches payload in real-time.', tool: 'Webhook Listener' },
    { title: 'Schema Normalization', description: 'Cleans, validates, and parses JSON data.', tool: 'JavaScript Engine' },
    { title: 'AI Reasoning & Decision', description: 'LLM analyzes context and determines execution path.', tool: 'OpenAI / Gemini' },
    { title: 'Target Dispatch', description: 'Executes API calls to CRM, database, or notification channels.', tool: 'API Dispatcher' },
  ],
  title = 'Interactive Workflow Architecture',
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="bg-[#111B2A] rounded-2xl p-6 border border-[#00D5FF]/20 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00D5FF]/10 text-[#00D5FF] flex items-center justify-center">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FA] tracking-wide uppercase">{title}</h3>
            <p className="text-xs text-[#A0AEC0]">Click steps to trace end-to-end data progression</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-[#00D5FF] bg-[#00D5FF]/10 px-2.5 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D5FF] animate-ping" />
          <span>Active Pipeline</span>
        </div>
      </div>

      {/* Nodes list / flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          const isCompleted = activeStep > idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`cursor-pointer rounded-xl p-4 transition-all relative border ${
                isSelected
                  ? 'bg-[#0D1420] border-[#00D5FF] shadow-lg shadow-[#00D5FF]/15 scale-[1.02]'
                  : isCompleted
                  ? 'bg-[#0D1420]/70 border-[#3B82F6]/40 hover:border-[#00D5FF]/50'
                  : 'bg-[#0D1420]/40 border-white/5 hover:border-white/20'
              }`}
            >
              {/* Connector arrow on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#00D5FF]/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#A0AEC0]">
                  Node 0{idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                ) : (
                  <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00D5FF]' : 'text-gray-600'}`} />
                )}
              </div>

              {step.tool && (
                <div className="inline-block text-[10px] font-semibold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded mb-2">
                  {step.tool}
                </div>
              )}

              <h4 className="text-xs font-bold text-[#F5F7FA] mb-1 leading-snug">{step.title}</h4>
              <p className="text-[11px] text-[#A0AEC0] line-clamp-3 leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* Active step inspector */}
      <div className="mt-6 p-4 rounded-xl bg-[#0D1420] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] flex items-center justify-center text-[#070B12] font-bold text-sm">
            {activeStep + 1}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F5F7FA]">
              Step Details: {steps[activeStep]?.title}
            </h4>
            <p className="text-xs text-[#A0AEC0]">
              {steps[activeStep]?.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-2.5 py-1 text-xs rounded bg-white/5 text-[#A0AEC0] hover:text-white"
          >
            Prev
          </button>
          <button
            onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="px-3 py-1 text-xs font-bold rounded bg-[#00D5FF] text-[#070B12] hover:bg-[#00D5FF]/90"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};
