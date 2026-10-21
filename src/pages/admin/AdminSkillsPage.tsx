import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { SkillItem } from '../../types';
import { initialSkills } from '../../data/defaultData';
import { Wrench, Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';

export const AdminSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'skills'));
      if (!snap.empty) {
        const list: SkillItem[] = [];
        snap.forEach((d) => list.push(d.data() as SkillItem));
        list.sort((a, b) => a.order - b.order);
        setSkills(list);
      } else {
        setSkills(initialSkills);
      }
    } catch {
      setSkills(initialSkills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = () => {
    const id = `skill_${Date.now()}`;
    setEditingSkill({
      id,
      name: '',
      category: 'Automation Platforms',
      description: '',
      learningStatus: 'Production Ready',
      proficiencyLabel: 'Advanced',
      docsUrl: '',
      order: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    try {
      await setDoc(doc(db, 'skills', editingSkill.id), editingSkill);
      setStatusMsg(`Skill "${editingSkill.name}" saved.`);
      setIsModalOpen(false);
      setEditingSkill(null);
      await fetchSkills();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `skills/${editingSkill.id}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'skills', id));
      await fetchSkills();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `skills/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">Skills & Technologies</h1>
          <p className="text-xs text-[#A0AEC0]">
            Manage technologies, categorized domains, proficiencies, and official documentation links.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold flex items-center space-x-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] flex justify-between items-center">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#111B2A] border border-white/10 rounded-xl p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded">
                  {skill.proficiencyLabel}
                </span>
                <span className="text-[10px] text-[#A0AEC0]">{skill.learningStatus}</span>
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FA] mb-1">{skill.name}</h3>
              <p className="text-[10px] uppercase font-bold text-[#A0AEC0]/70 mb-2">
                {skill.category}
              </p>
              <p className="text-xs text-[#A0AEC0] line-clamp-2 leading-relaxed">
                {skill.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-3">
              {skill.docsUrl ? (
                <a
                  href={skill.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#00D5FF] hover:underline flex items-center space-x-1"
                >
                  <span>Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span />
              )}
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setIsModalOpen(true);
                  }}
                  className="p-1 rounded bg-white/5 text-[#00D5FF]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id, skill.name)}
                  className="p-1 rounded bg-white/5 text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111B2A] border border-white/20 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-[#F5F7FA] mb-4">
              {editingSkill.name ? `Edit: ${editingSkill.name}` : 'Add Technology'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Technology Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="Automation Platforms">Automation Platforms</option>
                    <option value="AI Models and APIs">AI Models and APIs</option>
                    <option value="n8n and Workflow Tools">n8n and Workflow Tools</option>
                    <option value="Programming and Web Development">Programming and Web Development</option>
                    <option value="Databases and Spreadsheets">Databases and Spreadsheets</option>
                    <option value="Messaging Integrations">Messaging Integrations</option>
                    <option value="CRM and Business Tools">CRM and Business Tools</option>
                    <option value="Hosting and Deployment">Hosting and Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#F5F7FA] font-semibold mb-1">Proficiency Label</label>
                  <select
                    value={editingSkill.proficiencyLabel}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, proficiencyLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Official Documentation URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingSkill.docsUrl || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, docsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
