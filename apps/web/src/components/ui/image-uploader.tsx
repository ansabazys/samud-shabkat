"use client";

import { useState, useRef } from "react";
import { UploadCloud, Star, Trash2, Loader2 } from "lucide-react";

export interface ImageItem {
  id: string;
  url: string;
  isPrimary?: boolean;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  folder?: "products" | "categories" | "brands";
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      const newImages: ImageItem[] = [...images];

      for (let i = 0; i < fileList.length; i++) {
        if (newImages.length >= maxFiles) break;
        const file = fileList[i];

        // Create instant blob preview URL for UX response
        const blobUrl = URL.createObjectURL(file);
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url: blobUrl,
          isPrimary: newImages.length === 0,
        });
      }

      onChange(newImages);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const togglePrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(updated);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-cyan-500 bg-cyan-950/30 scale-[1.01]"
            : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/avif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400">
              <UploadCloud className="w-6 h-6" />
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-white block">
              {uploading
                ? "Processing Image Upload..."
                : "Click or Drag & Drop images here"}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Supports PNG, JPG, WebP up to 5MB (Max {maxFiles} files)
            </span>
          </div>
        </div>
      </div>

      {/* Image Thumbnails List */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border transition ${
                img.isPrimary
                  ? "border-cyan-500 ring-2 ring-cyan-500/30"
                  : "border-slate-800"
              }`}
            >
              <img
                src={img.url}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              {img.isPrimary && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                  Primary
                </span>
              )}

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePrimary(img.id);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    img.isPrimary
                      ? "bg-amber-500 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 hover:text-amber-400 border-slate-700"
                  }`}
                  title={img.isPrimary ? "Primary Image" : "Set as Primary"}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-700 transition"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
