"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    id: "slide-1",
    eyebrow: "Featured Collection",
    headline: "Everything you need for your setup.",
    description:
      "Shop computers, components, networking gear and everyday tech from trusted brands.",
    primaryCtaText: "Shop Products",
    primaryCtaLink: "/products",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/products",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1400&auto=format&fit=crop",
    alt: "Modern computer & tech setup",
  },
  {
    id: "slide-2",
    eyebrow: "Networking & Enterprise",
    headline: "High-performance gear for seamless connectivity.",
    description:
      "Explore switches, routers, access points and server infrastructure ready for immediate dispatch.",
    primaryCtaText: "Shop Products",
    primaryCtaLink: "/products?category=networking",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/products",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1400&auto=format&fit=crop",
    alt: "Networking hardware showcase",
  },
  {
    id: "slide-3",
    eyebrow: "Components & Storage",
    headline: "Built for speed, reliability, and growth.",
    description:
      "Upgrade your build with high-speed SSDs, NAS storage solutions, processors and graphics cards.",
    primaryCtaText: "Shop Products",
    primaryCtaLink: "/products?category=components",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/products",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&auto=format&fit=crop",
    alt: "Hardware components and servers",
  },
];

export function HomepageHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full bg-white pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Human Copy */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>{slide.eyebrow}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12] mb-4 font-sans">
            {slide.headline.includes("setup.") ? (
              <>
                Everything you need for{" "}
                <span className="text-slate-900">your setup.</span>
              </>
            ) : slide.headline.includes("connectivity.") ? (
              <>
                High-performance gear for{" "}
                <span className="text-emerald-700">seamless connectivity.</span>
              </>
            ) : (
              <>
                Built for speed, reliability,{" "}
                <span className="text-emerald-700">and growth.</span>
              </>
            )}
          </h1>

          {/* Short Supporting Sentence */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl font-normal mb-8">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={slide.primaryCtaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <span>{slide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={slide.secondaryCtaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs sm:text-sm border border-slate-200 transition-all hover:border-slate-300 cursor-pointer"
            >
              <span>{slide.secondaryCtaText}</span>
            </Link>
          </div>
        </div>

        {/* Clean Centered Product Visual Showcase */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)]">
            <div className="aspect-[16/8] sm:aspect-[16/7] w-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </div>
          </div>

          {/* Minimal Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs flex items-center justify-center hover:bg-white hover:text-slate-900 transition cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs flex items-center justify-center hover:bg-white hover:text-slate-900 transition cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? "w-6 bg-slate-900"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
