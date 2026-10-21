import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { ContactMessage } from '../../types';
import { Inbox, Mail, Trash2, CheckCircle2, Clock, Phone, AlertCircle, X } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'contactMessages'));
      const list: ContactMessage[] = [];
      snap.forEach((d) => list.push(d.data() as ContactMessage));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(list);
    } catch (e) {
      console.warn('Error loading contact messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'New' | 'In Progress' | 'Resolved') => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: newStatus });
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `contactMessages/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMessage?.id === id) setActiveMessage(null);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `contactMessages/${id}`);
    }
  };

  const filtered = messages.filter((m) =>
    filterStatus === 'All' ? true : m.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">Contact Inquiries Inbox</h1>
          <p className="text-xs text-[#A0AEC0]">
            Review client project inquiries, change status, and send replies.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(['All', 'New', 'In Progress', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-[#00D5FF] text-[#070B12]'
                  : 'bg-[#111B2A] text-[#A0AEC0] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-[#111B2A] border border-white/10 rounded-2xl p-4 space-y-2 max-h-[75vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A0AEC0]">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>No inquiries found under this filter.</span>
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = activeMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => setActiveMessage(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition border text-xs space-y-1 ${
                    isSelected
                      ? 'bg-[#0D1420] border-[#00D5FF] shadow-sm'
                      : 'bg-[#0D1420]/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F7FA] truncate">{msg.fullName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        msg.status === 'New'
                          ? 'bg-blue-500/20 text-[#00D5FF]'
                          : msg.status === 'In Progress'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#00D5FF] truncate">{msg.projectType}</p>
                  <p className="text-[#A0AEC0] line-clamp-1">{msg.message}</p>
                  <div className="text-[10px] text-[#A0AEC0]/60 pt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Details Inspector */}
        <div className="lg:col-span-7 bg-[#111B2A] border border-white/10 rounded-2xl p-6">
          {activeMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F7FA]">
                    {activeMessage.fullName}
                  </h3>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    className="text-xs text-[#00D5FF] hover:underline"
                  >
                    {activeMessage.email}
                  </a>
                  <p className="text-[11px] text-[#A0AEC0] mt-1">
                    Submitted: {new Date(activeMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(activeMessage.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#A0AEC0]">Update Status:</span>
                {(['New', 'In Progress', 'Resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(activeMessage.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      activeMessage.status === st
                        ? 'bg-[#00D5FF] text-[#070B12] border-[#00D5FF]'
                        : 'bg-white/5 text-[#A0AEC0] border-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#0D1420] p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[#A0AEC0] block mb-0.5">Project Type</span>
                  <span className="font-bold text-[#F5F7FA]">{activeMessage.projectType}</span>
                </div>
                <div>
                  <span className="text-[#A0AEC0] block mb-0.5">Budget Range</span>
                  <span className="font-bold text-[#00D5FF]">
                    {activeMessage.budgetRange || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#A0AEC0] block mb-0.5">Preferred Contact</span>
                  <span className="font-bold text-[#F5F7FA]">
                    {activeMessage.preferredContact}
                  </span>
                </div>
                <div>
                  <span className="text-[#A0AEC0] block mb-0.5">Inquiry ID</span>
                  <span className="font-mono text-[10px] text-[#A0AEC0]">
                    {activeMessage.id}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">
                  Project Description
                </h4>
                <div className="p-4 rounded-xl bg-[#0D1420] border border-white/5 text-xs text-[#F5F7FA] leading-relaxed whitespace-pre-line">
                  {activeMessage.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <a
                  href={`mailto:${activeMessage.email}?subject=RE: Automation Inquiry (${activeMessage.projectType})&body=Hi ${activeMessage.fullName},%0D%0A%0D%0AThank you for reaching out to Zihad Autivex regarding your ${activeMessage.projectType} inquiry.`}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#00D5FF] text-[#070B12] text-xs font-bold hover:shadow-lg transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#A0AEC0]">
              <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#00D5FF]" />
              <p>Select an inquiry from the inbox to inspect details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
