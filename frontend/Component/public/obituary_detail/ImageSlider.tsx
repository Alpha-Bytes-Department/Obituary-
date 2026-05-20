"use client";
import React from "react";

/**
 * ImageSlider - minimal client-side slider for images.
 */

export default function ImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = React.useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className="relative">
      <img
        src={images[index]}
        alt="obituary image"
        className="w-full h-64 object-cover rounded"
      />
      {images.length > 1 && (
        <div className="flex justify-between mt-2">
          <button
            onClick={() =>
              setIndex((i) => (i - 1 + images.length) % images.length)
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
