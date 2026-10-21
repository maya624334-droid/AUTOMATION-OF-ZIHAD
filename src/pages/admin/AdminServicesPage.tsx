import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { ServiceItem } from '../../types';
import { initialServices } from '../../data/defaultData';
import { Bot, Plus, Edit2, Trash2, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'services'));
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
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    const id = `service_${Date.now()}`;
    setEditingService({
      id,
      title: '',
      slug: `custom-service-${Date.now()}`,
      shortDescription: '',
      overview: '',
      businessProblem: '',
      proposedSolution: '',
      workflowDescription: '',
      integrations: ['n8n', 'OpenAI API'],
      expectedBenefits: ['Drastic reduction in manual work hours', '24/7 reliability'],
      exampleUseCases: ['Enterprise operations'],
      faqs: [{ question: 'How is this deployed?', answer: 'Configured and tested directly on your infrastructure.' }],
      icon: 'Bot',
      isPublished: true,
      isFeatured: false,
      order: services.length + 1,
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;

    try {
      const updated = {
        ...editingService,
        slug: editingService.slug || editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'services', updated.id), updated);
      setStatusMsg({ type: 'success', text: `Service "${updated.title}" saved.` });
      setIsModalOpen(false);
      setEditingService(null);
      await fetchServices();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `services/${editingService.id}`);
      setStatusMsg({ type: 'error', text: err.message || 'Error saving service.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      setStatusMsg({ type: 'success', text: `Service "${title}" deleted.` });
      await fetchServices();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">AI Automation Services</h1>
          <p className="text-xs text-[#A0AEC0]">
            Manage the 16 core services, detailed architectures, use cases, and FAQs.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold flex items-center space-x-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] flex justify-between items-center">
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-[#111B2A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0AEC0]">
            <thead className="bg-[#0D1420] text-[#F5F7FA] font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Service Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((s, idx) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3.5 font-mono text-[#00D5FF]">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-bold text-[#F5F7FA]">
                    {s.title}
                    {s.isFeatured && (
                      <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-[#00D5FF]/20 text-[#00D5FF]">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-white/50">{s.slug}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.isPublished
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {s.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 text-[#00D5FF] hover:bg-white/10"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="p-1.5 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111B2A] border border-white/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingService(null);
              }}
              className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">
              {editingService.title ? `Edit: ${editingService.title}` : 'Create Service'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({ ...editingService, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug}
                    onChange={(e) =>
                      setEditingService({ ...editingService, slug: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Detailed Overview</label>
                <textarea
                  rows={3}
                  value={editingService.overview}
                  onChange={(e) =>
                    setEditingService({ ...editingService, overview: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Business Problem</label>
                  <textarea
                    rows={3}
                    value={editingService.businessProblem}
                    onChange={(e) =>
                      setEditingService({ ...editingService, businessProblem: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Proposed Solution</label>
                  <textarea
                    rows={3}
                    value={editingService.proposedSolution}
                    onChange={(e) =>
                      setEditingService({ ...editingService, proposedSolution: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Workflow Description</label>
                <textarea
                  rows={3}
                  value={editingService.workflowDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, workflowDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isPublished}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isPublished: e.target.checked })
                    }
                    className="rounded bg-[#0D1420] border-white/10 text-[#00D5FF]"
                  />
                  <span className="text-[#F5F7FA] font-medium">Published on Public Site</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isFeatured}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isFeatured: e.target.checked })
                    }
                    className="rounded bg-[#0D1420] border-white/10 text-[#00D5FF]"
                  />
                  <span className="text-[#F5F7FA] font-medium">Featured Service</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
