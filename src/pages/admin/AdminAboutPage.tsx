import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { AboutSection } from '../../types';
import { initialAboutSections } from '../../data/defaultData';
import { User, Edit2, Eye, EyeOff, Save, CheckCircle2, Globe, X } from 'lucide-react';

export const AdminAboutPage: React.FC = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSec, setEditingSec] = useState<AboutSection | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'aboutSections'));
      if (!snap.empty) {
        const list: AboutSection[] = [];
        snap.forEach((d) => list.push(d.data() as AboutSection));
        list.sort((a, b) => a.order - b.order);
        setSections(list);
      } else {
        setSections(initialAboutSections);
      }
    } catch {
      setSections(initialAboutSections);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSec) return;

    try {
      await setDoc(doc(db, 'aboutSections', editingSec.id), editingSec);
      setStatusMsg({ type: 'success', text: `Section "${editingSec.title}" updated.` });
      setEditingSec(null);
      await fetchSections();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `aboutSections/${editingSec.id}`);
      setStatusMsg({ type: 'error', text: err.message || 'Error saving section.' });
    }
  };

  const handleTogglePublish = async (sec: AboutSection) => {
    try {
      const updated = { ...sec, isPublished: !sec.isPublished };
      await setDoc(doc(db, 'aboutSections', sec.id), updated);
      await fetchSections();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `aboutSections/${sec.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-[#F5F7FA]">About Me Management</h1>
        <p className="text-xs text-[#A0AEC0] mt-1">
          Customize all 14 personal biography sections, technical philosophies, and English/Bengali translations.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-[#111B2A] border border-[#00D5FF]/30 text-xs text-[#00D5FF] flex justify-between items-center">
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="bg-[#111B2A] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#00D5FF] px-2 py-0.5 rounded bg-[#00D5FF]/10 font-mono">
                  #{idx + 1}
                </span>
                <h3 className="text-sm font-bold text-[#F5F7FA]">{sec.title}</h3>
              </div>
              <p className="text-xs text-[#A0AEC0] line-clamp-2 max-w-2xl leading-relaxed">
                {sec.contentEn}
              </p>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => handleTogglePublish(sec)}
                className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  sec.isPublished
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {sec.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{sec.isPublished ? 'Visible' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => setEditingSec(sec)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00D5FF] hover:text-[#070B12] text-xs font-bold text-[#00D5FF] transition flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Text</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111B2A] border border-white/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingSec(null)}
              className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-[#F5F7FA] mb-4">
              Edit Section: {editingSec.title}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={editingSec.title}
                  onChange={(e) => setEditingSec({ ...editingSec, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">
                  Content (English)
                </label>
                <textarea
                  required
                  rows={6}
                  value={editingSec.contentEn}
                  onChange={(e) => setEditingSec({ ...editingSec, contentEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF] resize-none"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-semibold mb-1">
                  Content (বাংলা - Bengali Translation)
                </label>
                <textarea
                  rows={6}
                  value={editingSec.contentBn || ''}
                  onChange={(e) => setEditingSec({ ...editingSec, contentBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0D1420] border border-white/10 rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF] resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={editingSec.isPublished}
                  onChange={(e) =>
                    setEditingSec({ ...editingSec, isPublished: e.target.checked })
                  }
                  className="rounded bg-[#0D1420] text-[#00D5FF]"
                />
                <label htmlFor="pubCheck" className="text-[#F5F7FA] font-medium cursor-pointer">
                  Publish on public About page
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSec(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] font-bold"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
