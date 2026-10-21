import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import {
  User,
  Bookmark,
  ShieldCheck,
  LogOut,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { currentUser, userProfile, isAdmin, logOut, updateUserBio, removeUserAccount } = useAuth();
  const { bookmarks, toggleBookmark } = useSite();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUserBio(displayName, bio);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await removeUserAccount();
      navigate('/');
    } catch (err: any) {
      alert(`Could not delete account: ${err.message}. Please sign in again recently to delete your profile.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Header bar */}
      <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] text-[#070B12] flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-[#00D5FF]/20">
            {displayName ? displayName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F5F7FA]">
                {displayName || 'Client Portal'}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D5FF]/20 text-[#00D5FF] border border-[#00D5FF]/40">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-[#A0AEC0]">{currentUser.email}</p>
            <p className="text-[11px] text-[#A0AEC0]/60 mt-0.5">
              Account UID: <span className="font-mono">{currentUser.uid.substring(0, 12)}...</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-[#00D5FF]/20 hover:bg-[#00D5FF]/90 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management</span>
            </Link>
          )}

          <button
            onClick={async () => {
              await logOut();
              navigate('/');
            }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#A0AEC0] hover:text-white flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-5 bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#00D5FF] border-b border-white/5 pb-3">
            <User className="w-4 h-4" />
            <h2 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Profile Information
            </h2>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#F5F7FA] font-medium mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
              />
            </div>

            <div>
              <label className="block text-[#F5F7FA] font-medium mb-1.5">Registered Email</label>
              <input
                type="text"
                disabled
                value={currentUser.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420]/50 border border-white/5 text-[#A0AEC0] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[#F5F7FA] font-medium mb-1.5">Bio / Organization</label>
              <textarea
                rows={3}
                placeholder="Tell us about your organization or automation goals..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1420] border border-white/10 text-[#F5F7FA] placeholder-[#A0AEC0]/50 focus:outline-none focus:border-[#00D5FF] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#00D5FF] text-[#070B12] font-bold text-xs hover:shadow-lg transition"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Account Deletion */}
          <div className="pt-6 border-t border-white/5 space-y-2">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Danger Zone
            </h3>
            <p className="text-[11px] text-[#A0AEC0]">
              Permanently remove your account and all associated bookmarks from the database.
            </p>
            {confirmDelete ? (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-2">
                <p className="text-xs text-red-300 font-medium">Are you completely certain?</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-[#A0AEC0] text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center space-x-1.5 pt-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Saved Bookmarks */}
        <div className="lg:col-span-7 bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2 text-[#00D5FF]">
              <Bookmark className="w-4 h-4" />
              <h2 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
                Saved Project Bookmarks
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0D1420] text-[#00D5FF]">
              {bookmarks.length} Saved
            </span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Cpu className="w-10 h-10 text-[#A0AEC0]/40 mx-auto" />
              <p className="text-xs text-[#A0AEC0]">
                You have not saved any portfolio projects to your bookmarks yet.
              </p>
              <Link
                to="/portfolio"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#00D5FF] hover:underline"
              >
                <span>Browse Portfolio Projects</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="bg-[#0D1420] border border-white/5 hover:border-[#00D5FF]/30 rounded-xl p-4 flex items-center justify-between transition group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#00D5FF] uppercase">
                      {bm.projectCategory || 'Automation'}
                    </span>
                    <h3 className="text-xs font-bold text-[#F5F7FA]">
                      <Link
                        to={`/portfolio/${bm.projectId}`}
                        className="hover:text-[#00D5FF] transition"
                      >
                        {bm.projectTitle}
                      </Link>
                    </h3>
                    <p className="text-[10px] text-[#A0AEC0]">
                      Saved on {new Date(bm.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/portfolio/${bm.projectId}`}
                      className="p-2 rounded-lg bg-white/5 text-[#A0AEC0] hover:text-[#00D5FF] transition"
                      title="View Project"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() =>
                        toggleBookmark({
                          id: bm.projectId,
                          title: bm.projectTitle,
                        })
                      }
                      className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
