"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const slides = [
  {
    title: "Summer Tech Sale",
    subtitle: "Up to 40% off electronics from top vendors",
    cta: "Shop Electronics",
    href: "/products?category=electronics",
    gradient: "from-blue-900/80 to-indigo-900/60",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
  },
  {
    title: "Fashion Week Deals",
    subtitle: "Trending styles at unbeatable prices",
    cta: "Explore Fashion",
    href: "/products?category=fashion",
    gradient: "from-fuchsia-900/80 to-pink-900/60",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
  },
  {
    title: "Gaming Zone",
    subtitle: "Consoles, games & gear — level up today",
    cta: "Shop Gaming",
    href: "/products?category=gaming",
    gradient: "from-violet-900/80 to-purple-900/60",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
  },
  {
    title: "Free Shipping",
    subtitle: "On orders over $50 — shop from multiple vendors",
    cta: "Start Shopping",
    href: "/products",
    gradient: "from-emerald-900/80 to-teal-900/60",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden rounded-2xl shadow-xl">
      <div className="relative min-h-[280px] sm:min-h-[360px]">
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
          </div>
        ))}

        <div className="relative z-10 flex min-h-[280px] flex-col justify-center px-8 py-12 text-white sm:min-h-[360px] sm:px-16 sm:py-16">
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Deals of the week
          </div>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-lg text-lg text-white/90">{slide.subtitle}</p>
          <Link
            href={slide.href}
            className="mt-8 inline-flex w-fit rounded-xl bg-white px-8 py-3.5 font-bold text-gray-900 shadow-lg transition hover:scale-105 hover:bg-gray-50"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2.5 backdrop-blur transition hover:bg-white/35"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2.5 backdrop-blur transition hover:bg-white/35"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
