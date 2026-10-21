import React, { useState } from 'react';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { useSite } from '../../context/SiteContext';
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface UploadedAsset {
  name: string;
  category: string;
  url: string;
  uploadedAt: string;
}

export const AdminMediaPage: React.FC = () => {
  const { settings, updateSettings } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'logos' | 'projects' | 'services' | 'general'>('logos');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Maintain local history of uploaded assets during the session
  const [assetList, setAssetList] = useState<UploadedAsset[]>([
    ...(settings.logoUrl
      ? [
          {
            name: 'Primary Brand Logo',
            category: 'logos',
            url: settings.logoUrl,
            uploadedAt: 'Active Logo',
          },
        ]
      : []),
    ...(settings.footerLogoUrl
      ? [
          {
            name: 'Footer Logo',
            category: 'logos',
            url: settings.footerLogoUrl,
            uploadedAt: 'Active Footer Logo',
          },
        ]
      : []),
  ]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUploadSuccess = async (url: string) => {
    const newAsset: UploadedAsset = {
      name: `${uploadCategory.toUpperCase()} Asset ${assetList.length + 1}`,
      category: uploadCategory,
      url,
      uploadedAt: new Date().toLocaleTimeString(),
    };
    setAssetList((prev) => [newAsset, ...prev]);

    // If uploaded category is logos, ask if user wants to set it as main brand logo
    if (uploadCategory === 'logos') {
      const setAsMain = window.confirm('Would you like to set this new image as the main brand logo now?');
      if (setAsMain) {
        await updateSettings({ logoUrl: url });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">Media & Firebase Storage</h1>
          <p className="text-xs text-[#A0AEC0]">
            Upload brand logos, project screenshots, workflow diagrams, and obtain secure CDN URLs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value as any)}
            className="px-3 py-2 bg-[#111B2A] border border-white/10 rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00D5FF]"
          >
            <option value="logos">Category: Logos</option>
            <option value="projects">Category: Projects</option>
            <option value="services">Category: Services</option>
            <option value="general">Category: General</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-xs font-bold flex items-center space-x-1.5 shadow-lg"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
        </div>
      </div>

      {/* Active Brand Logos Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
              Current Header Logo
            </span>
            <button
              onClick={() => {
                setUploadCategory('logos');
                setIsModalOpen(true);
              }}
              className="text-[11px] text-[#00D5FF] hover:underline"
            >
              Replace Logo
            </button>
          </div>

          <div className="h-28 bg-[#0D1420] rounded-xl border border-white/5 flex items-center justify-center p-4">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Brand Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-xs text-[#A0AEC0]">
                <span>No custom header logo uploaded.</span>
                <p className="text-[10px] text-[#00D5FF] mt-1">Default tech icon is displayed</p>
              </div>
            )}
          </div>

          {settings.logoUrl && (
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(settings.logoUrl!)}
                className="text-[#00D5FF] hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedUrl === settings.logoUrl ? 'Copied URL!' : 'Copy Logo URL'}</span>
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Remove current custom logo and revert to text/icon?')) {
                    await updateSettings({ logoUrl: '' });
                  }
                }}
                className="text-red-400 hover:text-red-300"
              >
                Remove Custom Logo
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
              Current Footer Logo
            </span>
            <button
              onClick={() => {
                setUploadCategory('logos');
                setIsModalOpen(true);
              }}
              className="text-[11px] text-[#00D5FF] hover:underline"
            >
              Upload Footer Logo
            </button>
          </div>

          <div className="h-28 bg-[#0D1420] rounded-xl border border-white/5 flex items-center justify-center p-4">
            {settings.footerLogoUrl ? (
              <img
                src={settings.footerLogoUrl}
                alt="Footer Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-xs text-[#A0AEC0]">
                <span>Using default or header logo in footer.</span>
              </div>
            )}
          </div>

          {settings.footerLogoUrl && (
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(settings.footerLogoUrl!)}
                className="text-[#00D5FF] hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedUrl === settings.footerLogoUrl ? 'Copied!' : 'Copy URL'}</span>
              </button>
              <button
                onClick={async () => {
                  await updateSettings({ footerLogoUrl: '' });
                }}
                className="text-red-400 hover:text-red-300"
              >
                Clear Footer Logo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Asset Gallery */}
      <div className="bg-[#111B2A] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
          Uploaded Media Assets Gallery
        </h3>

        {assetList.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A0AEC0]">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#00D5FF]" />
            <p>No media files uploaded yet. Click "Upload New Asset" to upload to Firebase Storage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assetList.map((asset, idx) => (
              <div
                key={idx}
                className="bg-[#0D1420] border border-white/5 rounded-xl p-3 space-y-2 flex flex-col justify-between"
              >
                <div className="h-32 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center relative group">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40"
                      title="Open Original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleCopy(asset.url)}
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase text-[#00D5FF]">{asset.category}</span>
                    <span className="text-[#A0AEC0]">{asset.uploadedAt}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#F5F7FA] truncate">{asset.name}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCopy(asset.url)}
                    className="text-[#00D5FF] hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedUrl === asset.url ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Security Note */}
      <div className="p-4 rounded-xl bg-[#0D1420] border border-white/5 flex items-center space-x-3 text-xs text-[#A0AEC0]">
        <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
        <p>
          Files are transferred directly to the project's production Firebase Storage bucket. Storage
          security rules prevent unauthorized write and delete calls.
        </p>
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={uploadCategory}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};
