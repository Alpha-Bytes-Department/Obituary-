"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AUTO_DELAY = 3200;
const VISIBLE_SLIDES = 6;

type ImageSliderProps = {
  images: string[];
};

function buildSlides(images: string[]): string[] {
  if (images.length === 0) {
    return [];
  }

  if (images.length >= VISIBLE_SLIDES) {
    return images.slice(0, VISIBLE_SLIDES);
  }

  const slides = [...images];
  while (slides.length < VISIBLE_SLIDES) {
    slides.push(images[slides.length % images.length]);
  }

  return slides;
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const slides = useMemo(() => buildSlides(images), [images]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setCurrent((value) =>
      slides.length === 0 ? 0 : (value + 1) % slides.length,
    );
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrent((value) =>
      slides.length === 0 ? 0 : (value - 1 + slides.length) % slides.length,
    );
  }, [slides.length]);

  const restartTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setCurrent((value) =>
        slides.length === 0 ? 0 : (value + 1) % slides.length,
      );
    }, AUTO_DELAY);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }

    restartTimer();

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [restartTimer, slides.length]);

  useEffect(() => {
    setCurrent((value) => (slides.length === 0 ? 0 : value % slides.length));
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    goToPrev();
    restartTimer();
  };

  const handleNext = () => {
    goToNext();
    restartTimer();
  };

  return (
    <div className="select-none">
      <div className="mx-auto flex max-w-5xl items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous slide"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:text-slate-950 sm:h-12 sm:w-12"
        >
          ‹
        </button>

        <div className="relative flex-1 overflow-hidden rounded-[1.75rem] bg-[#f5f0e8] shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={slides[current]}
              alt={`Memorial image ${current + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 960px"
              className="object-contain p-3 sm:p-4"
              priority
            />
          </div>

          {slides.length > 1 ? (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrent(index);
                    restartTimer();
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${index === current ? "w-7 bg-[#274877]" : "w-2.5 bg-white/85"}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:text-slate-950 sm:h-12 sm:w-12"
        >
          ›
        </button>
      </div>
    </div>
  );
}
