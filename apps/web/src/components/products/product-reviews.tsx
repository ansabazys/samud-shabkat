"use client";

import { Star, CheckCircle2, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

interface ProductReviewsProps {
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export function ProductReviews({
  rating,
  reviewsCount,
  reviews,
}: ProductReviewsProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Rating Breakdown Header */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="text-4xl sm:text-5xl font-black text-slate-950">
            {rating.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-extrabold text-slate-600">
              Based on {reviewsCount} verified customer reviews
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-2xs">
            <span className="text-xs font-black text-emerald-700 block">
              100% Genuine
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Verified Buyers Only
            </span>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-2xs">
            <span className="text-xs font-black text-blue-700 block">
              KSA Delivery
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Fast Express Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Customer Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900">
                  {rev.author}
                </span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Purchase</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {rev.date}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(rev.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
              {rev.title}
            </h5>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {rev.comment}
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <button className="flex items-center gap-1 hover:text-slate-700 cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
