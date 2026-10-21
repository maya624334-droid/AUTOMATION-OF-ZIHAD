import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  User,
  Wrench,
  Inbox,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, isAdmin, loading, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B12] text-[#A0AEC0]">
        <div className="flex flex-col items-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-[#00D5FF] animate-pulse" />
          <p className="text-xs">Verifying Administrator Privileges...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#111B2A] border border-red-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FA]">Administrator Access Required</h2>
          <p className="text-xs text-[#A0AEC0] leading-relaxed">
            This protected control panel is reserved for authorized administrators. Please sign in
            with an authorized administrator account (<span className="text-[#00D5FF]">zihadfree22@gmail.com</span>).
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#00D5FF] text-[#070B12] text-xs font-bold"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-white/5 text-[#A0AEC0] hover:text-white text-xs font-semibold"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Portfolio Projects', path: '/admin/portfolio', icon: FolderKanban },
    { name: 'AI Services', path: '/admin/services', icon: Bot },
    { name: 'About Me Sections', path: '/admin/about', icon: User },
    { name: 'Skills & Tech Stack', path: '/admin/skills', icon: Wrench },
    { name: 'Contact Inquiries', path: '/admin/messages', icon: Inbox },
    { name: 'Media Storage', path: '/admin/media', icon: ImageIcon },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#070B12] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D1420] border-r border-white/10 shrink-0 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="p-3 bg-[#111B2A] rounded-xl border border-[#00D5FF]/30 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] flex items-center justify-center text-[#070B12]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-[#F5F7FA] truncate">Admin Console</span>
              <span className="text-[10px] text-[#00D5FF] font-mono truncate">{currentUser.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-[#111B2A] text-[#00D5FF] border border-[#00D5FF]/30 shadow-sm'
                      : 'text-[#A0AEC0] hover:text-[#F5F7FA] hover:bg-[#111B2A]/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-[#A0AEC0] hover:text-white hover:bg-[#111B2A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </Link>
          <button
            onClick={async () => {
              await logOut();
              navigate('/');
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
