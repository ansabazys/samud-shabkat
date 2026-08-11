"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

const slides = [
  {
    id: "slide-1",
    badgeText: "SUMMER OFFERS",
    discountBadge: "SAVE UP TO 35%",
    title: "SAVE UP TO 35% ON PROJECTORS & DISPLAYS",
    subtitle:
      "Upgrade your home & office setup with high-resolution 4K laser projectors, studio monitors, and smart display solutions.",
    ctaText: "BUY NOW",
    ctaLink: "/products?category=monitors",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop",
    accentColor: "bg-red-600",
  },
  {
    id: "slide-2",
    badgeText: "FLASH SALE",
    discountBadge: "UP TO 40% OFF",
    title: "NEXT-GEN GAMING LAPTOPS & WORKSTATIONS",
    subtitle:
      "Experience uncompromising engineering and gaming performance with Intel Core Ultra processors and RTX 40-Series graphics.",
    ctaText: "SHOP NOW",
    ctaLink: "/products?category=laptops",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop",
    accentColor: "bg-blue-600",
  },
  {
    id: "slide-3",
    badgeText: "ENTERPRISE NETWORK",
    discountBadge: "SPECIAL B2B PRICING",
    title: "HIGH-DENSITY SWITCHES & CORE ROUTERS",
    subtitle:
      "Authentic Cisco Catalyst managed switches, MikroTik Cloud Core routers, and fiber optic transceivers in local stock.",
    ctaText: "EXPLORE CATALOG",
    ctaLink: "/products?category=switches-routers",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop",
    accentColor: "bg-slate-900",
  },
];

export function HomepageHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = slides[currentIndex];

  return (
    <section
      className="relative w-full bg-[#EFEFEF] py-8 sm:py-12 border-b border-neutral-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Full Width Banner Container */}
        <div className="bg-[#EAEAEA] rounded-3xl border border-neutral-300/80 p-6 sm:p-12 relative overflow-hidden shadow-sm transition-all duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Offer Badges & Promotional Text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />{" "}
                  {slide.badgeText}
                </span>
                {slide.discountBadge && (
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {slide.discountBadge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight leading-[1.1] font-sans uppercase">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                {slide.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-[#E60000] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  {slide.ctaText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Promotional Technology Product Imagery */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-neutral-300 shadow-md">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-opacity duration-700"
                />

                {/* Promotional Overlay Badge */}
                <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
                  PROMO DEAL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Left Navigation Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-neutral-300 shadow-md flex items-center justify-center transition hover:scale-105"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Carousel Right Navigation Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-neutral-300 shadow-md flex items-center justify-center transition hover:scale-105"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Slide Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-slate-900"
                  : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
