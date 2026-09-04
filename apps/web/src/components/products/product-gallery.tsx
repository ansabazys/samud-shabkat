"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string }[];
  title: string;
  badge?: string;
  discount?: string;
}

export function ProductGallery({
  images,
  title,
  badge,
  discount,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const activeImage = images[selectedImageIndex] ||
    images[0] || {
      url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
      alt: title,
    };

  return (
    <div className="space-y-4 font-sans">
      {/* Main Preview Container */}
      <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200/90 p-4 overflow-hidden shadow-2xs group">
        {/* Badges */}
        <div className="absolute top-4 start-4 end-4 flex items-center justify-between z-10 pointer-events-none">
          {badge && (
            <span className="bg-[#15803d] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
              {badge}
            </span>
          )}
          {discount && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs ms-auto">
              {discount} OFF
            </span>
          )}
        </div>

        <img
          src={activeImage.url}
          alt={activeImage.alt || title}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thumbnail Selector Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-20 h-20 rounded-xl bg-slate-50 border p-1 shrink-0 transition cursor-pointer overflow-hidden ${
                selectedImageIndex === idx
                  ? "border-[#15803d] ring-2 ring-emerald-600/30"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
