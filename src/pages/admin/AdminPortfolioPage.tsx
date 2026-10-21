import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { PortfolioProject } from '../../types';
import { initialProjects } from '../../data/defaultData';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
} from 'lucide-react';

export const AdminPortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'portfolioProjects'));
      if (!snap.empty) {
        const list: PortfolioProject[] = [];
        snap.forEach((d) => list.push(d.data() as PortfolioProject));
        list.sort((a, b) => a.order - b.order);
        setProjects(list);
      } else {
        setProjects(initialProjects);
      }
    } catch {
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateNew = () => {
    const newId = `project_${Date.now()}`;
    setEditingProject({
      id: newId,
      title: '',
      shortDescription: '',
      category: 'n8n Workflow Automation',
      status: 'In Progress',
      isPublished: true,
      isFeatured: false,
      order: projects.length + 1,
      technologies: ['n8n', 'OpenAI API'],
      thumbnailUrl: '',
      objectives: '',
      problemStatement: '',
      proposedSolution: '',
      workflowOverview: '',
      workflowSteps: [
        { title: 'Trigger Node', description: 'Inbound event webhook listener', tool: 'Webhook' },
        { title: 'Processing Node', description: 'Data normalization and validation', tool: 'JSON Engine' },
        { title: 'Target Dispatch', description: 'Executing downstream API requests', tool: 'API Dispatch' },
      ],
      technicalImplementation: '',
      challenges: '',
      demoUrl: '',
      githubUrl: '',
      videoUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) return;

    try {
      const updated: PortfolioProject = {
        ...editingProject,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'portfolioProjects', updated.id), updated);
      setStatusMsg({ type: 'success', text: `Project "${updated.title}" saved successfully!` });
      setIsModalOpen(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `portfolioProjects/${editingProject.id}`);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save project.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'portfolioProjects', id));
      setStatusMsg({ type: 'success', text: `Project "${title}" deleted.` });
      await fetchProjects();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `portfolioProjects/${id}`);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete project.' });
    }
  };

  const handleTogglePublish = async (project: PortfolioProject) => {
    try {
      const updated = { ...project, isPublished: !project.isPublished };
      await setDoc(doc(db, 'portfolioProjects', project.id), updated);
      await fetchProjects();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `portfolioProjects/${project.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">Portfolio Projects</h1>
          <p className="text-xs text-[#A0AEC0]">
            Create, edit, publish, and manage multi-page portfolio case studies.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold flex items-center space-x-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            statusMsg.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[#111B2A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0AEC0]">
            <thead className="bg-[#0D1420] text-[#F5F7FA] font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-[#F5F7FA]">{p.title}</div>
                    <div className="text-[11px] text-[#A0AEC0]/70 truncate max-w-xs">
                      {p.shortDescription}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[10px] font-semibold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'Completed' || p.status === 'Published'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded transition ${
                        p.isPublished
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {p.isPublished ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D5FF]"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400"
                        title="Delete Project"
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

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111B2A] border border-white/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingProject(null);
              }}
              className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">
              {editingProject.title ? `Edit: ${editingProject.title}` : 'Create Portfolio Project'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="AI Automation">AI Automation</option>
                    <option value="n8n Workflow Automation">n8n Workflow Automation</option>
                    <option value="AI Agents">AI Agents</option>
                    <option value="API Integration">API Integration</option>
                    <option value="WhatsApp and Messenger Automation">WhatsApp and Messenger Automation</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Customer Support Automation">Customer Support Automation</option>
                    <option value="Business Process Automation">Business Process Automation</option>
                    <option value="Website Development">Website Development</option>
                    <option value="Experimental Projects">Experimental Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="Concept">Concept</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              {/* Thumbnail Image upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#F5F7FA] font-semibold">Thumbnail Image URL</label>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-[#00D5FF] hover:underline flex items-center space-x-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload to Storage</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingProject.thumbnailUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Problem Statement</label>
                  <textarea
                    rows={3}
                    value={editingProject.problemStatement}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, problemStatement: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Proposed Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.proposedSolution}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, proposedSolution: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Workflow Overview</label>
                <textarea
                  rows={3}
                  value={editingProject.workflowOverview}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, workflowOverview: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.demoUrl || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, demoUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Video Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.videoUrl || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, videoUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isPublished: e.target.checked })
                    }
                    className="rounded bg-[#0D1420] border-white/10 text-[#00D5FF]"
                  />
                  <span className="text-[#F5F7FA] font-medium">Published on Website</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isFeatured: e.target.checked })
                    }
                    className="rounded bg-[#0D1420] border-white/10 text-[#00D5FF]"
                  />
                  <span className="text-[#F5F7FA] font-medium">Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A0AEC0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Storage Upload Helper */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        category="projects"
        onSuccess={(url) => {
          if (editingProject) {
            setEditingProject({ ...editingProject, thumbnailUrl: url });
          }
        }}
      />
    </div>
  );
};
