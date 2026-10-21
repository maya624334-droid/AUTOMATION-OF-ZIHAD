import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  title?: string;
  category?: string; // 'logos' | 'projects' | 'services' | 'avatar'
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Upload Image Asset',
  category = 'media',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Clean file name
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = Date.now();
      const storagePath = `uploads/${category}/${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(p));
        },
        (err) => {
          console.error('Storage Upload Error:', err);
          setError(`Upload failed: ${err.message}. Ensure admin credentials and storage rules are deployed.`);
          setIsUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setSuccess(true);
          setIsUploading(false);
          setTimeout(() => {
            onSuccess(downloadUrl);
            onClose();
          }, 800);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111B2A] border border-[#00D5FF]/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-[#F5F7FA] mb-1">{title}</h3>
        <p className="text-xs text-[#A0AEC0] mb-4">
          File will be uploaded to Firebase Storage and linked to your website.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center space-x-2 text-xs text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Upload successful! Linking asset...</span>
          </div>
        )}

        {/* Drop zone / selection */}
        <label className="border-2 border-dashed border-white/10 hover:border-[#00D5FF]/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-[#0D1420]/50 mb-4 block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {preview ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-36 max-w-full rounded-lg object-contain border border-white/10"
              />
              <span className="text-xs text-[#00D5FF]">Click to change file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#00D5FF]/10 text-[#00D5FF] flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#F5F7FA]">Choose an image to upload</span>
              <span className="text-[11px] text-[#A0AEC0]">PNG, JPG, SVG, WebP up to 10MB</span>
            </div>
          )}
        </label>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#A0AEC0] mb-1">
              <span>Uploading to Firebase Storage...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#A0AEC0] hover:text-white bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading || success}
            className="px-5 py-2 rounded-lg text-xs font-bold text-[#070B12] bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] disabled:opacity-50 hover:shadow-lg hover:shadow-[#00D5FF]/20 flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload to Storage</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
